import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "./utils/userSlice";

// ✅ ADDED: Environment variable for the backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// The clean default avatar
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const NavBar = () => {
  const user = useSelector((store) => store.user.user);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✅ FIXED: Replaced hardcoded localhost with BASE_URL
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      
      // ✅ Redirect user back to the Landing Page after logout
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // ✅ SAFE image resolver using our clean default avatar
  const profileImage = user?.photoUrl || DEFAULT_AVATAR;

  return (
    <div className="navbar bg-base-300 shadow-sm">
      {/* Brand */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          DevTinder
        </Link>
      </div>

      {/* Right side */}
      <div className="flex gap-2">
        {!isAuthenticated ? (
          <div className="flex gap-3 mx-4">
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end mx-4">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="profile"
                  src={profileImage}
                  className="object-cover"
                />
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              {/* ✅ FIXED: Use firstName instead of name */}
              <li className="px-2 py-1 font-semibold">
                {user?.firstName ? `Hi, ${user.firstName}` : "User"}
              </li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/connections">Connections</Link></li>
              <li><Link to="/requests">Requests</Link></li>

              <li>
                <button onClick={handleLogout} className="w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;