import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiLoader, FiMail, FiArrowLeft, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    await forgotPassword(email);
  };

  return (
    <div className="min-h-full bg-stone-100 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-stone-200/90 w-full max-w-md space-y-6"
      >
        <Link
          to="/auth/login"
          className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back to Login
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-700 to-teal-600 rounded-2xl mb-4 text-white shadow-lg shadow-emerald-700/20">
            <FiMail className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 font-medium">
            Enter your registered email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Registered Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                <FiMail className="h-5 w-5" />
              </div>
              <input
                type="email"
                className="pl-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500 font-medium">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-emerald-800 hover:text-emerald-950 font-bold"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
