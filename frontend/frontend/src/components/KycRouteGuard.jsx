import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KycRouteGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkKycStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = res.data;
        const kycStatus = user.kyc_status || "NOT_STARTED";
        const hasDeclaredKyc = user.declared_kyc && user.declared_kyc.full_name;

        // Check what documents are uploaded
        const docsRes = await axios.get("http://localhost:5000/user/my-docs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const docs = docsRes.data;
        const hasId = docs.some(d => d.document_type === "ID_PROOF");
        const hasAddress = docs.some(d => d.document_type === "ADDRESS_PROOF");
        const hasSelfie = docs.some(d => d.document_type === "SELFIE");

        // Redirect based on KYC status and progress
        if (kycStatus === "APPROVED" || kycStatus === "REJECTED" || kycStatus === "NEEDS_REVIEW") {
          // KYC process complete, go to dashboard
          navigate("/user");
          return;
        }

        if (!hasDeclaredKyc) {
          navigate("/kyc/details");
          return;
        }

        if (!hasId) {
          navigate("/kyc/upload-id");
          return;
        }

        if (!hasAddress) {
          navigate("/kyc/upload-address");
          return;
        }

        if (!hasSelfie) {
          navigate("/kyc/upload-selfie");
          return;
        }

        // All documents uploaded, check status
        if (kycStatus === "PROCESSING" || kycStatus === "PENDING_DOCS") {
          navigate("/kyc/status");
          return;
        }

        // Default: go to dashboard
        navigate("/user");
      } catch (error) {
        console.error("Error checking KYC status:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkKycStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}


