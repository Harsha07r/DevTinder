import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import useAutoLogin from "./hooks/useAutoLogin";

import Profile from "./Profile.jsx";
import Body from "./Body.jsx";
import Feed from "./Feed.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Connections from "./Connections.jsx";
import Requests from "./Requests.jsx";
import Chat from "./Chat.jsx";
import LandingPage from "./LandingPage.jsx"; // <-- 1. Import the new component

function AppContent() {
  useAutoLogin();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>

          {/* 2. Change the default route to display the Landing Page */}
          <Route index element={<LandingPage />} />

          {/* The feed is still accessible at /feed after login */}
          <Route path="feed" element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />

          {/* CHAT ROUTE */}
          <Route path="chat/:targetUserId" element={<Chat />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={appStore}>
      <AppContent />
    </Provider>
  );
}

export default App;