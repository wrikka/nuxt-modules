import { useRuntimeConfig } from '#imports';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type {
  AnalyticsConfig,
  ErrorSummary,
  ErrorTrackingConfig,
  ErrorType,
  NetworkError,
  PerformanceIssue,
  TrackedErrorEvent,
} from '#analytics/types';

export const useErrorTracking = () => {
  const config = useRuntimeConfig();
  const errorConfig = (config.public.analytics as AnalyticsConfig).errorTracking as ErrorTrackingConfig;

  const errors = ref<TrackedErrorEvent[]>([]);
  const networkErrors = ref<NetworkError[]>([]);
  const performanceIssues = ref<PerformanceIssue[]>([]);
  const isTracking = ref(false);

  const isEnabled = computed(() => errorConfig.enabled);

  const startTracking = () => {
    if (!isEnabled.value || isTracking.value) return;

    isTracking.value = true;

    // JavaScript errors
    window.addEventListener('error', handleJSError);

    // Promise rejections
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    // Network errors (fetch interceptor)
    interceptFetch();

    // Performance issues
    if (typeof PerformanceObserver !== 'undefined') {
      observePerformance();
    }
  };

  const stopTracking = () => {
    isTracking.value = false;

    window.removeEventListener('error', handleJSError);
    window.removeEventListener('unhandledrejection', handlePromiseRejection);
  };

  const handleJSError = (event: globalThis.ErrorEvent) => {
    if (!shouldTrack(event.message, event.filename)) return;

    const error: TrackedErrorEvent = {
      id: crypto.randomUUID(),
      type: 'javascript',
      message: event.message,
      stack: errorConfig.captureStackTrace ? event.error?.stack : undefined,
      url: event.filename || window.location.href,
      line: event.lineno,
      column: event.colno,
      timestamp: new Date(),
      sessionId: getSessionId(),
      browser: getBrowser(),
      os: getOS(),
      device: getDevice(),
      context: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    };

    errors.value.push(error);
    void sendError(error);
  };

  const handlePromiseRejection = (event: PromiseRejectionEvent) => {
    const message = event.reason?.message || 'Unhandled Promise Rejection';

    if (!shouldTrack(message)) return;

    const error: TrackedErrorEvent = {
      id: crypto.randomUUID(),
      type: 'javascript',
      message,
      stack: errorConfig.captureStackTrace ? event.reason?.stack : undefined,
      url: window.location.href,
      timestamp: new Date(),
      sessionId: getSessionId(),
      browser: getBrowser(),
      os: getOS(),
      device: getDevice(),
      context: {
        reason: String(event.reason),
      },
    };

    errors.value.push(error);
    void sendError(error);
  };

  const interceptFetch = () => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;

      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          trackNetworkError(url, response.status, response.statusText, Date.now() - startTime);
        }

        return response;
      } catch (error) {
        trackNetworkError(url, 0, 'Network Error', Date.now() - startTime);
        throw error;
      }
    };
  };

  const trackNetworkError = (url: string, status: number, statusText: string, duration: number) => {
    const networkError: NetworkError = {
      url,
      method: 'GET',
      status,
      statusText,
      duration,
      timestamp: new Date(),
    };

    networkErrors.value.push(networkError);

    const error: TrackedErrorEvent = {
      id: crypto.randomUUID(),
      type: 'network',
      message: `${status} ${statusText}: ${url}`,
      url: window.location.href,
      timestamp: new Date(),
      sessionId: getSessionId(),
      browser: getBrowser(),
      os: getOS(),
      device: getDevice(),
      context: { networkError },
    };

    errors.value.push(error);
    void sendError(error);
  };

  const observePerformance = () => {
    // Long tasks
    try {
      const longTaskObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 50) {
            trackPerformanceIssue('long_task', entry.duration, 50);
          }
        });
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch {
      // Not supported
    }

    // Resource timing
    try {
      const resourceObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 3000) {
            trackPerformanceIssue('slow_api', resource.duration, 3000);
          }
        });
      });
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch {
      // Not supported
    }
  };

  const trackPerformanceIssue = (type: PerformanceIssue['type'], value: number, threshold: number) => {
    const issue: PerformanceIssue = {
      type,
      severity: value > threshold * 2 ? 'critical' : 'warning',
      description: `${type.replace('_', ' ')} detected`,
      value,
      threshold,
      url: window.location.href,
      timestamp: new Date(),
    };

    performanceIssues.value.push(issue);
  };

  const shouldTrack = (message: string, url?: string): boolean => {
    // Check sample rate
    if (Math.random() > errorConfig.sampleRate) return false;

    // Check ignored errors
    if (errorConfig.ignoreErrors.some(pattern => message.includes(pattern))) {
      return false;
    }

    // Check ignored URLs
    if (url && errorConfig.ignoreUrls.some(pattern => url.includes(pattern))) {
      return false;
    }

    return true;
  };

  const sendError = async (error: TrackedErrorEvent) => {
    // Would send to backend
    const analyticsConfig = config.public.analytics as AnalyticsConfig;
    if (analyticsConfig.debug) {
      console.error('[ErrorTracking]', error);
    }
  };

  const getSessionId = (): string | undefined => {
    return sessionStorage.getItem('analytics_session_id') ?? undefined;
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  };

  const getOS = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  const getDevice = (): string => {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  };

  const getSummary = (period: { start: Date; end: Date; }): ErrorSummary => {
    const periodErrors = errors.value.filter(
      e => e.timestamp >= period.start && e.timestamp <= period.end,
    );

    const byType: Record<ErrorType, number> = {
      javascript: 0,
      network: 0,
      resource: 0,
      render: 0,
      hydration: 0,
      api: 0,
      custom: 0,
    };

    periodErrors.forEach(e => {
      byType[e.type]++;
    });

    return {
      period,
      totalErrors: periodErrors.length,
      affectedUsers: new Set(periodErrors.map(e => e.sessionId)).size,
      affectedSessions: new Set(periodErrors.map(e => e.sessionId)).size,
      errorRate: periodErrors.length / Math.max(1, periodErrors.length),
      errorsByType: byType,
      topErrors: getTopErrors(periodErrors),
      trends: [],
    };
  };

  const getTopErrors = (errorList: TrackedErrorEvent[]) => {
    const grouped = new Map<string, { count: number; error: TrackedErrorEvent; }>();

    errorList.forEach(error => {
      const key = error.message;
      const existing = grouped.get(key);

      if (existing) {
        existing.count++;
      } else {
        grouped.set(key, { count: 1, error });
      }
    });

    return Array.from(grouped.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(({ count, error }) => ({
        fingerprint: error.id,
        message: error.message,
        type: error.type,
        count,
        affectedUsers: count,
        firstSeen: error.timestamp,
        lastSeen: error.timestamp,
        url: error.url,
        stack: error.stack,
      }));
  };

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    stopTracking();
  });

  return {
    errors,
    networkErrors,
    performanceIssues,
    isTracking,
    isEnabled,
    startTracking,
    stopTracking,
    getSummary,
  };
};
