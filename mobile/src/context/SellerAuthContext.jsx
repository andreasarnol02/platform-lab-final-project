import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { sellerClient, onUnauthorized } from "../api/client";
import { SESSION_KEYS, getSession, saveSession, clearSession } from "../api/session";

// Mirrors web/src/seller/context/AuthContext.jsx (seller silo).
// Same shape as the customer AuthContext minus refreshProfile.
const SellerAuthContext = createContext(null);

export function SellerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(() => {
    clearSession(SESSION_KEYS.seller);
    setUser(null);
    setToken(null);
  }, []);

  const boot = useCallback(async () => {
    try {
      const session = await getSession(SESSION_KEYS.seller);
      if (
        session?.token &&
        (session?.user?.role === "seller" || session?.user?.type === "seller")
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
    const { data } = await sellerClient.post("/auth/seller/login", { email, password });
    const nextUser = { ...data.data, role: "seller" };
    saveSession(SESSION_KEYS.seller, { token: data.token, user: nextUser });
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await sellerClient.post("/auth/seller/register", payload);
    const nextUser = { ...data.data, role: "seller" };
    saveSession(SESSION_KEYS.seller, { token: data.token, user: nextUser });
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = { user, token, booting, login, register, logout };

  return <SellerAuthContext.Provider value={value}>{children}</SellerAuthContext.Provider>;
}

export function useSellerAuth() {
  const ctx = useContext(SellerAuthContext);
  if (!ctx) throw new Error("useSellerAuth must be used within SellerAuthProvider");
  return ctx;
}
