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

/** Default production Render Web API URL */
const RENDER_API_URL = "https://platform-lab-final-project.onrender.com/api";

const getDefaultApiUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return RENDER_API_URL;
};

export const CONFIG: AppConfig = {
  ENABLE_ONBOARDING: true,
  USE_MOCK_DATA: false,
  API_BASE_URL: getDefaultApiUrl(),
  APP_NAME: "Storefront Marketplace Mobile",
  VERSION: "1.0.0",
};

export default CONFIG;
