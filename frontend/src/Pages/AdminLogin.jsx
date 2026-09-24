import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertTriangle,
  FiArrowLeft,
} from "react-icons/fi";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, loadingAdmin } = useAdminAuth();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    await adminLogin(email, password);
  };

  return (
    <div className="min-h-full bg-stone-100 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-stone-200/90 w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-700 to-teal-600 rounded-2xl mb-4 text-white shadow-lg shadow-emerald-700/20">
            <FiShield className="h-8 w-8" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
              Sarthi Officer Portal
            </h1>
          </div>
          <span className="inline-block mt-1 px-3 py-0.5 text-[11px] font-extrabold bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200 uppercase tracking-widest">
            Admin & Protection Cell
          </span>
          <p className="text-stone-500 text-xs sm:text-sm mt-3 font-medium">
            Authorized access only for legal officers, protection teams & administrators
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Officer Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                <FiMail className="h-5 w-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                placeholder="officer@sarthi.gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Security Access Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                <FiLock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 pr-11 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-semibold text-sm"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loadingAdmin}
            className="w-full mt-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loadingAdmin ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Access Command Dashboard</span>
                <FiArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Security Alert Note */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] font-semibold text-amber-900 flex items-start gap-2">
          <FiAlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Authorized access only. All actions are logged and monitored under the IT Act & Government Security Regulations.
          </span>
        </div>

        {/* Back Link to Victim Portal */}
        <div className="pt-2 border-t border-stone-200 text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Victim Portal Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
