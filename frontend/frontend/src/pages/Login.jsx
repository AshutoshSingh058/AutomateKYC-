import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/user");
    } catch (err) {
      setMessage("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex justify-center items-center flex-1">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Login
          </h1>

          {message && (
            <p className="mb-4 text-center text-red-600 font-semibold">
              {message}
            </p>
          )}

          <label className="text-gray-700 font-semibold text-sm">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg mt-1 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-gray-700 font-semibold text-sm">Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg mt-1 mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
