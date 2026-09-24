import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiHome,
  FiArrowLeft,
  FiMessageSquare,
  FiPhoneCall,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useAdminAuth } from "../contexts/AdminAuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { victim } = useAuth();
  const { admin } = useAdminAuth();

  return (
    <div className="min-h-full bg-[#f8f7f5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10 text-center relative z-10 space-y-6"
      >
        {/* Shield & 404 Badge */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-500/10">
            <FiShield className="h-10 w-10 text-emerald-300" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[11px] font-black uppercase tracking-wider shadow-sm border border-white">
            404
          </span>
        </div>

        {/* Heading & Context */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed max-w-sm mx-auto">
            The page, case file, or legal resource you requested does not exist, has been relocated, or is unavailable.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            to={admin ? "/admin/dashboard" : victim ? "/dashboard" : "/"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <FiHome className="h-4 w-4 text-emerald-400" />
            <span>Return Home</span>
          </Link>

          {victim && (
            <Link
              to="/dashboard/whats-on-your-mind"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <FiMessageSquare className="h-4 w-4" />
              <span>Talk to Sarthi</span>
            </Link>
          )}
        </div>

        {/* Emergency Assistance Footer */}
        <div className="pt-6 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-700 font-bold">
            <FiAlertCircle className="h-3.5 w-3.5" />
            <span>In immediate danger?</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-600">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1 text-stone-800 hover:text-emerald-700 transition-colors font-bold"
            >
              <FiPhoneCall className="h-3 w-3 text-emerald-600" />
              <span>Emergency: 112</span>
            </a>
            <span>•</span>
            <a
              href="tel:1091"
              className="inline-flex items-center gap-1 text-stone-800 hover:text-emerald-700 transition-colors font-bold"
            >
              <FiPhoneCall className="h-3 w-3 text-emerald-600" />
              <span>Women Helpline: 1091</span>
            </a>
            <span>•</span>
            <a
              href="tel:15100"
              className="inline-flex items-center gap-1 text-stone-800 hover:text-emerald-700 transition-colors font-bold"
            >
              <FiPhoneCall className="h-3 w-3 text-emerald-600" />
              <span>Legal Aid (NALSA): 15100</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
