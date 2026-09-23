import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-full bg-stone-100 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/90 w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-700 to-teal-600 rounded-2xl mb-4 text-white shadow-lg shadow-emerald-700/20">
            <FiShield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            SARTHI
          </h1>
          <span className="inline-block mt-1 px-3 py-0.5 text-xs font-extrabold bg-amber-100/90 text-amber-950 rounded-full border border-amber-200">
            Victim Protection & Safety Portal
          </span>
          <p className="text-stone-500 text-xs sm:text-sm mt-3 font-medium">
            Log in to access your confidential case dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="pl-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="pl-11 pr-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                  placeholder="Enter your password"
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
          </div>

          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white py-3.5 rounded-2xl font-extrabold shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Login to Portal <FiArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Reassurance Footer */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs font-bold text-emerald-900 flex items-center justify-center gap-2">
          <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>100% Encrypted & Confidential Portal Access</span>
        </div>

        {/* Officer & Admin Portal Link */}
        <div className="pt-3 border-t border-stone-200/80 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <FiShield className="h-3.5 w-3.5 text-emerald-700" />
            <span>Authorized Officer or Administrator? Go to Admin Portal &rarr;</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
