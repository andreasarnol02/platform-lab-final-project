import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import client, { getSession, saveSession, clearSession } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const session = getSession();
    if (session?.token && (session?.user?.role === "customer" || session?.user?.type === "customer")) {
      setToken(session.token);
      setUser(session.user);
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setToken(null);
      if (window.location.pathname !== "/login") {
        navigate("/login");
      }
    };
    window.addEventListener("mp:unauthorized", onUnauthorized);
    return () => window.removeEventListener("mp:unauthorized", onUnauthorized);
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    const { data } = await client.post("/auth/customer/login", { email, password });
    const user = { ...data.data, role: "customer" };
    saveSession(data.token, user);
    setToken(data.token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await client.post("/auth/customer/register", payload);
    const user = { ...data.data, role: "customer" };
    saveSession(data.token, user);
    setToken(data.token);
    setUser(user);
    return user;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await client.get("/auth/me");
    const fresh = { ...data.data, role: "customer" };
    setUser((prev) => {
      const next = { ...prev, ...fresh };
      saveSession(token, next);
      return next;
    });
    return fresh;
  }, [token]);

  const value = { user, token, booting, login, register, logout, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
