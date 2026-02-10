import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const useAutoLogin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/profile",
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
