import { useState } from "react";
import axios from "axios";

export default function KycDetails() {
  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    address: ""
  });

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitDetails() {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/user/declare",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.href = "/kyc/upload-id";
  }

  return (
    <div>
      <h2>Enter your KYC Details</h2>

      <input name="full_name" placeholder="Full Name" onChange={update} /><br />
      <input name="dob" type="date" onChange={update} /><br />
      <input name="gender" placeholder="Gender" onChange={update} /><br />
      <textarea name="address" placeholder="Address" onChange={update}></textarea><br />

      <button onClick={submitDetails}>Next → Upload ID Proof</button>
    </div>
  );
}
