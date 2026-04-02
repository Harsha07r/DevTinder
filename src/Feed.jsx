import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFeed } from "./utils/feedSlice";
import UserCard from "./UserCard";

// ✅ ADDED: Environment variable for the backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Feed = () => {

  const feed = useSelector((store) => store.feed.feed);

  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed?.length) return;

    try {
      // ✅ FIXED: Replaced hardcoded localhost with BASE_URL
      const res = await axios.get(
        `${BASE_URL}/posts`,
        { withCredentials: true }
      );

      dispatch(setFeed(res.data));

    } catch (err) {
      console.log("===== FEED ERROR DEBUG =====");
      console.log("err.message:", err.message);
      console.log("err.response:", err.response);
      console.log("status:", err.response?.status);
      console.log("data:", err.response?.data);
    }

  };

  // ✅ FIXED DEPENDENCY
  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-2xl font-bold mb-4">FEED PAGE</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {feed?.length > 0 ? (
          feed.map((user) => (
            <UserCard key={user._id} user={user} />
          ))
        ) : (
          <p>No users to show</p>
        )}
      </div>
    </div>
  );
};

export default Feed;