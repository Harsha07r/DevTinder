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
function AppContent() {
  useAutoLogin();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="profile" element={<Profile />} />
          {/* 👇 default page */}
          <Route index element={<Feed />} />

          {/* 👇 explicit feed route */}
          <Route path="feed" element={<Feed />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />

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
