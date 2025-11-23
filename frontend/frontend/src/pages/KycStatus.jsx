import { useEffect, useState } from "react";
import axios from "axios";

export default function KycStatus() {
  const [status, setStatus] = useState("PROCESSING");
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStatus() {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStatus(res.data.kyc_status);
    setAi(res.data.ai_output || null);

    if (
      res.data.kyc_status === "APPROVED" ||
      res.data.kyc_status === "NEEDS_REVIEW" ||
      res.data.kyc_status === "REJECTED"
    ) {
      setLoading(false);
      return true;
    }

    return false;
  }

  useEffect(() => {
    let timer;
    fetchStatus().then((done) => {
      if (!done) {
        timer = setInterval(async () => {
          const isDone = await fetchStatus();
          if (isDone) clearInterval(timer);
        }, 2000);
      }
    });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Step Indicator */}
        <div className="flex justify-between mb-10">
          {["Details", "ID", "Address", "Selfie", "Status"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  i === 4
                    ? "bg-blue-600"
                    : i < 4
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <span
                className={`text-xs mt-2 font-medium ${
                  i === 4
                    ? "text-blue-600"
                    : i < 4
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

          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            KYC Verification Status
          </h1>

          {/* Status */}
          <div className="text-center mb-6">
            <span
              className={`inline-block px-4 py-2 text-sm font-semibold rounded-full border ${
                status === "APPROVED"
                  ? "bg-green-50 text-green-700 border-green-300"
                  : status === "REJECTED"
                  ? "bg-red-50 text-red-700 border-red-300"
                  : status === "NEEDS_REVIEW"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                  : "bg-blue-50 text-blue-700 border-blue-300"
              }`}
            >
              {status}
            </span>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center py-8">
              <svg
                className="animate-spin h-10 w-10 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                ></path>
              </svg>

              <p className="text-gray-600 font-medium">
                Verifying documents… please wait
              </p>
            </div>
          )}

          {/* AI Summary */}
          {!loading && ai && (
            <div className="mt-6 space-y-6">

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Summary
                </h2>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200 leading-relaxed">
                  {ai.summary_text}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Field Match Results
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(ai.match || {}).map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-white border rounded-xl p-3 shadow-sm"
                    >
                      <p className="font-semibold text-gray-600 capitalize">
                        {key.replace("_", " ")}
                      </p>
                      <p
                        className={`font-bold ${
                          val === "YES" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Risk Assessment
                </h3>
                <div
                  className={`p-4 rounded-xl border text-sm font-semibold ${
                    ai.risk === "LOW"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : ai.risk === "MEDIUM"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                      : "bg-red-50 text-red-700 border-red-300"
                  }`}
                >
                  {ai.risk}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
