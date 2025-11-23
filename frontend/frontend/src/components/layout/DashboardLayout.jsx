import { Link, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const sidebarLinks = [
    { name: "User Dashboard", path: "/user" },
    { name: "Admin Dashboard", path: "/admin" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">

        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500" />
            <span className="text-xl font-bold text-gray-900">SecureKYC</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* TOP NAVBAR */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
