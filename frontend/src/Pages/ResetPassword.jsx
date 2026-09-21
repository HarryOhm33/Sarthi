import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { FiLoader, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");

    if (!token || !email) {
      toast.error("Invalid password reset link");
      navigate("/auth/forgot-password");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await resetPassword(token, email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-full bg-stone-100 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/90 w-full max-w-md space-y-6"
      >
        <Link
          to="/auth/login"
          className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back to Login
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-700 to-teal-600 rounded-2xl mb-4 text-white shadow-lg shadow-emerald-700/20">
            <FiLock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Create New Password
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 font-medium">
            Choose a strong new password for your portal account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                <FiLock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="pl-11 pr-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                <FiLock className="h-5 w-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="pl-11 pr-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white py-3.5 rounded-2xl font-extrabold shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin h-5 w-5" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
