import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURl = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [victim, setVictim] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = Cookies.get("magicalKey");
      if (token) {
        axios
          .post(
            `${backendURl}/api/auth/verify-session`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            },
          )
          .then((res) => {
            setVictim(res.data.victim || res.data.user);
          })
          .catch((err) => {
            setVictim(null);
            Cookies.remove("magicalKey");
            toast.error(
              err.response?.data.error ||
                err.response?.data.message ||
                "Session expired, please log in again. ❌",
            );
            navigate("/auth/login");
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, 500);
  }, [navigate]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      const loggedVictim = res.data.victim || res.data.user;

      if (loggedVictim) {
        setVictim(loggedVictim);

        const isSecure = window.location.protocol === "https:";
        Cookies.set("magicalKey", res.data.token, {
          expires: 7,
          path: "/",
          secure: isSecure,
          sameSite: "strict",
        });

        toast.success("Login successful!");
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        toast.error(res.data.error || "Unknown error");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed ❌");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get("magicalKey");
      await axios.post(
        `${backendURl}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      setVictim(null);
      Cookies.remove("magicalKey");
      toast.info("Logged out successfully! 👋");
      navigate("/auth/login");
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset link sent to email");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to send reset link ❌",
      );
    }
  };

  const resetPassword = async (token, email, newPassword) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/reset-password`,
        { token, email, newPassword },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successful!");
        setLoading(false);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed ❌");
      setLoading(false);
      navigate("/auth/forgot-password");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        victim,
        user: victim,
        loading,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
