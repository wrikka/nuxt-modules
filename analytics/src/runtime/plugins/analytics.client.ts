import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { useAnalytics } from '#analytics/composables';
import type { AnalyticsConfig } from '#analytics/types';

export default defineNuxtPlugin({
  name: 'analytics',
  setup(nuxtApp) {
    const config = useRuntimeConfig();
    const analyticsConfig = config.public.analytics as AnalyticsConfig;
    const { init, trackPageView } = useAnalytics();

    // Initialize analytics
    void init();

    // Track page views on route change
    if (analyticsConfig.enabled && analyticsConfig.trackPageViews) {
      nuxtApp.hook('page:finish', () => {
        trackPageView({
          url: window.location.pathname,
          title: document.title,
          referrer: document.referrer,
        });
      });
    }
  },
});
