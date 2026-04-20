import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeFromFeed } from './utils/feedSlice';

// ✅ ADDED: Environment variable for the backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// The clean default avatar
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  
  let fullName = '';
  if ((user.firstName && user.firstName.trim()) || (user.lastName && user.lastName.trim())) {
    fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  } else {
    fullName = 'No Name';
  }

  const sendRequest = async (toUserId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send`,
        { toUserId },
        { withCredentials: true }
      );

      dispatch(removeFromFeed(toUserId));

    } catch (err) {
      if (err.response?.data?.message === "Request already sent") {
          dispatch(removeFromFeed(toUserId));
          return;
      }

      alert("Failed");
    }
  };

  const handleReject = async (toUserId) => {
   try {
    await axios.post(
      `${BASE_URL}/request/send`,
      { toUserId, status: "rejected" },
      { withCredentials: true }
    );
    //remove the user from feed
    dispatch(removeFromFeed(toUserId));
   } catch(err) {
    alert("Failed to reject request");
   }
  }

  return (
    <div className="card w-80 bg-base-100 shadow-xl">
      <figure className="h-60">
        <img
          // 🔥 THE FIX: Use the DB photo if it exists, otherwise use the Default Avatar
          src={user.photoUrl || DEFAULT_AVATAR}
          alt={fullName}
          className="h-full w-full object-cover"
        />
      </figure>

      <div className="card bg-neutral text-neutral-content shadow-xl">
        <div className="card-body">

          <h2 className="card-title justify-center text-lg font-semibold">
            {fullName}
          </h2>

          <div className="flex flex-col gap-1 mt-2">
            {user.age && (
              <span className="text-sm">Age: {user.age}</span>
            )}
            {user.gender && (
              <span className="text-sm">Gender: {user.gender}</span>
            )}
            {user.about && (
              <span className="text-sm">{user.about}</span>
            )}
          </div>

          <div className="card-actions justify-center gap-3 mt-3">

            <button
              className="btn btn-success rounded-full px-6"
              onClick={() => sendRequest(user._id)}
            >
              ❤️ Accept
            </button>

            <button className="btn btn-error rounded-full px-6"
            onClick={() => handleReject(user._id)}
            >
              ❌ Reject
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UserCard;