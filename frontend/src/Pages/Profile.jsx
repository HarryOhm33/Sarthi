import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiCheckCircle,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";

const Profile = () => {
  const { victim } = useAuth();

  if (!victim) return null;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FiUser className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                <p className="text-purple-200">
                  Personal information and victim account details
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FiUser className="text-purple-400" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                    <span className="font-medium text-gray-300">Name</span>
                    <span className="text-white font-semibold">
                      {victim.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                    <span className="font-medium text-gray-300">Email</span>
                    <span className="text-white font-semibold">
                      {victim.email}
                    </span>
                  </div>
                  {victim.district && (
                    <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <span className="font-medium text-gray-300">District</span>
                      <span className="text-white font-semibold">
                        {victim.district}
                      </span>
                    </div>
                  )}
                  {victim.caseType && (
                    <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <span className="font-medium text-gray-300">Case Type</span>
                      <span className="text-white font-semibold">
                        {victim.caseType}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-green-400" />
                  Account & Case Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                    <span className="font-medium text-gray-300">Account</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                    <span className="font-medium text-gray-300">Case Status</span>
                    <span className="text-yellow-400 font-semibold">
                      {victim.caseStatus || "ONGOING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FiCalendar className="text-blue-400" />
                  Account Details
                </h2>
                <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                  <span className="font-medium text-gray-300">
                    Member Since
                  </span>
                  <span className="text-white font-semibold">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
