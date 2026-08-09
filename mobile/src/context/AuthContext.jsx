import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { customerClient, onUnauthorized } from "../api/client";
import { SESSION_KEYS, getSession, saveSession, clearSession } from "../api/session";

// Mirrors web/src/context/AuthContext.jsx (customer silo) with an async
// SecureStore-backed session and the RN onUnauthorized subscription.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(() => {
    clearSession(SESSION_KEYS.customer);
    setUser(null);
    setToken(null);
  }, []);

  const boot = useCallback(async () => {
    try {
      const session = await getSession(SESSION_KEYS.customer);
      if (
        session?.token &&
        (session?.user?.role === "customer" || session?.user?.type === "customer")
      ) {
        setToken(session.token);
        setUser(session.user);
      }
    } finally {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      logout();
    });
    return unsubscribe;
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await customerClient.post("/auth/customer/login", { email, password });
    const nextUser = { ...data.data, role: "customer" };
    saveSession(SESSION_KEYS.customer, { token: data.token, user: nextUser });
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await customerClient.post("/auth/customer/register", payload);
    const nextUser = { ...data.data, role: "customer" };
    saveSession(SESSION_KEYS.customer, { token: data.token, user: nextUser });
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await customerClient.get("/auth/me");
    const fresh = { ...data.data, role: "customer" };
    const next = { ...(user || {}), ...fresh };
    setUser(next);
    if (token) {
      saveSession(SESSION_KEYS.customer, { token, user: next });
    }
    return fresh;
  }, [user, token]);

  const value = { user, token, booting, login, register, logout, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
