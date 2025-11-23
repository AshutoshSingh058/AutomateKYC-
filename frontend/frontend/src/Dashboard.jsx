import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load all users with KYC documents
  async function loadUsers() {
    try {
      const res = await axios.get("http://localhost:5000/admin/users");
      setUsers(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load users" });
    }
  }

  // Load selected user's documents
  async function loadUserDocs(userId) {
    try {
      const res = await axios.get(`http://localhost:5000/admin/user-docs/${userId}`);
      setDocuments(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load documents" });
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Approve All Documents + Approve KYC
  async function approveKYC() {
    if (!selectedUser) return;

    try {
      await axios.post("http://localhost:5000/admin/approve-kyc", { userId: selectedUser._id });
      setMessage({ type: "success", text: "KYC Approved" });
      loadUserDocs(selectedUser._id);
    } catch {
      setMessage({ type: "error", text: "Failed to approve KYC" });
    }
  }

  // Reject entire KYC
  async function rejectKYC() {
    if (!selectedUser) return;

    try {
      await axios.post("http://localhost:5000/admin/reject-kyc", { userId: selectedUser._id });
      setMessage({ type: "success", text: "KYC Rejected" });
      loadUserDocs(selectedUser._id);
    } catch {
      setMessage({ type: "error", text: "Failed to reject KYC" });
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Message Box */}
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === "error" 
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800"
        }`}>
          {message.text}
        </div>
      )}

      {/* If no user selected — show user list */}
      {!selectedUser ? (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>

          {users.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">KYC Status</th>
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-3">{u.name}</td>
                    <td className="px-2 py-3">{u.email}</td>
                    <td className="px-2 py-3">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        u.kyc_status === "APPROVED" ? "bg-green-100 text-green-700"
                        : u.kyc_status === "REJECTED" ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {u.kyc_status}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          loadUserDocs(u._id);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Review KYC →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <>
          {/* Back Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="mb-6 text-blue-600 hover:underline"
          >
            ← Back to Users
          </button>

          {/* User Info + Approve/Reject */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold mb-2">{selectedUser.name}</h2>
            <p className="text-gray-600 mb-4">{selectedUser.email}</p>

            <div className="flex gap-4">
              <button
                onClick={approveKYC}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve KYC
              </button>

              <button
                onClick={rejectKYC}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject KYC
              </button>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Documents</h3>

            {documents.length === 0 ? (
              <p className="text-gray-500">No documents uploaded</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documents.map(doc => (
                  <div key={doc._id} className="border rounded-lg p-4 bg-gray-50">
                    <p className="font-medium mb-2">{doc.document_type}</p>
                    
                    <img
                      src={`http://localhost:5000/uploads/${doc.file_name}`}
                      alt="Document"
                      className="w-full h-48 object-cover rounded"
                    />

                    <p className="text-sm text-gray-700 mt-3">
                      Status:{" "}
                      <span className={`font-semibold ${
                        doc.status === "APPROVED" ? "text-green-700"
                        : doc.status === "REJECTED" ? "text-red-700"
                        : "text-yellow-700"
                      }`}>
                        {doc.status}
                      </span>
                    </p>

                    <button
                      onClick={() => window.open(`http://localhost:5000/uploads/${doc.file_name}`, "_blank")}
                      className="mt-3 text-blue-600 hover:underline text-sm"
                    >
                      View Full Image
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
