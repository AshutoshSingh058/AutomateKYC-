import { useState } from "react";
import axios from "axios";

export default function UploadId() {
  const [file, setFile] = useState(null);

  async function upload() {
    if (!file) return alert("Upload the ID proof");

    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("document", file);
    data.append("document_type", "ID_PROOF");

    await axios.post(
      "http://localhost:5000/user/upload-document",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // go to address upload
    window.location.href = "/kyc/upload-address";
  }

  return (
    <div>
      <h2>Upload ID Proof</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>Next → Upload Address Proof</button>
    </div>
  );
}
