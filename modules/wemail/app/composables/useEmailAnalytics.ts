interface AnalyticsData {
  totalSent: number;
  totalReceived: number;
  totalReplied: number;
  totalForwarded: number;
  averageResponseTime: number; // in hours
  topRecipients: { email: string; count: number }[];
  topSenders: { email: string; count: number }[];
  sentByMonth: Record<string, number>;
  receivedByMonth: Record<string, number>;
}

const ANALYTICS_KEY = 'wemail:analytics';

export const useEmailAnalytics = () => {
  const _analytics = ref<AnalyticsData>({
    totalSent: 0,
    totalReceived: 0,
    totalReplied: 0,
    totalForwarded: 0,
    averageResponseTime: 0,
    topRecipients: [],
    topSenders: [],
    sentByMonth: {},
    receivedByMonth: {},
  });
  const _isLoaded = ref(false);

  const loadAnalytics = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
      try {
        _analytics.value = JSON.parse(stored);
      } catch {
        _resetAnalytics();
      }
    }
    _isLoaded.value = true;
  };

  const saveAnalytics = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(_analytics.value));
  };

  const _resetAnalytics = (): void => {
    _analytics.value = {
      totalSent: 0,
      totalReceived: 0,
      totalReplied: 0,
      totalForwarded: 0,
      averageResponseTime: 0,
      topRecipients: [],
      topSenders: [],
      sentByMonth: {},
      receivedByMonth: {},
    };
  };

  const trackSent = (to: string): void => {
    _analytics.value.totalSent++;

    // Update top recipients
    const existing = _analytics.value.topRecipients.find(r => r.email === to);
    if (existing) {
      existing.count++;
    } else {
      _analytics.value.topRecipients.push({ email: to, count: 1 });
    }
    _analytics.value.topRecipients.sort((a, b) => b.count - a.count);
    _analytics.value.topRecipients = _analytics.value.topRecipients.slice(0, 10);

    // Update monthly stats
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    _analytics.value.sentByMonth[month] = (_analytics.value.sentByMonth[month] || 0) + 1;

    saveAnalytics();
  };

  const trackReceived = (from: string): void => {
    _analytics.value.totalReceived++;

    // Update top senders
    const existing = _analytics.value.topSenders.find(s => s.email === from);
    if (existing) {
      existing.count++;
    } else {
      _analytics.value.topSenders.push({ email: from, count: 1 });
    }
    _analytics.value.topSenders.sort((a, b) => b.count - a.count);
    _analytics.value.topSenders = _analytics.value.topSenders.slice(0, 10);

    // Update monthly stats
    const month = new Date().toISOString().slice(0, 7);
    _analytics.value.receivedByMonth[month] = (_analytics.value.receivedByMonth[month] || 0) + 1;

    saveAnalytics();
  };

  const trackReply = (): void => {
    _analytics.value.totalReplied++;
    saveAnalytics();
  };

  const trackForward = (): void => {
    _analytics.value.totalForwarded++;
    saveAnalytics();
  };

  const calculateResponseRate = computed(() => {
    if (_analytics.value.totalReceived === 0) return 0;
    return Math.round((_analytics.value.totalReplied / _analytics.value.totalReceived) * 100);
  });

  const getMonthlyStats = (months = 6): { month: string; sent: number; received: number }[] => {
    const result: { month: string; sent: number; received: number }[] = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7);
      result.push({
        month: monthKey,
        sent: _analytics.value.sentByMonth[monthKey] || 0,
        received: _analytics.value.receivedByMonth[monthKey] || 0,
      });
    }

    return result.reverse();
  };

  const getStatsSummary = computed(() => ({
    sent: _analytics.value.totalSent,
    received: _analytics.value.totalReceived,
    replies: _analytics.value.totalReplied,
    forwards: _analytics.value.totalForwarded,
    responseRate: calculateResponseRate.value,
  }));

  onMounted(() => {
    loadAnalytics();
  });

  return {
    analytics: _analytics,
    stats: getStatsSummary,
    responseRate: calculateResponseRate,
    loadAnalytics,
    trackSent,
    trackReceived,
    trackReply,
    trackForward,
    getMonthlyStats,
  };
};
