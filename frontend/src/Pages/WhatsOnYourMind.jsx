import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiEdit3, FiShield } from "react-icons/fi";

const WhatsOnYourMind = () => {
  const { victim } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FiEdit3 className="h-6 w-6" />
          </div>
          <div>
            <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              Safe & Confidential Space
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              What's on your mind today, {victim?.name || "Friend"}?
            </h1>
          </div>
        </div>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Welcome to your personal Sarthi portal space. Share updates, thoughts, or requests for officer assistance in complete privacy and safety.
        </p>
      </motion.div>
    </div>
  );
};

export default WhatsOnYourMind;
