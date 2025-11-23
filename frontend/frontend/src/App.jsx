import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Public Pages
import Landing from "./pages/Landing";
import Register from "./Register";
import Login from "./Login";

// User/Admin Dashboards
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";


// KYC Flow
import KycDetails from "./pages/KycDetails";
import UploadId from "./pages/UploadId";
import UploadAddress from "./pages/UploadAddress";
import UploadSelfie from "./pages/UploadSelfie";
import KycStatus from "./pages/KycStatus";

// Layout Components
import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC LANDING PAGE (no MainLayout) */}
        <Route path="/" element={<Landing />} />

        {/* PUBLIC PAGES WITH LAYOUT */}
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user"
          element={
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          }
        />

        {/* KYC FLOW (full-screen pages, no layout) */}
        <Route path="/kyc/details" element={<KycDetails />} />
        <Route path="/kyc/upload-id" element={<UploadId />} />
        <Route path="/kyc/upload-address" element={<UploadAddress />} />
        <Route path="/kyc/upload-selfie" element={<UploadSelfie />} />
        <Route path="/kyc/status" element={<KycStatus />} />

      </Routes>
    </Router>
  );
}
