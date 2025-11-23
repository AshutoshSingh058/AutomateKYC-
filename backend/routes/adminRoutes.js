// backend/routes/adminRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const Document = require("../models/Document"); // your existing Document model

const router = express.Router();

// Grab the already-registered User model from mongoose
const User = mongoose.model("User");

// GET /admin/users  -> list all users for admin dashboard
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error("Admin /users error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

// GET /admin/user-docs/:userId  -> all documents of a specific user
router.get("/user-docs/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const docs = await Document.find({ "user_id._id": userId }).lean();
    // ^ if your user_id is stored directly as ObjectId, use: { user_id: userId }

    res.json(docs);
  } catch (err) {
    console.error("Admin /user-docs error:", err);
    res.status(500).json({ message: "Failed to load user documents" });
  }
});

module.exports = router;
