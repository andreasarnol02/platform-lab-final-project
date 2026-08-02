const measurementId = globalThis.__MARKETPLACE_GA_ID__ || "";

let initialized = false;

export const initAnalytics = () => {
  if (!measurementId || initialized || typeof document === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => window.dataLayer.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

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
