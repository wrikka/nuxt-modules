import { useRuntimeConfig } from '#imports';
import { computed, ref } from 'vue';
import type { AnalyticsEvent, PageViewEvent, UserEvent } from '#analytics/types';
import type { AnalyticsConfig } from '#analytics/types/config';

// Window type declarations for analytics providers
declare global {
  interface Window {
    plausible?: (event: string, props?: { props?: Record<string, unknown>; url?: string; }) => void;
    umami?: {
      track(name: string, properties?: Record<string, unknown>): void;
      track(data: { url: string; title?: string; }): void;
    };
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, traits?: Record<string, unknown>) => void;
      reset: () => void;
    };
  }
}

export const useAnalytics = () => {
  const config = useRuntimeConfig();
  const analyticsConfig = config.public.analytics as AnalyticsConfig;

  const isReady = ref(false);
  const isTrackingEnabled = computed(() => analyticsConfig.enabled && analyticsConfig.trackEvents);

  const init = async () => {
    if (!analyticsConfig.enabled) {
      return;
    }

    if (analyticsConfig.respectDoNotTrack && navigator.doNotTrack === '1') {
      if (analyticsConfig.debug) {
        console.log('[Analytics] Do Not Track is enabled, skipping initialization');
      }
      return;
    }

    isReady.value = true;

    if (analyticsConfig.debug) {
      console.log('[Analytics] Initialized with config:', analyticsConfig);
    }
  };

  const trackEvent = (event: AnalyticsEvent) => {
    if (!isTrackingEnabled.value || !isReady.value) {
      return;
    }

    const eventData = {
      ...event,
      timestamp: event.timestamp ?? new Date(),
    };

    if (analyticsConfig.debug) {
      console.log('[Analytics] Track Event:', eventData);
    }

    // Dispatch to providers
    if (analyticsConfig.providers.plausible?.domain) {
      plausibleTrackEvent(eventData);
    }

    if (analyticsConfig.providers.umami?.websiteId) {
      umamiTrackEvent(eventData);
    }

    if (analyticsConfig.providers.posthog?.apiKey) {
      posthogTrackEvent(eventData);
    }

    if (analyticsConfig.providers.custom?.endpoint) {
      void customTrackEvent(eventData);
    }
  };

  const trackPageView = (data: PageViewEvent) => {
    if (!analyticsConfig.enabled || !analyticsConfig.trackPageViews || !isReady.value) {
      return;
    }

    const pageData = {
      ...data,
      timestamp: data.timestamp ?? new Date(),
    };

    if (analyticsConfig.debug) {
      console.log('[Analytics] Track PageView:', pageData);
    }

    // Dispatch to providers
    if (analyticsConfig.providers.plausible?.domain) {
      plausibleTrackPageView(pageData);
    }

    if (analyticsConfig.providers.umami?.websiteId) {
      umamiTrackPageView(pageData);
    }

    if (analyticsConfig.providers.posthog?.apiKey) {
      posthogTrackPageView(pageData);
    }

    if (analyticsConfig.providers.custom?.endpoint) {
      void customTrackPageView(pageData);
    }
  };

  const identify = (data: UserEvent) => {
    if (!analyticsConfig.enabled || !isReady.value) {
      return;
    }

    if (analyticsConfig.debug) {
      console.log('[Analytics] Identify:', data);
    }

    // Dispatch to providers
    if (analyticsConfig.providers.posthog?.apiKey) {
      posthogIdentify(data);
    }
  };

  const reset = () => {
    if (!analyticsConfig.enabled || !isReady.value) {
      return;
    }

    if (analyticsConfig.debug) {
      console.log('[Analytics] Reset');
    }

    if (analyticsConfig.providers.posthog?.apiKey) {
      posthogReset();
    }
  };

  // Provider-specific implementations
  const plausibleTrackEvent = (event: AnalyticsEvent) => {
    if (typeof window.plausible !== 'undefined') {
      window.plausible(event.name, { props: event.properties });
    }
  };

  const plausibleTrackPageView = (data: PageViewEvent) => {
    if (typeof window.plausible !== 'undefined') {
      window.plausible('pageview', { url: data.url });
    }
  };

  const umamiTrackEvent = (event: AnalyticsEvent) => {
    if (typeof window.umami !== 'undefined') {
      window.umami.track(event.name, event.properties);
    }
  };

  const umamiTrackPageView = (data: PageViewEvent) => {
    if (typeof window.umami !== 'undefined') {
      window.umami.track({ url: data.url, title: data.title });
    }
  };

  const posthogTrackEvent = (event: AnalyticsEvent) => {
    if (typeof window.posthog !== 'undefined') {
      window.posthog.capture(event.name, event.properties);
    }
  };

  const posthogTrackPageView = (data: PageViewEvent) => {
    if (typeof window.posthog !== 'undefined') {
      window.posthog.capture('$pageview', { $current_url: data.url });
    }
  };

  const posthogIdentify = (data: UserEvent) => {
    if (typeof window.posthog !== 'undefined') {
      window.posthog.identify(data.userId, data.traits);
    }
  };

  const posthogReset = () => {
    if (typeof window.posthog !== 'undefined') {
      window.posthog.reset();
    }
  };

  const customTrackEvent = async (event: AnalyticsEvent) => {
    if (!analyticsConfig.providers.custom?.endpoint) {
      return;
    }

    try {
      await $fetch(analyticsConfig.providers.custom.endpoint, {
        method: 'POST',
        body: {
          type: 'event',
          ...event,
        },
      });
    } catch (error) {
      if (analyticsConfig.debug) {
        console.error('[Analytics] Custom provider error:', error);
      }
    }
  };

  const customTrackPageView = async (data: PageViewEvent) => {
    if (!analyticsConfig.providers.custom?.endpoint) {
      return;
    }

    try {
      await $fetch(analyticsConfig.providers.custom.endpoint, {
        method: 'POST',
        body: {
          type: 'pageview',
          ...data,
        },
      });
    } catch (error) {
      if (analyticsConfig.debug) {
        console.error('[Analytics] Custom provider error:', error);
      }
    }
  };

  return {
    isReady,
    isTrackingEnabled,
    init,
    trackEvent,
    trackPageView,
    identify,
    reset,
  };
};
