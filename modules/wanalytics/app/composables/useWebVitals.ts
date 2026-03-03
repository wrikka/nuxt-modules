import { useRuntimeConfig } from '#imports';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { MetricRating, WebVitalName, WebVitalsConfig, WebVitalsMetric, WebVitalsSummary } from '#analytics/types';

const THRESHOLDS: Record<WebVitalName, { good: number; poor: number; }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

export const useWebVitals = () => {
  const config = useRuntimeConfig();
  const vitalsConfig = (config.public.analytics as { webVitals: WebVitalsConfig; }).webVitals;

  const metrics = ref<Map<WebVitalName, WebVitalsMetric>>(new Map());
  const isTracking = ref(false);

  const isEnabled = computed(() => vitalsConfig.enabled);
  const shouldSample = computed(() => Math.random() <= vitalsConfig.sampleRate);

  const getRating = (name: WebVitalName, value: number): MetricRating => {
    const threshold = THRESHOLDS[name];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const trackMetric = (metric: WebVitalsMetric) => {
    metrics.value.set(metric.name, metric);

    if (vitalsConfig.debug) {
      console.log(`[WebVitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    }

    // Send to backend/analytics providers
    void sendMetric(metric);
  };

  const sendMetric = async (metric: WebVitalsMetric) => {
    // This would typically send to your analytics backend
    // For now, we just log in debug mode
    if (vitalsConfig.debug) {
      console.log('[WebVitals] Sending metric:', metric);
    }
  };

  const observeLCP = () => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        trackMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          url: window.location.href,
        });
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Browser doesn't support LCP
    }
  };

  const observeFID = () => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          trackMetric({
            name: 'FID',
            value: entry.duration,
            rating: getRating('FID', entry.duration),
            delta: entry.duration,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            url: window.location.href,
          });
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch {
      // Browser doesn't support FID
    }
  };

  const observeCLS = () => {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          if (!(entry as unknown as { hadRecentInput?: boolean; }).hadRecentInput) {
            clsValue += (entry as unknown as { value: number; }).value;
            clsEntries.push(entry);
          }
        });
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page unload
      const reportCLS = () => {
        trackMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          url: window.location.href,
        });
      };

      window.addEventListener('pagehide', reportCLS);
      window.addEventListener('beforeunload', reportCLS);
    } catch {
      // Browser doesn't support CLS
    }
  };

  const observeFCP = () => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            trackMetric({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
              delta: entry.startTime,
              id: crypto.randomUUID(),
              timestamp: new Date(),
              url: window.location.href,
            });
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
    } catch {
      // Browser doesn't support FCP
    }
  };

  const observeTTFB = () => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

      trackMetric({
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        delta: ttfb,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        url: window.location.href,
      });
    }
  };

  const observeINP = () => {
    if (!('PerformanceObserver' in window)) return;

    let inpValue = 0;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          const duration = entry.duration;
          if (duration > inpValue) {
            inpValue = duration;
          }
        });
      });

      observer.observe({ type: 'event', buffered: true });

      // Report INP on page unload
      const reportINP = () => {
        if (inpValue > 0) {
          trackMetric({
            name: 'INP',
            value: inpValue,
            rating: getRating('INP', inpValue),
            delta: inpValue,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            url: window.location.href,
          });
        }
      };

      window.addEventListener('pagehide', reportINP);
      window.addEventListener('beforeunload', reportINP);
    } catch {
      // Browser doesn't support INP
    }
  };

  const startTracking = () => {
    if (!isEnabled.value || !shouldSample.value || isTracking.value) {
      return;
    }

    isTracking.value = true;

    // Wait for page to be ready
    if (document.readyState === 'complete') {
      observeAll();
    } else {
      window.addEventListener('load', observeAll);
    }
  };

  const observeAll = () => {
    observeTTFB();
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
    observeINP();
  };

  const stopTracking = () => {
    isTracking.value = false;
  };

  const getMetric = (name: WebVitalName): WebVitalsMetric | undefined => {
    return metrics.value.get(name);
  };

  const getAllMetrics = (): WebVitalsMetric[] => {
    return Array.from(metrics.value.values());
  };

  const getSummary = (): WebVitalsSummary => {
    return {
      period: {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      },
      metrics: {} as Record<WebVitalName, MetricSummary>,
      trends: {} as Record<WebVitalName, MetricTrend>,
      pageMetrics: [],
    };
  };

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    stopTracking();
  });

  return {
    metrics,
    isTracking,
    isEnabled,
    startTracking,
    stopTracking,
    getMetric,
    getAllMetrics,
    getSummary,
    getRating,
  };
};

type MetricSummary = {
  name: WebVitalName;
  avg: number;
  median: number;
  p75: number;
  p95: number;
  p99: number;
  good: number;
  needsImprovement: number;
  poor: number;
  rating: MetricRating;
};

type MetricTrend = {
  name: WebVitalName;
  change: number;
  direction: 'up' | 'down' | 'stable';
  isPositive: boolean;
};
