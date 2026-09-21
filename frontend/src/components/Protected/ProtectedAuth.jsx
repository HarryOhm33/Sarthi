import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

const ProtectedAuth = () => {
  const { victim, loading } = useAuth();

  // ✅ If victim is logged in, redirect to their dashboard instead of login/signup
  if (victim) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedAuth;
