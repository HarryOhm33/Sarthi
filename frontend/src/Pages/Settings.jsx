import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiLock,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiShield,
} from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Settings = () => {
  const { victim } = useAuth();

  // Password reset form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Clear chat state
  const [clearingChat, setClearingChat] = useState(false);

  const getAuthHeaders = () => {
    const token = Cookies.get("magicalKey");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 🔑 Handle Change / Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      setIsChangingPass(true);
      const res = await axios.post(
        `${backendUrl}/api/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully! ✅");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsChangingPass(false);
    }
  };

  // 🗑️ Handle Clear Chat History
  const handleClearChatHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently clear all previous chat conversations? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setClearingChat(true);
      const res = await axios.delete(`${backendUrl}/api/chat/history`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Chat history cleared successfully! ✅");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear chat history");
    } finally {
      setClearingChat(false);
    }
  };

  return (
    <div className="w-full space-y-5 pb-8">
      {/* 🌟 Full-Width Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between gap-4 w-full"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-700/20">
            <FiSettings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Settings & Privacy
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Manage your password, data privacy, and security preferences
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <FiShield className="h-3.5 w-3.5 text-emerald-700" />
            <span>Secure Account</span>
          </span>
        </div>
      </motion.div>

      {/* 📊 Full-Width 2-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        {/* 🔐 Left Column: Reset Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-5 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                <FiLock className="h-5 w-5 text-emerald-700" />
                <span>Reset Password</span>
              </div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Authentication
              </span>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showCurrentPass ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showNewPass ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPass ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="mt-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-xs text-sm transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                {isChangingPass ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* 🛡️ Right Column: Chatbot Privacy & Account Protection */}
        <div className="space-y-5 flex flex-col justify-between">
          {/* Card 2A: Chatbot Data & Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white p-4 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-4"
          >
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                <FiTrash2 className="h-5 w-5 text-emerald-700" />
                <span>Chatbot Data & Privacy</span>
              </div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                History
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                  <FiAlertCircle className="h-4 w-4 text-amber-600" /> Clear Chat History
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Permanently remove all previous consultation logs between you and Sarthi AI.
                  <span className="font-bold text-stone-700 block mt-1">
                    Recommendation: We do not recommend clearing out the chat if you need previous legal insights or records.
                  </span>
                </p>
              </div>

              <button
                onClick={handleClearChatHistory}
                disabled={clearingChat}
                className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {clearingChat ? (
                  <>
                    <FiLoader className="h-3.5 w-3.5 animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 className="h-3.5 w-3.5" />
                    <span>Clear Chat History</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Card 2B: Account Security Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
              <FiShield className="h-4 w-4 text-emerald-700" />
              <span>Security Protocols</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your registered email <strong className="text-stone-800">{victim?.email}</strong> is secured with JWT cryptographic authentication and encrypted session storage monitored under Sarthi protection protocols.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
