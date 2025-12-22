
---

# 🔐 AI-Powered KYC Verification System

A full-stack MERN + Python OCR platform for automated KYC processing with document extraction, facial verification, and AML/PEP screening.

This system collects customer information, extracts text using OCR from uploaded identity/address documents, matches extracted fields with user-declared KYC data, runs AML/PEP name screening, and finally assigns a **KYC Approved / Rejected / Pending** status automatically.

---


### ✅ End-to-End KYC Flow

1. **User Registration & Login** (JWT-secured)
2. **KYC Details Input** (name, DOB, gender, etc.)
3. **Document Upload**

   * Government ID
   * Address Proof
   * Selfie
4. **OCR Extraction (Python Service)**

   * Text extraction
   * Brightness/blur quality checks
   * Name & DOB recognition
5. **Field Matching**

   * Compare extracted text with user-declared KYC fields
6. **AML / PEP Screening**

   * Check name against AML lists
   * Check against PEP (Politically Exposed Person) lists
7. **Final KYC Decision**

   * ✔️ Approved
   * ❌ Rejected
   * ⏳ Pending / Needs Review

---

## 📂 Project Structure

```
KYC-App/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── aml_data.json
│   ├── uploads/
│   ├── .env
│   └── python/
│       ├── ocr_service.py
│       └── utilities/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── README.md
```

---

## 🔑 Environment Variables

Create a **backend/.env** file:

```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret
GEMINI_API_KEY=your-key
```

### ⚠️ Important

Update your **Gemini API Key** inside:

```
backend/python/.ocr
```

(or wherever your project stores it)

---

## 🧠 Tech Stack

### **Frontend**

* React
* React Router
* Axios
* React Webcam
* Tailwind CSS
* Vite

### **Backend**

* Node.js + Express
* JWT Auth
* Multer (file uploads)
* MongoDB + Mongoose
* Google Gemini 2.5 Flash (for RAG checks and parsing)
* Python OCR microservice

### **Python OCR Engine**

* `opencv-python`
* `numpy`
* `pytesseract`
* `easyocr`
* `Pillow`
* `scikit-image`
* `matplotlib`
* `python-dotenv`

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```
git clone https://github.com/yourname/KYC-App.git
cd KYC-App
```

---

## 🖥️ Backend Setup

### Install Node Packages

```
cd backend
npm install
```

### Install Python Dependencies

Create a virtual environment (recommended):

```
python -m venv venv
venv\Scripts\activate   # Windows
```

Install required packages:

```
pip install opencv-python numpy pytesseract easyocr Pillow scikit-image matplotlib python-dotenv
```

### Start Backend Server

```
node server.js
```

Server runs at:

```
http://localhost:5000
```

---

## 💻 Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔄 Complete Flow to Run the System

1. Start Python OCR service automatically when backend calls it
2. Start backend

   ```
   node server.js
   ```
3. Start frontend

   ```
   npm run dev
   ```
4. Create a user → login
5. Fill KYC form
6. Upload documents
7. OCR extracts data
8. Backend matches extracted fields
9. AML/PEP check
10. Admin dashboard shows status
11. Approve/Reject

---

## 📌 Future Enhancements (Optional Section)

* Live face-matching with ID image
* Multi-language OCR
* Fully automated regulator-grade AML screening
* Audit logs
* Dashboard analytics

---

## 📝 License

This project is open-source under the MIT License.

---

