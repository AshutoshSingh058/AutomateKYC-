import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all KYC users
  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    axios
      .get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Admin fetch failed:", err));
  }

  // Fetch docs + AI for a user
  function openUser(u) {
    setSelectedUser(u);
    setLoading(true);

    axios
      .get(`http://localhost:5000/admin/user-docs/${u._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDocs(res.data))
      .finally(() => setLoading(false));
  }

  async function updateKycStatus(status) {
    if (!selectedUser) return;

    await axios.post(
      "http://localhost:5000/admin/update-kyc",
      { user_id: selectedUser._id, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadUsers();
    alert("KYC updated successfully!");
  }

  return (
    <div className="space-y-10">

      {/* USERS TABLE */}
      <div className="bg-white p-8 rounded-2xl shadow border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">All Users</h2>

        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">KYC Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-700 font-semibold">
                      {u.kyc_status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openUser(u)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SELECTED USER PANEL */}
      {selectedUser && (
        <div className="bg-white p-8 rounded-2xl shadow border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Reviewing: {selectedUser.name}
          </h3>
          <p className="text-gray-600 mb-6">{selectedUser.email}</p>

          {loading ? (
            <p className="text-gray-500">Loading documents…</p>
          ) : (
            <div className="space-y-10">
              {/* AI Summary */}
              {docs.length > 0 && docs[0].ai_output && (
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <h4 className="text-xl font-bold mb-3">AI Summary</h4>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {docs[0].ai_output.summary_text}
                  </p>

                  {/* Match Results */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {Object.entries(docs[0].ai_output.match).map(
                      ([key, val]) => (
                        <div
                          key={key}
                          className="p-3 bg-white border rounded-xl text-center"
                        >
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            {key.replace("_", " ")}
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              val === "YES"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {val}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <p className="mt-6 text-lg font-bold">
                    Risk Level:{" "}
                    <span
                      className={
                        docs[0].ai_output.risk === "LOW"
                          ? "text-green-600"
                          : docs[0].ai_output.risk === "MEDIUM"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {docs[0].ai_output.risk}
                    </span>
                  </p>
                </div>
              )}

              {/* Document List */}
              <div>
                <h4 className="text-xl font-bold mb-4">Uploaded Documents</h4>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {docs.map((doc) => (
                    <div
                      key={doc._id}
                      className="bg-white p-6 border rounded-2xl shadow hover:shadow-lg transition"
                    >
                      <h5 className="font-bold text-lg mb-2">
                        {doc.document_type.replace("_", " ")}
                      </h5>

                      <p className="text-gray-600 text-sm mb-3">
                        {doc.original_name}
                      </p>

                      <a
                        href={`http://localhost:5000/uploads/${doc.file_name}`}
                        className="text-blue-600 font-medium hover:text-blue-800"
                        target="_blank"
                      >
                        View Document →
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => updateKycStatus("APPROVED")}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
                >
                  APPROVE
                </button>

                <button
                  onClick={() => updateKycStatus("REJECTED")}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                >
                  REJECT
                </button>

                <button
                  onClick={() => updateKycStatus("NEEDS_REVIEW")}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600"
                >
                  NEEDS REVIEW
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
