// src/analytics.js
import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "./firebaseconfig";

let analyticsInstance = null;

export const getAnalyticsInstance = () => {
  if (!analyticsInstance) {
    try {
      analyticsInstance = getAnalytics(app);
    } catch (e) {
      // GA doesn't work in SSR or some environments
      console.warn("Analytics not initialized:", e);
    }
  }
  return analyticsInstance;
};

export const trackPageView = (path) => {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, "page_view", {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: document.title || path,
  });
};

export const trackEvent = (name, params = {}) => {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, name, params);
};
