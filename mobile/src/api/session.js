import * as SecureStore from "expo-secure-store";

// Mirrors the web localStorage keys (mp_customer_session / mp_seller_session)
// so both silos keep separate sessions.
export const SESSION_KEYS = {
  customer: "mp_customer_session",
  seller: "mp_seller_session",
};

// All helpers are async and swallow SecureStore errors (returns null on failure).
export async function getSession(key) {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveSession(key, { token, user }) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify({ token, user }));
  } catch {
    // SecureStore can throw (e.g. keychain issues) — session state still works in-memory.
  }
}

export async function clearSession(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Nothing to recover — best effort.
  }
}
