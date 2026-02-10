import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "./utils/connectionSlice";

const Connections = () => {

  const connections = useSelector(store => store.connections);
  const loggedUser = useSelector(store => store.user);   // 🔥 moved here
  const me = loggedUser?._id;

  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/connections",
        { withCredentials: true }
      );

      dispatch(addConnections(res.data.data));

    } catch (err) {
      setError("Failed to load connections");
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/connection/${id}`,
        { withCredentials: true }
      );

      const updated = connections.filter(c => c._id !== id);
      dispatch(addConnections(updated));

    } catch (err) {
      alert("Failed to remove connection");
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (error) return <h1>{error}</h1>;

  if (!connections) return <h1>Loading...</h1>;

  if (connections.length === 0)
    return <h1 className="text-center text-2xl mt-10">
      No Connections Found
    </h1>;

  return (
    <div className="text-center my-10">

      <h1 className="font-bold text-3xl mb-6">
        Your Connections
      </h1>

      <div className="flex flex-wrap justify-center">

        {connections.map((connection) => {

          // Find the other person
          const user =
            connection.fromUserId?._id === me
              ? connection.toUserId
              : connection.fromUserId;

          const {
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about
          } = user || {};

          return (
            <div
              key={connection._id}
              className="p-4 m-4 border rounded-lg shadow-lg w-64"
            >

              <img
                alt="profile"
                className="w-24 h-24 mx-auto rounded-full object-cover"
                src={photoUrl}
              />

              <h2 className="font-semibold text-xl mt-2">
                {firstName} {lastName}
              </h2>

              <p className="text-sm text-gray-600">
                {age} • {gender}
              </p>

              <p className="mt-2 text-sm">{about}</p>

              <div className="flex gap-2 mt-3 justify-center">

                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  Chat
                </button>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleRemove(connection._id)}
                >
                  Remove
                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Connections;
