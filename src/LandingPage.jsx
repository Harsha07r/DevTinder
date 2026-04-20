import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { addUser } from "./utils/userSlice.js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      // 1. Automatically log in using a pre-made demo account
      const res = await axios.post(
        `${BASE_URL}/login`,
        { 
          emailId: "demo@devtinder.com", // Make sure this user exists in your DB!
          password: "DemoPassword123"    // Match the password exactly
        },
        { withCredentials: true }
      );

      // 2. Save user to Redux state
      dispatch(addUser(res.data.data));

      // 3. Redirect immediately to the feed
      navigate("/feed");
    } catch (err) {
      console.error("Demo login failed:", err);
      alert("Demo login failed. Did you create the demo@devtinder.com account in your database?");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center pt-16 px-4">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mt-10 mb-16">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
          Swipe. Match. <span className="text-indigo-500">Connect.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          The best place to meet new people. Find your next travel buddy, gym partner, or someone who shares your vibe.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-200"
          >
            Create an Account
          </button>
          
          {/* UPDATED DEMO BUTTON */}
          <button 
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold rounded-lg shadow-lg transition duration-200 flex justify-center items-center"
          >
            {isDemoLoading ? (
              <span className="loading loading-spinner text-neutral-content"></span>
            ) : (
              "Try Recruiter Demo"
            )}
          </button>

        </div>
      </div>

      {/* Feature Showcase / Sample Feed */}
      <div className="w-full max-w-5xl border-t border-gray-800 pt-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-300">
          Meet people in your area
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Profile 1 */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="p-6 relative">
              <div className="absolute -top-12 left-6 h-20 w-20 bg-gray-700 border-4 border-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-400">
                HV
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Harsha Vardhan</h3>
              <p className="text-indigo-400 text-sm font-semibold mb-3">Fitness & Travel</p>
              <p className="text-gray-400 text-sm line-clamp-3">
                Regular at the gym, play for the PHOENIX XI cricket team, and always planning the next coastal trip to places like Gokarna. Let's connect!
              </p>
            </div>
          </div>

          {/* Mock Profile 2 */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
            <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600"></div>
            <div className="p-6 relative">
              <div className="absolute -top-12 left-6 h-20 w-20 bg-gray-700 border-4 border-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-teal-400">
                SD
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Sashank</h3>
              <p className="text-teal-400 text-sm font-semibold mb-3">Adventure Seeker</p>
              <p className="text-gray-400 text-sm line-clamp-3">
                Love exploring new hiking trails, catching live music, and finding the best street food in the city. Always up for a road trip.
              </p>
            </div>
          </div>

          {/* Mock Profile 3 */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
            <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600"></div>
            <div className="p-6 relative">
              <div className="absolute -top-12 left-6 h-20 w-20 bg-gray-700 border-4 border-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-purple-400">
                LN
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Lokesh</h3>
              <p className="text-purple-400 text-sm font-semibold mb-3">Art & Coffee</p>
              <p className="text-gray-400 text-sm line-clamp-3">
                Amateur photographer and professional coffee taster. Looking for someone to explore local museums and art galleries with.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default LandingPage;