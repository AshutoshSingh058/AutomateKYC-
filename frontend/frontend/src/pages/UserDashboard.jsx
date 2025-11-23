import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";

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

        // Pick first doc with AI output
        const doc = res.data.find((d) => d.ai_output);
        if (doc) setAiSummary(doc.ai_output);
      });
  }, [token]);

  if (!user) return null;

  const badgeClass = {
    APPROVED: "badge bg-success",
    NEEDS_REVIEW: "badge bg-warning text-dark",
    REJECTED: "badge bg-danger",
    PENDING_DOCS: "badge bg-primary",
    PROCESSING: "badge bg-info text-dark",
    NOT_STARTED: "badge bg-secondary",
  };

  return (
    <Layout>
      <div className="container py-4">

        {/* USER CARD */}
        <div className="card shadow-sm mb-4 border-0 rounded-4">
          <div className="card-body">
            <h2 className="fw-bold text-success">{user.name}</h2>
            <p className="text-muted">{user.email}</p>

            <div className="mt-3">
              <span className="fw-semibold me-2 fs-6">KYC Status:</span>
              <span className={badgeClass[user.kyc_status]}>
                {user.kyc_status}
              </span>
            </div>
          </div>
        </div>

        {/* AI SUMMARY CARD */}
        {aiSummary && (
          <div className="card shadow-sm mb-4 border-0 rounded-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3 text-success">AI Assessment Summary</h4>

              <p className="text-muted">{aiSummary.summary_text}</p>

              {/* MATCH RESULTS */}
              <div className="row mt-4">
                {Object.entries(aiSummary.match || {}).map(([key, val]) => (
                  <div className="col-md-3 col-sm-6 mb-3" key={key}>
                    <div className="border rounded p-3 text-center shadow-sm">
                      <p className="text-uppercase small text-muted fw-semibold">
                        {key.replace("_", " ")}
                      </p>
                      <p
                        className={`fw-bold fs-5 ${
                          val === "YES" ? "text-success" : "text-danger"
                        }`}
                      >
                        {val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* RISK LEVEL */}
              <div className="mt-3 p-3 border rounded shadow-sm">
                <p className="small fw-semibold text-muted">Risk Level</p>
                <p
                  className={`fw-bold fs-4 ${
                    aiSummary.risk === "LOW"
                      ? "text-success"
                      : aiSummary.risk === "MEDIUM"
                      ? "text-warning"
                      : "text-danger"
                  }`}
                >
                  {aiSummary.risk}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT LIST */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-success">Uploaded Documents</h4>

            {docs.length === 0 ? (
              <p className="text-muted">No documents uploaded yet.</p>
            ) : (
              <div className="row">
                {docs.map((doc) => (
                  <div className="col-md-4 mb-4" key={doc._id}>
                    <div className="border rounded p-3 shadow-sm h-100">

                      <h5 className="fw-bold">
                        {doc.document_type.replace("_", " ")}
                      </h5>

                      <p className="text-muted small">{doc.original_name}</p>

                      <span className={`${badgeClass[doc.status]} mb-3`}>
                        {doc.status}
                      </span>

                      <br />

                      <a
                        href={`http://localhost:5000/uploads/${doc.file_name}`}
                        target="_blank"
                        className="text-success fw-semibold mt-2 d-inline-block"
                      >
                        View Document →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
