import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "./utils/requestSlice";

// ✅ ADDED: Environment variable for the backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const fetchRequests = async () => {
    try {
      // ✅ FIXED: Replaced hardcoded localhost with BASE_URL
      const res = await axios.get(
        `${BASE_URL}/requests`,
        { withCredentials: true }
      );

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (id, status) => {
    try {
      // ✅ FIXED: Replaced hardcoded localhost with BASE_URL
      await axios.post(
        `${BASE_URL}/request/review`,
        { requestId: id, status },
        { withCredentials: true }
      );

      // Refresh list after action
      fetchRequests();

    } catch (err) {
      alert("Action failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <h1>Loading...</h1>;
  if (requests.length === 0) return <h1>No Requests</h1>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Connection Requests
      </h1>

      {requests.map((req) => {
        const user = req.fromUserId || {};

        return (
          <div
            key={req._id}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between border rounded-xl p-4 mb-4 shadow-sm bg-white"
          >
            <div className="flex items-center gap-4 w-full">
              <img
                src={user.photoUrl || "https://i.pravatar.cc/150"}
                className="w-16 h-16 rounded-full object-cover border"
                alt="profile"
              />

              <div>
                <h2 className="font-semibold text-lg">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="text-sm text-gray-600">
                  {user.about || "No bio available"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => handleReview(req._id, "accepted")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Accept
              </button>

              <button
                onClick={() => handleReview(req._id, "rejected")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;