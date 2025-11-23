import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserKycForm() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    address: "",
  });

  async function submitDetails(e) {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/user/declare",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/user");
  }

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">KYC Details</h2>

      <form className="space-y-4" onSubmit={submitDetails}>
        <input
          name="full_name"
          onChange={change}
          className="w-full p-3 border rounded"
          placeholder="Full Name"
        />

        <input
          name="dob"
          type="date"
          onChange={change}
          className="w-full p-3 border rounded"
        />

        <select
          name="gender"
          onChange={change}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <textarea
          name="address"
          onChange={change}
          className="w-full p-3 border rounded"
          placeholder="Address"
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg">
          Save & Continue
        </button>
      </form>
    </div>
  );
}
