import { useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function UploadSelfie() {
  const camRef = useRef(null);

  async function captureAndUpload() {
    const imgSrc = camRef.current.getScreenshot();

    const blob = await (await fetch(imgSrc)).blob();
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("document", file);
    data.append("document_type", "SELFIE");

    await axios.post(
      "http://localhost:5000/user/upload-document",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.href = "/kyc/status";
  }

  return (
    <div>
      <h2>Take a Selfie</h2>

      <Webcam
        ref={camRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />

      <button onClick={captureAndUpload}>
        Submit Selfie → Check Status
      </button>
    </div>
  );
}
