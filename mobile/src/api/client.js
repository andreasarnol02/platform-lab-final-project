import axios from "axios";
import { API_URL } from "./config";
import { getSession, clearSession, SESSION_KEYS } from "./session";

// Shared 401 listeners (mirrors the web "mp:unauthorized" window event —
// any silo's 401 notifies all listeners, same as the web dispatches one event).
const unauthorizedListeners = new Set();

export function onUnauthorized(fn) {
  unauthorizedListeners.add(fn);
  return () => {
    unauthorizedListeners.delete(fn);
  };
}

function notifyUnauthorized() {
  unauthorizedListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // Listener errors must never break the request pipeline.
    }
  });
}

export function createClient(sessionKey) {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 15000,
  });

  client.interceptors.request.use(async (config) => {
    const session = await getSession(sessionKey);
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await clearSession(sessionKey);
        notifyUnauthorized();
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const customerClient = createClient(SESSION_KEYS.customer);
export const sellerClient = createClient(SESSION_KEYS.seller);

// Server errors: err.response.data.message or .error (string), else
// network/timeout errors get a friendly message, else the fallback.
export const getErrorMessage = (err, fallback = "Terjadi kesalahan. Coba lagi.") => {
  const serverMessage = err?.response?.data?.message;
  const serverError = err?.response?.data?.error;
  if (typeof serverMessage === "string" && serverMessage) return serverMessage;
  if (typeof serverError === "string" && serverError) return serverError;
  if (!err?.response) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet.";
  }
  return fallback;
};
