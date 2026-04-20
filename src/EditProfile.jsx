import React, { useState } from 'react';
import UserCard from './UserCard';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addUser } from './utils/userSlice';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// ✅ ADDED: A standard default avatar image URL
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const EditProfile = ({ user }) => {

  const dispatch = useDispatch();

  // 1. Form state
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    // ✅ FIXED: Fallback to the default avatar if photoUrl is empty
    photoUrl: user?.photoUrl || DEFAULT_AVATAR,
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || ""
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // 2. Generic input handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 3. Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${BASE_URL}/profile`,
        {
          firstName: form.firstName,
          lastName: form.lastName,
          photoUrl: form.photoUrl,
          bio: form.about   // backend expects bio
        },
        { withCredentials: true }
      );

      // Update Redux with returned user
      dispatch(addUser(res.data.data));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}

      <div className="flex justify-center items-start gap-10 my-20">

        <form
          className="card bg-neutral text-neutral-content w-96 shadow-xl"
          onSubmit={handleSaveProfile}
        >

          <div className="card-body">
            <h2 className="card-title text-2xl font-semibold justify-center mb-5">
              Edit Profile
            </h2>

            {/* First Name */}
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text text-neutral-content">First Name</span>
              </div>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="input input-bordered w-full px-4"
              />
            </label>

            {/* Last Name */}
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text text-neutral-content">Last Name</span>
              </div>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="input input-bordered w-full px-4"
              />
            </label>

            {/* Photo URL */}
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text text-neutral-content">Photo URL</span>
              </div>
              <input
                type="url"
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleChange}
                className="input input-bordered w-full px-4"
              />
            </label>

            <div className="flex gap-4 mb-3">
              {/* Age */}
              <label className="form-control w-1/2">
                <div className="label">
                  <span className="label-text text-neutral-content">Age</span>
                </div>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="input input-bordered w-full px-4"
                />
              </label>

              {/* Gender */}
              <label className="form-control w-1/2">
                <div className="label">
                  <span className="label-text text-neutral-content">Gender</span>
                </div>
                <input
                  type="text"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input input-bordered w-full px-4"
                />
              </label>
            </div>

            {/* About */}
            <label className="form-control w-full mb-6">
              <div className="label">
                <span className="label-text text-neutral-content">About</span>
              </div>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                className="textarea textarea-bordered h-24 w-full px-4 py-2"
              />
            </label>

            <div className="card-actions justify-center">
              <button type="submit" className="btn btn-primary w-full">
                Save Profile
              </button>
            </div>

          </div>
        </form>

        {/* Live Preview */}
        <UserCard user={form} />

      </div>
    </>
  );
};

export default EditProfile;