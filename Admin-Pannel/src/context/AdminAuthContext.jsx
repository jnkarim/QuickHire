import { createContext, useContext, useState, useEffect } from "react";
import { adminLogin as apiAdminLogin } from "../utils/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("qh_admin_token");
    const stored = localStorage.getItem("qh_admin_user");
    if (token && stored) {
      setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await apiAdminLogin({ email, password });
    const { token, user } = res.data.data;
    localStorage.setItem("qh_admin_token", token);
    localStorage.setItem("qh_admin_user", JSON.stringify(user));
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem("qh_admin_token");
    localStorage.removeItem("qh_admin_user");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
