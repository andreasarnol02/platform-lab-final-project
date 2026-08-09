const measurementId = import.meta.env.VITE_GA_ID || "G-JY9JZ9QVNF";

let initialized = false;

export const initAnalytics = () => {
  if (!measurementId || initialized || typeof document === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => window.dataLayer.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  initialized = true;
};

export const trackPageView = (path) => {
  if (typeof window !== "undefined" && window.gtag && measurementId) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
    });
  }
};

export const trackEvent = (name, params = {}) => {
  if (typeof window !== "undefined" && window.gtag && measurementId) {
    window.gtag("event", name, params);
  }
};
