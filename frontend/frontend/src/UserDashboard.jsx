import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/user/my-docs", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setDocs(res.data));
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  // -----------------------------
  // KYC STATUS CALCULATION
  // -----------------------------
  function getKYCStatus() {
    if (docs.some((d) => d.status === "REJECTED")) return "KYC FAILED";
    if (docs.some((d) => d.status === "PENDING")) return "UNDER REVIEW";
    if (docs.length > 0 && docs.every((d) => d.status === "VERIFIED"))
      return "KYC VERIFIED";
    return "NOT SUBMITTED";
  }

  const kycStatus = getKYCStatus();

  // KYC COLOR
  const statusColor = {
    "KYC FAILED": "bg-red-100 text-red-800 border-red-300",
    "UNDER REVIEW": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "KYC VERIFIED": "bg-green-100 text-green-800 border-green-300",
    "NOT SUBMITTED": "bg-gray-100 text-gray-800 border-gray-300"
  };

  // -----------------------------
  // AI SUMMARY BUILDER
  // -----------------------------
  function buildAISummary() {
    let allIssues = [];
    let allFields = {};
    let docTypes = [];

    docs.forEach((doc) => {
      if (doc.ai_issues?.length) allIssues.push(...doc.ai_issues);
      if (doc.ai_parsed_fields)
        Object.assign(allFields, doc.ai_parsed_fields);
      if (doc.ai_document_type) docTypes.push(doc.ai_document_type);
    });

    return {
      fields: allFields,
      issues: allIssues,
      detectedTypes: [...new Set(docTypes)]
    };
  }

  const aiSummary = buildAISummary();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/login">Login Required</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">KYC Portal</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ----------------------- */}
        {/* KYC STATUS SECTION */}
        {/* ----------------------- */}
        <div
          className={`p-6 rounded-xl border mb-10 text-center text-xl font-bold ${statusColor[kycStatus]}`}
        >
          KYC Status: {kycStatus}
        </div>

        {/* ----------------------- */}
        {/* AI SUMMARY SECTION */}
        {/* ----------------------- */}

        <div className="bg-white rounded-xl shadow p-8 border mb-12">
          <h2 className="text-2xl font-bold mb-4">AI Summary</h2>

          {aiSummary.detectedTypes.length > 0 && (
            <p className="text-gray-700 mb-4">
              <b>Detected Document Types:</b>{" "}
              {aiSummary.detectedTypes.join(", ")}
            </p>
          )}

          {Object.keys(aiSummary.fields).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Extracted Fields:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm">
                {JSON.stringify(aiSummary.fields, null, 2)}
              </pre>
            </div>
          )}

          {aiSummary.issues.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">AI Flagged Issues:</h3>
              <ul className="list-disc pl-6 text-red-700">
                {aiSummary.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {aiSummary.issues.length === 0 &&
            Object.keys(aiSummary.fields).length === 0 && (
              <p className="text-gray-500">No AI summary available yet.</p>
            )}
        </div>

        {/* ----------------------- */}
        {/* DOCUMENT LIST */}
        {/* ----------------------- */}

        <h2 className="text-2xl font-bold mb-6">Your Documents</h2>

        {docs.length === 0 ? (
          <p className="text-gray-500">No documents uploaded.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-xl p-6 shadow border hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">
                  {doc.document_type.replace(/_/g, " ")}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  File: {doc.original_name}
                </p>

                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColor[doc.status === "VERIFIED"
                    ? "KYC VERIFIED"
                    : doc.status === "REJECTED"
                    ? "KYC FAILED"
                    : "UNDER REVIEW"
                  ]}`}
                >
                  {doc.status}
                </span>

                <a
                  href={`http://localhost:5000/uploads/${doc.file_name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block text-blue-600 font-semibold"
                >
                  View Document →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
