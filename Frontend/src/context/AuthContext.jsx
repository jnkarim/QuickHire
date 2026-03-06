import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("qh_token");
    if (token) {
      getMe()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem("qh_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithToken = async (token) => {
    localStorage.setItem("qh_token", token);
    try {
      const res = await getMe();
      console.log("getMe response:", res.data);
      const userData = res.data.data ?? res.data.user ?? res.data;
      setUser(userData);
    } catch (err) {
      console.error("loginWithToken failed:", err.response?.data || err.message);
      localStorage.removeItem("qh_token");
      throw err;
    }
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user } = res.data.data;
    localStorage.setItem("qh_token", token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    const { token, user } = res.data.data;
    localStorage.setItem("qh_token", token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("qh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);