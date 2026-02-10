import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { removeUser } from "./utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user.user);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // ✅ SAFE image resolver
  const profileImage =
    user?.photoUrl && user.photoUrl.startsWith("http")
      ? user.photoUrl
      : "/profile.jpg";

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
              <li className="px-2 py-1 font-semibold">{user?.name || "User"}</li>
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
