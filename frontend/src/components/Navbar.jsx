// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiLoader,
  FiMenu,
  FiX,
  FiGrid,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { victim, logout, loading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  // Navigation items based on authentication state
  const getNavItems = () => {
    if (loading) {
      // Only show Home when loading
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
      ];
    }

    if (victim) {
      // Victim is authenticated
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <FiGrid className="h-5 w-5" />,
        },
        {
          path: "/profile",
          label: "Profile",
          icon: <FiUser className="h-5 w-5" />,
        },
      ];
    }

    // Victim is not authenticated
    return [
      { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
      {
        path: "/auth/login",
        label: "Login",
        icon: <FiLogIn className="h-5 w-5" />,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-xl font-bold text-white"
            >
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                AuthApp
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-white bg-gray-900"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Show logout button only when victim is authenticated and not loading */}
            {victim && !loading && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <FiLogOut className="h-5 w-5 mr-1" />
                Logout
              </motion.button>
            )}

            {/* Show loading indicator during authentication */}
            {loading && (
              <div className="flex items-center text-gray-400 px-3 py-2">
                <FiLoader className="h-5 w-5 animate-spin mr-2" />
                Authenticating...
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Positioned in top right corner */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 z-50 md:hidden">
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-48 mt-1 mr-2 overflow-hidden"
            >
              <div className="py-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      location.pathname === item.path
                        ? "text-white bg-gray-900"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                {/* Show logout button only when victim is authenticated and not loading */}
                {victim && !loading && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiLogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                )}

                {/* Show loading indicator during authentication */}
                {loading && (
                  <div className="flex items-center px-4 py-2 text-sm text-gray-400">
                    <FiLoader className="h-5 w-5 animate-spin mr-2" />
                    Authenticating...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
