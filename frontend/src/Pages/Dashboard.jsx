import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiUser, FiCheckCircle, FiArrowRight } from "react-icons/fi";

const Dashboard = () => {
  const { victim } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-purple-200">Welcome to your personal space</p>
          </div>

          {victim && (
            <div className="p-6">
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  Hello, {victim.name}!
                </h2>
                <p className="text-gray-400">
                  Welcome back to your dashboard. Everything is looking good.
                </p>
              </motion.div>

              {/* Profile Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <Link
                  to="/profile"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium"
                >
                  <FiUser className="mr-2 h-5 w-5" />
                  View Your Profile
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>

              {/* Account Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Account Status
                  </h2>
                  <FiCheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <p className="text-green-400">
                    Your account is active and secure
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
