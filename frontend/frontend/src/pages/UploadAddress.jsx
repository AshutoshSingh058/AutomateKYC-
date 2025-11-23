import { useState } from "react";
import axios from "axios";

export default function UploadAddress() {
  const [file, setFile] = useState(null);

  async function upload() {
    if (!file) return alert("Upload address proof");

    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("document", file);
    data.append("document_type", "ADDRESS_PROOF");

    await axios.post(
      "http://localhost:5000/user/upload-document",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.href = "/kyc/upload-selfie";
  }

  return (
    <div>
      <h2>Upload Address Proof</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>Next → Take Selfie</button>
    </div>
  );
}
