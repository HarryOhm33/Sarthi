import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiEdit3,
  FiUser,
  FiHeart,
  FiShield,
  FiChevronRight,
} from "react-icons/fi";

const DashboardSidebar = () => {
  const { victim } = useAuth();

  const navItems = [
    {
      path: "/dashboard/whats-on-your-mind",
      label: "What's on your mind today?",
      mobileLabel: "Mind Today",
      icon: <FiEdit3 className="h-5 w-5" />,
    },
    {
      path: "/dashboard/profile",
      label: "Profile",
      mobileLabel: "Profile",
      icon: <FiUser className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* 🖥️ Desktop Sidebar (Soothing Sage Green & Earthy Neutral) */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-white border-r border-stone-200/90 h-full shrink-0 overflow-y-auto shadow-xs">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-stone-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <FiShield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                SARTHI
              </h2>
              <p className="text-xs text-emerald-800 font-bold">
                Protection & Safety Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/20"
                      : "text-stone-600 hover:bg-stone-100/80 hover:text-emerald-900"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="transition-transform group-hover:scale-105">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <FiChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer - Victim Quick Card */}
        {victim && (
          <div className="p-4 m-4 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-extrabold text-base shadow-xs">
                  {victim.name ? victim.name.charAt(0).toUpperCase() : "V"}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-900 truncate">
                  {victim.name}
                </p>
                <p className="text-xs text-stone-500 truncate">{victim.email}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <FiHeart className="h-3.5 w-3.5" /> Safety Active
              </span>
              <span className="bg-white px-2 py-0.5 rounded-md text-stone-700 font-bold text-[10px] border border-stone-200">
                {victim.district || "Registered"}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* 📱 Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl py-2 px-4 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                isActive
                  ? "text-emerald-800 bg-emerald-50"
                  : "text-stone-500 hover:text-stone-900"
              }`
            }
          >
            {item.icon}
            <span>{item.mobileLabel}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default DashboardSidebar;
