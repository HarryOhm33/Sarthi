// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import WhatsOnYourMind from "./Pages/WhatsOnYourMind";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import ProtectedAuth from "./components/Protected/ProtectedAuth";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import AdminProtectedAuth from "./components/Protected/AdminProtectedAuth";
import AdminProtectedRoute from "./components/Protected/AdminProtectedRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <div className="h-[100dvh] w-screen flex flex-col overflow-hidden bg-stone-100">
            <Navbar />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />

                {/* Victim Authentication Routes */}
                <Route element={<ProtectedAuth />}>
                  <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                </Route>

                {/* Victim Protected Dashboard Routes */}
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
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Legacy /profile and /settings route redirects */}
                  <Route
                    path="/profile"
                    element={<Navigate to="/dashboard/profile" replace />}
                  />
                  <Route
                    path="/settings"
                    element={<Navigate to="/dashboard/settings" replace />}
                  />
                </Route>

                {/* 🛡️ Admin Authentication Routes */}
                <Route element={<AdminProtectedAuth />}>
                  <Route path="/admin/login" element={<AdminLogin />} />
                </Route>

                {/* 🛡️ Admin Protected Dashboard Routes */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard/users" element={<AdminUsers />} />
                  <Route
                    path="/admin/users"
                    element={<Navigate to="/admin/dashboard/users" replace />}
                  />
                </Route>

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
