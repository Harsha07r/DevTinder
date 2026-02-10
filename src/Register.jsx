import { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:3000/register", {
        firstName,
        lastName,
        emailId,
        password,
      });
      // 1. Alert user of success
      alert("Registration Successful!");

      // 2. Log data for debugging
      console.log("Response Data:", res.data);

      // 3. Clear form fields
      setFirstName("");
      setLastName("");
      setEmailId("");
      setPassword("");

      // 4. Navigate to login page
      navigate('/login'); 
      
    } catch (err) {
      /**
       * 5. ERROR HANDLING
       * We grab the clean error message we wrote in the Backend server.js 
       * (e.g., "Registration failed. Use a different email.")
       */
      const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
      
      alert(errorMessage); 
      console.error("Backend Error Object:", err.response?.data);
    }
  };

  return (
    <div className="flex justify-center my-20">
      <div className="card bg-neutral text-neutral-content w-96">
        <div className="card-body">
          <h2 className="card-title text-2xl font-semibold justify-center mb-5">
            Register Form
          </h2>
          

          <div className="form-control w-full mb-3">
            <label className="label">
              <span className="label-text text-neutral-content my-2">First Name:</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered w-full px-2"
            />
          </div>

          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text text-neutral-content my-2">Last Name:</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered w-full px-2"
            />
          </div>

          <div className="form-control w-full mb-3">
            <label className="label">
              <span className="label-text text-neutral-content my-2">Email ID:</span>
            </label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="input input-bordered w-full px-2"
            />
          </div>

          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text text-neutral-content my-2">Password:</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full px-2"
            />
          </div>

          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;