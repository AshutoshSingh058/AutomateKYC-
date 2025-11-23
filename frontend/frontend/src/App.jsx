import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import UserDashboard from "./UserDashboard";
import Dashboard from "./Dashboard"; // admin dashboard

// KYC Step Components
import KycDetails from "./pages/KycDetails";
import UploadId from "./pages/UploadId";
import UploadAddress from "./pages/UploadAddress";
import UploadSelfie from "./pages/UploadSelfie";
import KycStatus from "./pages/KycStatus";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                KYC Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Secure KYC Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your identity verification process with our secure and
            efficient Know Your Customer platform
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          {/* User Portal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              User Portal
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your documents and track your KYC verification status
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Register Now
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
            </div>
          </div>

          {/* Admin Portal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Admin Portal
            </h3>
            <p className="text-gray-600 mb-6">
              Review and verify user documents with AI-powered analysis
            </p>
            <button
              onClick={() => navigate("/admin")}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Admin Dashboard
            </button>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-semibold mb-3">Key Features</h3>
            <ul className="space-y-3 text-blue-50">
              <li>Secure document upload</li>
              <li>AI-powered verification</li>
              <li>Real-time status tracking</li>
              <li>OCR document extraction</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home & Auth */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* User Dashboard */}
        <Route path="/user" element={<UserDashboard />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Dashboard />} />

        {/* KYC Flow */}
        <Route path="/kyc/details" element={<KycDetails />} />
        <Route path="/kyc/upload-id" element={<UploadId />} />
        <Route path="/kyc/upload-address" element={<UploadAddress />} />
        <Route path="/kyc/upload-selfie" element={<UploadSelfie />} />
        <Route path="/kyc/status" element={<KycStatus />} />

      </Routes>
    </Router>
  );
}

export default App;
