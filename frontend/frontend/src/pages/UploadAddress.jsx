import { useState } from "react";
import axios from "axios";

export default function UploadAddress() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return alert("Please upload your Address Proof");

    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("document", file);
    data.append("document_type", "ADDRESS_PROOF");

    setLoading(true);

    await axios.post("http://localhost:5000/user/upload-document", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    window.location.href = "/kyc/upload-selfie";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* Step Indicator */}
        <div className="flex justify-between mb-10">
          {["Details", "ID", "Address", "Selfie", "Status"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  i === 2
                    ? "bg-blue-600"
                    : i < 2
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <span
                className={`text-xs mt-2 font-medium ${
                  i === 2
                    ? "text-blue-600"
                    : i < 2
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Upload Address Proof
          </h1>

          <p className="text-gray-600 mb-6">
            Upload a clear image or PDF of any valid address proof (Aadhaar,
            utility bill, rental agreement, etc.).
          </p>

          <div className="space-y-6">

            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            />

            {file && (
              <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-sm font-medium border border-purple-200">
                Selected: {file.name}
              </div>
            )}

            <button
              onClick={upload}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Next → Upload Selfie"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
