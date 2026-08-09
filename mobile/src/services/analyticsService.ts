import { Platform } from "react-native";

/**
 * Universal Analytics & Crash Reporting Service
 * Compliance Soal 5: Monitoring & Analytics Integration
 * Configured with Measurement ID: G-JY9JZ9QVNF
 */

const GA_MEASUREMENT_ID = "G-JY9JZ9QVNF";
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}`;

class AnalyticsService {
  private clientId: string;
  private sessionId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.clientId = this.generateId();
    this.sessionId = this.generateId();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  /** Initialize Analytics & Log Session Start */
  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.logEvent("session_start", {
      platform: Platform.OS,
      version: Platform.Version,
    });

    console.log(`[Analytics] Initialized with Measurement ID: ${GA_MEASUREMENT_ID}`);
  }

  /** Log general custom events */
  public async logEvent(eventName: string, params: Record<string, any> = {}) {
    const payload = {
      client_id: this.clientId,
      events: [
        {
          name: eventName,
          params: {
            session_id: this.sessionId,
            engagement_time_msec: "100",
            platform: Platform.OS,
            ...params,
          },
        },
      ],
    };

    console.log(`[Analytics Event] ${eventName}:`, params);

    try {
      await fetch(GA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        // Silent catch for network offline scenarios
        console.warn("[Analytics Send Error]:", err?.message || err);
      });
    } catch {
      // Ignore network errors in analytics
    }
  }

  /** Log Screen Navigation Page Views */
  public logPageView(screenName: string) {
    this.logEvent("page_view", {
      page_title: screenName,
      page_location: `mobile://${screenName}`,
    });
  }

  /** Log Crash Reports & Exceptions (Soal 5 Compliance) */
  public logError(errorName: string, errorDetails: any) {
    const errorMessage =
      errorDetails instanceof Error
        ? errorDetails.message
        : typeof errorDetails === "string"
        ? errorDetails
        : JSON.stringify(errorDetails);

    console.error(`[Analytics Crash Report] ${errorName}:`, errorMessage);

    this.logEvent("app_exception", {
      description: `${errorName}: ${errorMessage}`,
      fatal: true,
      error_name: errorName,
    });
  }
}

export const analytics = new AnalyticsService();
export default analytics;
