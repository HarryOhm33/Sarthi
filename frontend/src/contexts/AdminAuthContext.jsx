import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const navigate = useNavigate();

  const getAdminAuthHeaders = () => {
    const token =
      localStorage.getItem("adminToken") ||
      Cookies.get("adminToken") ||
      Cookies.get("adminKey");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") ||
          Cookies.get("adminToken") ||
          Cookies.get("adminKey");

        const res = await axios.get(`${backendUrl}/api/admin/verify`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        if (res.data.success && res.data.admin) {
          setAdmin(res.data.admin);
          if (token) {
            localStorage.setItem("adminToken", token);
            Cookies.set("adminToken", token, { expires: 7, path: "/" });
            Cookies.set("adminKey", token, { expires: 7, path: "/" });
          }
        } else {
          setAdmin(null);
          localStorage.removeItem("adminToken");
          Cookies.remove("adminToken", { path: "/" });
          Cookies.remove("adminKey", { path: "/" });
        }
      } catch (err) {
        setAdmin(null);
        localStorage.removeItem("adminToken");
        Cookies.remove("adminToken", { path: "/" });
        Cookies.remove("adminKey", { path: "/" });
      } finally {
        setLoadingAdmin(false);
      }
    };

    verifySession();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      setLoadingAdmin(true);
      const res = await axios.post(
        `${backendUrl}/api/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success && res.data.admin) {
        setAdmin(res.data.admin);
        const token = res.data.adminToken || res.data.token;
        if (token) {
          localStorage.setItem("adminToken", token);
          Cookies.set("adminToken", token, { expires: 7, path: "/" });
          Cookies.set("adminKey", token, { expires: 7, path: "/" });
        }
        toast.success(`Welcome, Officer ${res.data.admin.name}!`);
        navigate("/admin/dashboard");
        return { success: true };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Admin login failed. Please check credentials.";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoadingAdmin(false);
    }
  };

  const adminLogout = async () => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        Cookies.get("adminToken") ||
        Cookies.get("adminKey");
      await axios.post(
        `${backendUrl}/api/admin/logout`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Admin logout error:", err);
    } finally {
      localStorage.removeItem("adminToken");
      Cookies.remove("adminToken", { path: "/" });
      Cookies.remove("adminKey", { path: "/" });
      setAdmin(null);
      toast.info("Admin logged out successfully");
      navigate("/admin/login");
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminLogin,
        adminLogout,
        loadingAdmin,
        getAdminAuthHeaders,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
