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

export const CONFIG: AppConfig = {
  ENABLE_ONBOARDING: true,
  USE_MOCK_DATA: true,
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api",
  APP_NAME: "Storefront Marketplace Mobile",
  VERSION: "1.0.0",
};

export default CONFIG;
