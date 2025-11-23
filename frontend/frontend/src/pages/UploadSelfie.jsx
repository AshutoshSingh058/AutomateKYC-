import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function UploadSelfie() {
  const camRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);

  async function captureAndUpload() {
    if (!camRef.current) return;

    const imgSrc = camRef.current.getScreenshot();
    setCaptured(true);

    const blob = await (await fetch(imgSrc)).blob();
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("document", file);
    data.append("document_type", "SELFIE");

    setLoading(true);

    await axios.post("http://localhost:5000/user/upload-document", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    window.location.href = "/kyc/status";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* Step Indicator */}
        <div className="flex justify-between mb-10">
          {["Details", "ID", "Address", "Selfie", "Status"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  i === 3
                    ? "bg-blue-600"
                    : i < 3
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <span
                className={`text-xs mt-2 font-medium ${
                  i === 3
                    ? "text-blue-600"
                    : i < 3
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Capture a Selfie
          </h1>

          <p className="text-gray-600 mb-6 text-center">
            Position your face clearly inside the frame. Make sure lighting is good.
          </p>

          <div className="flex justify-center mb-6">
            <Webcam
              ref={camRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="rounded-2xl border border-gray-300 shadow-md"
              width={300}
              height={230}
            />
          </div>

          {captured && (
            <p className="text-green-600 font-medium text-center mb-4">
              Selfie captured! Uploading…
            </p>
          )}

          <button
            onClick={captureAndUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Capture & Submit Selfie →"}
          </button>
        </div>
      </div>
    </div>
  );
}
