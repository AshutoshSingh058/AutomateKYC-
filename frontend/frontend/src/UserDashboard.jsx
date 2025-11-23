import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/user/my-docs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDocs(res.data);
        const firstDoc = res.data[0];
        if (firstDoc?.ai_output) {
          setAiSummary(firstDoc.ai_output);
        }
      });
  }, [token]);

  if (!user) return null;

  const statusColors = {
    APPROVED: "text-green-600 bg-green-100",
    NEEDS_REVIEW: "text-yellow-600 bg-yellow-100",
    REJECTED: "text-red-600 bg-red-100",
    PENDING_DOCS: "text-blue-600 bg-blue-100",
    PROCESSING: "text-purple-600 bg-purple-100",
    NOT_STARTED: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="space-y-10">

      {/* USER INFO + KYC STATUS */}
      <div className="bg-white p-8 rounded-2xl shadow border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h2>
        <p className="text-gray-600 mt-2">{user.email}</p>

        <div className="mt-6 flex items-center space-x-3">
          <span className="text-lg font-semibold">KYC Status:</span>
          <span
            className={`px-4 py-2 rounded-xl font-bold ${statusColors[user.kyc_status]}`}
          >
            {user.kyc_status}
          </span>
        </div>
      </div>

      {/* AI SUMMARY */}
      {aiSummary && (
        <div className="bg-white p-8 rounded-2xl shadow border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Assessment Summary</h3>

          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {aiSummary.summary_text}
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(aiSummary.match || {}).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-xl border text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase">
                  {key.replace("_", " ")}
                </p>
                <p
                  className={`mt-1 text-lg font-bold ${
                    value === "YES" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
            <p className="text-sm font-semibold text-gray-700">Risk Level:</p>
            <p
              className={`text-xl font-bold ${
                aiSummary.risk === "LOW"
                  ? "text-green-600"
                  : aiSummary.risk === "MEDIUM"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {aiSummary.risk}
            </p>
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Uploaded Documents</h3>

        {docs.length === 0 ? (
          <p className="text-gray-600">No documents uploaded.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-lg transition-all"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {doc.document_type.replace("_", " ")}
                </h4>

                <p className="text-gray-600 text-sm mb-4">{doc.original_name}</p>

                <span
                  className={`px-3 py-1 text-xs rounded-lg font-bold ${statusColors[doc.status]}`}
                >
                  {doc.status}
                </span>

                <a
                  href={`http://localhost:5000/uploads/${doc.file_name}`}
                  target="_blank"
                  className="block mt-4 text-blue-600 hover:text-blue-800 font-medium"
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
