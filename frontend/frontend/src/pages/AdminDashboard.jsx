import { useState } from "react";

export default function AdminDashboard() {

  // Hardcoded dummy users
  const [users] = useState([
    {
      id: 1,
      name: "Ashutosh Singh",
      email: "ashutosh@example.com",
      kycStatus: "APPROVED",
      created_at: "2024-12-10",
    },
    {
      id: 2,
      name: "Rohit Sharma",
      email: "rohit@example.com",
      kycStatus: "PENDING",
      created_at: "2024-12-12",
    },
    {
      id: 3,
      name: "Neha Verma",
      email: "neha@example.com",
      kycStatus: "REJECTED",
      created_at: "2024-12-15",
    },
  ]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Registered Users</h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">KYC Status</th>
              <th className="p-4 border-b">Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{user.id}</td>
                <td className="p-4 border-b">{user.name}</td>
                <td className="p-4 border-b">{user.email}</td>
                <td
                  className={`p-4 border-b font-bold ${
                    user.kycStatus === "APPROVED"
                      ? "text-green-600"
                      : user.kycStatus === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {user.kycStatus}
                </td>
                <td className="p-4 border-b">{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
