import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { addUser } from "./utils/userSlice.js";

// ✅ ADDED: Environment variable for the backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const dispatch= useDispatch();
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // ✅ FIXED: Replaced hardcoded localhost with BASE_URL
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );

      // 1️⃣ Save user in Redux first
      dispatch(addUser(res.data.data));

      setEmailId("");
      setPassword("");

      // 2️⃣ Then navigate
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-20">
      <div className="card bg-neutral text-neutral-content w-96">
        <div className="card-body">
          <h2 className="card-title text-2xl font-semibold justify-center mb-5">
            Login Form
          </h2>

          <input
            type="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="input input-bordered w-full mb-3"
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full mb-5"
            placeholder="Password"
          />

          {error && <p className="text-red-400 mb-3">{error}</p>}

          <button
            className="btn bg-blue-500 text-white w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;