import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate size (< 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      alert("File too large! Max 5MB");
      return;
    }

    // Validate type
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(selected.type)) {
      alert("Only JPG, PNG & PDF allowed");
      return;
    }

    setFile(selected);

    // Show preview for images only
    if (selected.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }

  async function uploadFile() {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append("document", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    setMessage(JSON.stringify(res.data.metadata, null, 2));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Document</h2>

      <input 
        type="file"
        onChange={handleChange}
        accept="image/*,application/pdf"
      />

      {preview && (
        <img 
          src={preview}
          alt="preview"
          style={{ width: 200, marginTop: 10 }}
        />
      )}

      <br />

      <button 
        onClick={uploadFile}
        style={{ marginTop: 10, padding: "6px 12px" }}
      >
        Upload
      </button>

      <pre style={{ marginTop: 20 }}>{message}</pre>
    </div>
  );
}
