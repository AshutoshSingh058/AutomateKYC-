import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleRegister() {
    try {
      await axios.post("http://localhost:5000/register", form);
      navigate("/login");
    } catch (err) {
      setMessage("Registration failed. Try another email.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex justify-center items-center flex-1">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h1>

          {message && (
            <p className="mb-4 text-center text-red-600 font-semibold">
              {message}
            </p>
          )}

          <label className="text-gray-700 font-semibold text-sm">Name</label>
          <input
            className="w-full p-3 border rounded-lg mt-1 mb-4"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <label className="text-gray-700 font-semibold text-sm">Email</label>
          <input
            className="w-full p-3 border rounded-lg mt-1 mb-4"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />

          <label className="text-gray-700 font-semibold text-sm">Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg mt-1 mb-6"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
