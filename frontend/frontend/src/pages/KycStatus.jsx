import { useEffect, useState } from "react";
import axios from "axios";

export default function KycStatus() {
  const [status, setStatus] = useState("PROCESSING");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const check = async () => {
      const res = await axios.get(
        "http://localhost:5000/user/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(res.data.kyc_status);

      if (res.data.kyc_status === "APPROVED" ||
          res.data.kyc_status === "NEEDS_REVIEW" ||
          res.data.kyc_status === "REJECTED") {
        clearInterval(timer);
      }
    };

    const timer = setInterval(check, 2000);
    check();

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2>KYC Status: {status}</h2>
    </div>
  );
}
