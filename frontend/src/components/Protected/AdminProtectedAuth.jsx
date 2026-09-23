import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import Cookies from "js-cookie";
import { FiLoader } from "react-icons/fi";

const AdminProtectedAuth = () => {
  const { victim, loading: loadingVictim } = useAuth();
  const { admin, loadingAdmin } = useAdminAuth();

  const hasAdminToken = Boolean(
    admin ||
      localStorage.getItem("adminToken") ||
      Cookies.get("adminToken") ||
      Cookies.get("adminKey")
  );

  const hasVictimToken = Boolean(
    victim || Cookies.get("magicalKey")
  );

  // If validating session and any token is present, show loader instead of login
  if (loadingAdmin || loadingVictim) {
    if (hasAdminToken || hasVictimToken) {
      return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center gap-3 text-stone-700">
          <FiLoader className="h-8 w-8 animate-spin text-emerald-700" />
        </div>
      );
    }
  }

  // If admin token is present, redirect to Admin Dashboard
  if (hasAdminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If victim token is present, redirect to Citizen Dashboard
  if (hasVictimToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedAuth;
