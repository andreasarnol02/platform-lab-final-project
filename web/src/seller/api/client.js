import axios from "axios";

const API_URL = globalThis.__MARKETPLACE_API_URL__ || "http://localhost:4000/api";

const client = axios.create({
  baseURL: API_URL,
});

export const SESSION_KEY = "mp_seller_session";

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

export const saveSession = (token, user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

client.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      window.dispatchEvent(new Event("mp:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default client;
