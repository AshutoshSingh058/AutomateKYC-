import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingFile, setProcessingFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function loadDocs() {
    try {
      const res = await axios.get("http://localhost:5000/all-docs");
      setDocs(res.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load documents" });
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  async function runOCR(file) {
    setLoading(true);
    setProcessingFile(file);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.get("http://localhost:5000/run-ocr", {
        params: { file }
      });
      setSelectedDoc({ type: "OCR", data: res.data });
      setMessage({ type: "success", text: "OCR processing completed" });
    } catch (error) {
      setMessage({ type: "error", text: "OCR processing failed" });
    } finally {
      setLoading(false);
      setProcessingFile(null);
      loadDocs();
    }
  }

  async function analyzeDoc(file) {
    setLoading(true);
    setProcessingFile(file);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.get("http://localhost:5000/analyze-doc", {
        params: { file }
      });
      setSelectedDoc({ type: "AI", data: res.data });
      setMessage({ type: "success", text: "AI analysis completed" });
    } catch (error) {
      setMessage({ type: "error", text: "AI analysis failed" });
    } finally {
      setLoading(false);
      setProcessingFile(null);
      loadDocs();
    }
  }

  async function verify(id) {
    try {
      await axios.post("http://localhost:5000/verify", { id });
      setMessage({ type: "success", text: "Document verified successfully" });
      loadDocs();
    } catch (error) {
      setMessage({ type: "error", text: "Verification failed" });
    }
  }

  async function reject(id) {
    if (!window.confirm("Are you sure you want to reject this document?")) return;

    try {
      await axios.post("http://localhost:5000/reject", { id });
      setMessage({ type: "success", text: "Document rejected" });
      loadDocs();
    } catch (error) {
      setMessage({ type: "error", text: "Rejection failed" });
    }
  }

  const stats = {
    total: docs.length,
    verified: docs.filter(d => d.status === "VERIFIED").length,
    pending: docs.filter(d => d.status === "PENDING").length,
    rejected: docs.filter(d => d.status === "REJECTED").length
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow p-6 rounded-xl">
          <p className="text-gray-600 text-sm">Total Documents</p>
          <p className="text-3xl font-semibold">{stats.total}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <p className="text-gray-600 text-sm">Verified</p>
          <p className="text-3xl font-semibold text-green-600">{stats.verified}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-semibold text-yellow-600">{stats.pending}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <p className="text-gray-600 text-sm">Rejected</p>
          <p className="text-3xl font-semibold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">KYC Documents</h2>
        </div>

        {docs.length === 0 ? (
          <p className="p-6 text-center text-gray-600">No documents uploaded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs">User</th>
                  <th className="px-6 py-3 text-left text-xs">Type</th>
                  <th className="px-6 py-3 text-left text-xs">File</th>
                  <th className="px-6 py-3 text-left text-xs">Status</th>
                  <th className="px-6 py-3 text-left text-xs">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {docs.map(doc => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{doc.user_id?.email}</td>
                    <td className="px-6 py-4">{doc.document_type.replace(/_/g, " ")}</td>

                    <td className="px-6 py-4">
                      <a
                        href={`http://localhost:5000/uploads/${doc.file_name}`}
                        className="text-blue-600 underline"
                        target="_blank"
                      >
                        {doc.original_name}
                      </a>
                    </td>

                    <td className="px-6 py-4">{doc.status}</td>

                    <td className="px-6 py-4">
                      {new Date(doc.upload_time).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 space-x-4 text-sm">
                      <button
                        onClick={() => runOCR(doc.file_name)}
                        className="text-blue-600 underline"
                      >
                        OCR
                      </button>

                      <button
                        onClick={() => analyzeDoc(doc.file_name)}
                        className="text-purple-600 underline"
                      >
                        AI
                      </button>

                      <button
                        onClick={() => verify(doc._id)}
                        className="text-green-600 underline"
                      >
                        Verify
                      </button>

                      <button
                        onClick={() => reject(doc._id)}
                        className="text-red-600 underline"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Output Panel */}
      {selectedDoc && (
        <div className="mt-8 bg-white shadow p-6 rounded-xl">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">
              {selectedDoc.type === "OCR" ? "OCR Result" : "AI Result"}
            </h2>
            <button onClick={() => setSelectedDoc(null)}>✖</button>
          </div>

          <pre className="bg-gray-100 mt-4 p-4 rounded max-h-96 overflow-auto">
            {JSON.stringify(selectedDoc.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
