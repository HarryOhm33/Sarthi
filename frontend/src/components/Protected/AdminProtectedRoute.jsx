import { Outlet, Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { FiLoader } from "react-icons/fi";

const AdminProtectedRoute = () => {
  const { admin, loadingAdmin } = useAdminAuth();

  if (loadingAdmin) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center gap-3 text-stone-700">
        <FiLoader className="h-8 w-8 animate-spin text-emerald-700" />
        <p className="text-xs font-bold uppercase tracking-widest text-stone-600">
          Verifying Officer Authorization...
        </p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
