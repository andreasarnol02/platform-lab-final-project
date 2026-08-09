import { NativeModules, Platform } from "react-native";

/**
 * Central Configuration for Mobile Marketplace Application
 * Supports parallel development via mock mode and feature flags.
 */

export interface AppConfig {
  /** Feature flag to enable/disable intro onboarding flow */
  ENABLE_ONBOARDING: boolean;
  /** Feature flag to toggle between local mock data and live backend REST API */
  USE_MOCK_DATA: boolean;
  /** Base URL for Express REST API backend */
  API_BASE_URL: string;
  /** Application display name */
  APP_NAME: string;
  /** Mobile client app version */
  VERSION: string;
}

/**
 * Dynamically extract Metro Bundler Host IP (e.g., 192.168.x.x)
 * from scriptURL when running via Expo Go on physical devices or emulators.
 */
export const getDevServerIp = (): string | null => {
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      // scriptURL format: "http://192.168.1.10:8081/index.bundle?platform=android..."
      const hostWithPort = scriptURL.split("://")[1]?.split("/")[0];
      if (hostWithPort) {
        const ip = hostWithPort.split(":")[0];
        if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
          return ip;
        }
      }
    }
  } catch (err) {
    console.warn("Could not determine dev server IP automatically:", err);
  }
  return null;
};

const getDefaultApiUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Automatically detect host IP when running via Expo Go on physical devices
  const devIp = getDevServerIp();
  if (devIp) {
    return `http://${devIp}:4000/api`;
  }

  // Fallback for Android Emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000/api";
  }

  return "http://localhost:4000/api";
};

export const CONFIG: AppConfig = {
  ENABLE_ONBOARDING: true,
  USE_MOCK_DATA: false,
  API_BASE_URL: getDefaultApiUrl(),
  APP_NAME: "Storefront Marketplace Mobile",
  VERSION: "1.0.0",
};

export default CONFIG;
