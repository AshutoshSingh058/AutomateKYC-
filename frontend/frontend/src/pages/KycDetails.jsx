import { useState } from "react";
import axios from "axios";

export default function KycDetails() {
  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitDetails() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    setLoading(true);

    await axios.post("http://localhost:5000/user/declare", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    window.location.href = "/kyc/upload-id";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Step Indicator */}
        <div className="flex justify-between mb-10">
          {["Details", "ID", "Address", "Selfie", "Status"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  i === 0 ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
              <span
                className={`text-xs mt-2 font-medium ${
                  i === 0 ? "text-blue-600" : "text-gray-500"
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
            Enter Your KYC Details
          </h1>

          <div className="space-y-6">

            <div>
              <label className="font-semibold text-gray-700">Full Name</label>
              <input
                name="full_name"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
                onChange={update}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Date of Birth</label>
              <input
                name="dob"
                type="date"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                onChange={update}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Gender</label>
              <select
                name="gender"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                onChange={update}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Address</label>
              <textarea
                name="address"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter residential address"
                onChange={update}
              ></textarea>
            </div>

            <button
              onClick={submitDetails}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg mt-4 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Next → Upload ID Proof"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
