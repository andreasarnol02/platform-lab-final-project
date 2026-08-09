import Constants from "expo-constants";

// Resolve the API base URL:
// 1. EXPO_PUBLIC_API_URL env var (set in .env) wins.
// 2. When running via Expo Go / dev server on a real device,
//    Constants.expoConfig.hostUri is "192.168.1.5:8081" — we take the host
//    part and assume the API runs on port 4000 of the same machine
//    ("http://192.168.1.5:4000/api"). This makes the app work on physical
//    devices without hardcoding an IP.
// 3. Fallback: localhost (simulator / web).
const ENV_URL = process.env.EXPO_PUBLIC_API_URL;
const hostUri = Constants.expoConfig?.hostUri;

let resolved = "http://localhost:4000/api";

if (ENV_URL) {
  resolved = ENV_URL;
} else if (hostUri) {
  const host = hostUri.split(":")[0];
  if (host) {
    resolved = `http://${host}:4000/api`;
  }
}

export const API_URL = resolved;

export default API_URL;
