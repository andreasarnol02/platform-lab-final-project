import { useEffect } from "react";
import { useLocation } from "react-router";
import { initAnalytics, trackPageView } from "../utils/analytics";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
}
