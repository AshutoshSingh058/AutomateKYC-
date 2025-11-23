// =====================================================
// IMPORTS
// =====================================================
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// MONGO CONNECTION
// =====================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// =====================================================
// AML / PEP DATA
// =====================================================
const amlData = require("./aml_data.json");

// =====================================================
// USER SCHEMA
// =====================================================
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password_hash: String,
  created_at: { type: Date, default: Date.now },

  declared_kyc: {
    full_name: String,
    dob: String,
    gender: String,
    address: String
  },

  kyc_status: {
    type: String,
    default: "NOT_STARTED",
    enum: ["NOT_STARTED", "PENDING_DOCS", "PROCESSING", "NEEDS_REVIEW", "APPROVED", "REJECTED"]
  }
});
const User = mongoose.model("User", UserSchema);

// =====================================================
// DOCUMENT SCHEMA
// =====================================================
const DocumentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  document_type: { type: String, default: "UNKNOWN" }, // ID_PROOF / ADDRESS_PROOF / SELFIE

  file_name: String,
  original_name: String,
  mime_type: String,
  upload_time: String,

  quality: Object,
  ocr_raw_text: String,
  ocr_fields: Object,

  ai_output: Object,
  risk_assessment: Object,

  status: { type: String, default: "PENDING" }
});
const Document = mongoose.model("Document", DocumentSchema);

// =====================================================
// EXPRESS + MIDDLEWARE
// =====================================================
const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// GEMINI SETUP
// =====================================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// =====================================================
// AUTH HELPERS
// =====================================================
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d"
  });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// =====================================================
// MULTER UPLOAD
// =====================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + Math.round(Math.random() * 10000);
    cb(null, name + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// =====================================================
// AUTH ROUTES
// =====================================================

// REGISTER
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password_hash: hash
    });

    const token = createToken(user);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  const token = createToken(user);

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
});

// ---------------------- CURRENT USER ----------------------
app.get("/user/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("name email declared_kyc kyc_status created_at");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});




// =====================================================
// SAVE DECLARED KYC DETAILS
// =====================================================
app.post("/user/declare", authMiddleware, async (req, res) => {
  await User.updateOne(
    { _id: req.userId },
    {
      declared_kyc: req.body,
      kyc_status: "PENDING_DOCS"
    }
  );
  res.json({ success: true });
});

// =====================================================
// CHECK IF USER UPLOADED ALL DOCUMENTS
// =====================================================
async function allDocsUploaded(userId) {
  const docs = await Document.find({ user_id: userId });

  return (
    docs.some((d) => d.document_type === "ID_PROOF") &&
    docs.some((d) => d.document_type === "ADDRESS_PROOF") &&
    docs.some((d) => d.document_type === "SELFIE")
  );
}

// =====================================================
// PYTHON OCR FUNCTION
// =====================================================
function runPythonOCR(fullPath) {
  return new Promise((resolve) => {
    const python = spawn("python", ["ocr_service.py", fullPath], {
      cwd: __dirname
    });

    let out = "";
    let err = "";

    python.stdout.on("data", (d) => (out += d.toString()));
    python.stderr.on("data", (d) => (err += d.toString()));

    python.on("close", () => {
      if (err) console.log("OCR stderr:", err);

      try {
        resolve(JSON.parse(out));
      } catch {
        resolve(null);
      }
    });
  });
}

// =====================================================
// AUTO-KYC PROCESSOR
// =====================================================
async function processKYC(userId) {
  try {
    const user = await User.findById(userId);
    const docs = await Document.find({ user_id: userId });

    const idDoc = docs.find((d) => d.document_type === "ID_PROOF");
    const addrDoc = docs.find((d) => d.document_type === "ADDRESS_PROOF");

    if (!idDoc || !addrDoc) return;

    const ocrID = await runPythonOCR(path.join(__dirname, "uploads", idDoc.file_name));
    const ocrADDR = await runPythonOCR(path.join(__dirname, "uploads", addrDoc.file_name));

    await Document.updateOne({ _id: idDoc._id }, {
      quality: ocrID?.quality,
      ocr_raw_text: ocrID?.raw_text,
      ocr_fields: ocrID?.fields
    });

    await Document.updateOne({ _id: addrDoc._id }, {
      quality: ocrADDR?.quality,
      ocr_raw_text: ocrADDR?.raw_text,
      ocr_fields: ocrADDR?.fields
    });

    const combined = `
ID DOCUMENT:
${ocrID?.raw_text || ""}

ADDRESS DOCUMENT:
${ocrADDR?.raw_text || ""}
`;

    const prompt = `
You are an AI KYC engine.
Return strict JSON:
{
  "summary_text": "...",
  "match": {...},
  "aml": {...},
  "risk": "...",
  "final_status": "APPROVED" | "NEEDS_REVIEW"
}

Declared:
${JSON.stringify(user.declared_kyc)}

OCR:
${combined}

AML:
${JSON.stringify(amlData)}
`;

    const reply = await model.generateContent(prompt);
    const text = reply.response.text().replace(/```json|```/g, "");
    const ai = JSON.parse(text);

    await Document.updateMany({ user_id: userId }, {
      ai_output: ai,
      risk_assessment: ai.risk
    });

    await User.updateOne({ _id: userId }, { kyc_status: ai.final_status });

  } catch (err) {
    console.log("Auto KYC error:", err);
    await User.updateOne({ _id: userId }, { kyc_status: "NEEDS_REVIEW" });
  }
}

// =====================================================
// DOCUMENT UPLOAD (ID / ADDRESS / SELFIE)
// =====================================================
app.post(
  "/user/upload-document",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });

    const doc = await Document.create({
      user_id: req.userId,
      document_type: req.body.document_type || "UNKNOWN",
      file_name: req.file.filename,
      original_name: req.file.originalname,
      mime_type: req.file.mimetype,
      upload_time: new Date().toISOString()
    });

    const ready = await allDocsUploaded(req.userId);

    if (ready) {
      await User.updateOne(
        { _id: req.userId },
        { kyc_status: "PROCESSING" }
      );
      processKYC(req.userId);
    }

    res.json({ uploaded: true, ready_for_processing: ready });
  }
);

// =====================================================
// GET USER DOCS
// =====================================================
app.get("/user/my-docs", authMiddleware, async (req, res) => {
  const docs = await Document.find({ user_id: req.userId });
  res.json(docs);
});

// =====================================================
// ADMIN: ALL DOCS
// =====================================================
app.get("/all-docs", async (req, res) => {
  const docs = await Document.find({})
    .populate("user_id", "name email declared_kyc kyc_status");
  res.json(docs);
});

// =====================================================
// STATIC FILES
// =====================================================
app.use("/uploads", express.static("uploads"));

// =====================================================
// START SERVER
// =====================================================
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
