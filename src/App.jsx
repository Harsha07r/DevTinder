
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

function AppContent() {
  useAutoLogin();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>

          {/* default route */}
          <Route index element={<Feed />} />

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
