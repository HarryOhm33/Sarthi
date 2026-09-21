// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import WhatsOnYourMind from "./Pages/WhatsOnYourMind";
import Profile from "./Pages/Profile";
import ProtectedAuth from "./components/Protected/ProtectedAuth";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-stone-100">
          <Navbar />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route element={<ProtectedAuth />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route
                    index
                    element={<Navigate to="whats-on-your-mind" replace />}
                  />
                  <Route
                    path="whats-on-your-mind"
                    element={<WhatsOnYourMind />}
                  />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Legacy /profile route redirect */}
                <Route
                  path="/profile"
                  element={<Navigate to="/dashboard/profile" replace />}
                />
              </Route>
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
