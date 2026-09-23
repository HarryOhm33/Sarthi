import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiCheckCircle,
  FiMapPin,
  FiFileText,
} from "react-icons/fi";

const Profile = () => {
  const { victim } = useAuth();

  if (!victim) return null;

  return (
    <div className="w-full space-y-5 pb-6">
      {/* 🌟 Compact Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md shadow-emerald-700/20">
            {victim.name ? victim.name.charAt(0).toUpperCase() : "V"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                {victim.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold">
                Verified Victim Record
              </span>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
              <FiMail className="h-3.5 w-3.5 text-emerald-700" /> {victim.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1">
            <FiShield className="h-3.5 w-3.5" /> Case: {victim.caseStatus || "ONGOING"}
          </span>
        </div>
      </motion.div>

      {/* 📊 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Card 1: Personal & Account */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base border-b border-stone-100 pb-3">
            <FiUser className="h-5 w-5 text-emerald-700" />
            <span>Personal Profile</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Full Name
              </span>
              <span className="text-sm font-bold text-stone-900">
                {victim.name}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Email Address
              </span>
              <span className="text-sm font-bold text-stone-900 truncate max-w-[200px]">
                {victim.email}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Registration Date
              </span>
              <span className="text-sm font-bold text-stone-900 flex items-center gap-1">
                <FiCalendar className="h-3.5 w-3.5 text-stone-400" />
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: District & Case Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base border-b border-stone-100 pb-3">
            <FiShield className="h-5 w-5 text-emerald-700" />
            <span>District & Case Status</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                District Jurisdiction
              </span>
              <span className="text-sm font-bold text-stone-900 flex items-center gap-1">
                <FiMapPin className="h-3.5 w-3.5 text-emerald-700" />
                {victim.district || "Not Specified"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Registered Case Type
              </span>
              <span className="text-sm font-bold text-stone-900 flex items-center gap-1">
                <FiFileText className="h-3.5 w-3.5 text-teal-700" />
                {victim.caseType || "General Assistance"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Protection Officer Assigned
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <FiCheckCircle className="h-3 w-3 text-emerald-600" /> Active Cell
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 💚 Bottom Security Reassurance Card */}
      <div className="bg-stone-100/80 p-5 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <FiShield className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            All your details are protected under Sarthi's confidential victim safety protocols.
          </span>
        </div>
        <span className="font-bold text-emerald-900 bg-white px-3 py-1 rounded-lg border border-stone-200 shrink-0">
          DLSA Monitored Record
        </span>
      </div>
    </div>
  );
};

export default Profile;
