import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

// ✅ ADDED: Environment variable for the backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const useAutoLogin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ FIXED: Replaced hardcoded localhost with BASE_URL
        const res = await axios.get(
          `${BASE_URL}/profile`,
          { withCredentials: true }
        );

        // If JWT cookie valid → restore user
        dispatch(addUser(res.data));

      } catch (err) {
        // No valid session → do nothing
        console.log("No active session");
      }
    };

    fetchProfile();
  }, [dispatch]);
};

export default useAutoLogin;