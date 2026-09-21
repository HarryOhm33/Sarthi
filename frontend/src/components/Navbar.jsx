// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiLogIn,
  FiLogOut,
  FiLoader,
  FiMenu,
  FiX,
  FiGrid,
  FiShield,
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
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-4 w-4" /> },
      ];
    }

    if (victim) {
      return [
        { path: "/", label: "Home", icon: <FiHome className="h-4 w-4" /> },
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <FiGrid className="h-4 w-4" />,
        },
      ];
    }

    return [
      { path: "/", label: "Home", icon: <FiHome className="h-4 w-4" /> },
      {
        path: "/auth/login",
        label: "Login",
        icon: <FiLogIn className="h-4 w-4" />,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-2.5 text-xl font-extrabold text-stone-900 group"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <FiShield className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent tracking-tight">
                SARTHI
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold bg-amber-100/80 text-amber-900 rounded-full border border-amber-200/80">
                Victim Protection & Safety
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "text-emerald-900 bg-emerald-50 border border-emerald-200/80 shadow-xs"
                      : "text-stone-600 hover:text-emerald-900 hover:bg-stone-100/80"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Show logout button only when victim is authenticated */}
            {victim && !loading && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors ml-2 cursor-pointer"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </motion.button>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center text-stone-400 px-3 py-2 text-sm font-medium">
                <FiLoader className="h-4 w-4 animate-spin mr-2" />
                Authenticating...
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
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

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 z-50 md:hidden">
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-stone-200 rounded-2xl shadow-xl w-52 mt-1 mr-3 overflow-hidden p-1.5"
            >
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      location.pathname === item.path
                        ? "text-emerald-900 bg-emerald-50 font-bold"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                {victim && !loading && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
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
