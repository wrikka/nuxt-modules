import { computed, ref } from 'vue';
import type {
  DropOffPoint,
  JourneyAnalysis,
  JourneyConfig,
  JourneyEvent,
  JourneyPage,
  JourneyPattern,
  PageStatistic,
  UserJourney,
} from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useJourneys = () => {
  const journeyConfig = useAnalyticsConfig().journeys as JourneyConfig;

  const currentJourney = ref<UserJourney | null>(null);
  const pages = ref<JourneyPage[]>([]);
  const events = ref<JourneyEvent[]>([]);
  const journeyStartTime = ref<Date | null>(null);

  const isEnabled = computed(() => journeyConfig.enabled);

  const startJourney = (userId?: string) => {
    journeyStartTime.value = new Date();
    pages.value = [];
    events.value = [];

    currentJourney.value = {
      id: crypto.randomUUID(),
      userId,
      sessionId: crypto.randomUUID(),
      startTime: journeyStartTime.value,
      pages: [],
      events: [],
    };

    trackPage(window.location.href, document.title);
  };

  const endJourney = () => {
    if (!currentJourney.value || !journeyStartTime.value) return;

    currentJourney.value.endTime = new Date();
    currentJourney.value.pages = pages.value;
    currentJourney.value.events = events.value;
  };

  const trackPage = (url: string, title: string) => {
    if (!currentJourney.value) return;

    const now = new Date();

    // End previous page tracking
    if (pages.value.length > 0) {
      const lastPage = pages.value[pages.value.length - 1];
      lastPage.duration = now.getTime() - new Date(lastPage.timestamp).getTime();
    }

    const newPage: JourneyPage = {
      url,
      title,
      timestamp: now,
      duration: 0,
      scrollDepth: 0,
      exitRate: 0,
    };

    pages.value.push(newPage);

    if (pages.value.length > journeyConfig.maxSteps) {
      pages.value.shift();
    }
  };

  const trackEvent = (name: string, properties: Record<string, unknown> = {}) => {
    if (!currentJourney.value) return;

    const event: JourneyEvent = {
      name,
      timestamp: new Date(),
      page: window.location.href,
      properties,
    };

    events.value.push(event);
  };

  const trackScrollDepth = (depth: number) => {
    if (!journeyConfig.trackScrollDepth || pages.value.length === 0) return;

    const currentPage = pages.value[pages.value.length - 1];
    if (currentPage && depth > currentPage.scrollDepth) {
      currentPage.scrollDepth = depth;
    }
  };

  const trackConversion = (type: string, value: number) => {
    if (!currentJourney.value) return;

    currentJourney.value.conversion = {
      type,
      value,
      timestamp: new Date(),
      page: window.location.href,
    };
  };

  const getJourney = (): UserJourney | null => {
    return currentJourney.value;
  };

  const getPages = (): JourneyPage[] => {
    return pages.value;
  };

  const getEvents = (): JourneyEvent[] => {
    return events.value;
  };

  const analyzeJourney = (journey: UserJourney): JourneyAnalysis => {
    const pageStats = calculatePageStatistics(journey.pages);
    const dropOffs = identifyDropOffPoints(journey.pages);
    const patterns = identifyPatterns(journey);

    return {
      commonPaths: patterns,
      dropOffPoints: dropOffs,
      entryPages: pageStats.entries,
      exitPages: pageStats.exits,
      avgJourneyLength: journey.pages.length,
      avgJourneyDuration: journey.pages.reduce((acc, p) => acc + p.duration, 0),
    };
  };

  const calculatePageStatistics = (journeyPages: JourneyPage[]) => {
    const pageVisits: Record<string, { visits: number; duration: number; title: string; }> = {};

    journeyPages.forEach(page => {
      if (!pageVisits[page.url]) {
        pageVisits[page.url] = { visits: 0, duration: 0, title: page.title };
      }
      pageVisits[page.url].visits++;
      pageVisits[page.url].duration += page.duration;
    });

    const totalVisits = Object.values(pageVisits).reduce((acc, p) => acc + p.visits, 0);

    const entries: PageStatistic[] = Object.entries(pageVisits)
      .map(([url, data]) => ({
        url,
        title: data.title,
        visits: data.visits,
        percentage: (data.visits / totalVisits) * 100,
        avgDuration: data.duration / data.visits,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    const exits: PageStatistic[] = [...entries]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    return { entries, exits };
  };

  const identifyDropOffPoints = (journeyPages: JourneyPage[]): DropOffPoint[] => {
    const dropOffs: DropOffPoint[] = [];

    for (let i = 0; i < journeyPages.length - 1; i++) {
      const currentPage = journeyPages[i];
      const nextPage = journeyPages[i + 1];

      const timeSpent = currentPage.duration;
      const avgTime = 30000; // 30 seconds average

      if (timeSpent < avgTime * 0.5) {
        dropOffs.push({
          page: currentPage.url,
          dropOffRate: (avgTime - timeSpent) / avgTime * 100,
          previousPage: i > 0 ? journeyPages[i - 1].url : undefined,
          commonNextActions: [nextPage.url],
        });
      }
    }

    return dropOffs;
  };

  const identifyPatterns = (journey: UserJourney): JourneyPattern[] => {
    const patterns: JourneyPattern[] = [];
    const pathKey = journey.pages.map(p => p.url).join(' -> ');

    patterns.push({
      id: crypto.randomUUID(),
      name: pathKey.slice(0, 50),
      pattern: journey.pages.map((p, i) => ({
        type: 'page' as const,
        value: p.url,
        order: i,
      })),
      frequency: 1,
      conversionRate: journey.conversion ? 100 : 0,
      avgDuration: journey.pages.reduce((acc, p) => acc + p.duration, 0),
    });

    return patterns;
  };

  const getJourneyDuration = (): number => {
    if (!journeyStartTime.value) return 0;
    return Date.now() - journeyStartTime.value.getTime();
  };

  const getPageCount = (): number => {
    return pages.value.length;
  };

  const getEventCount = (): number => {
    return events.value.length;
  };

  return {
    currentJourney,
    pages,
    events,
    isEnabled,
    startJourney,
    endJourney,
    trackPage,
    trackEvent,
    trackScrollDepth,
    trackConversion,
    getJourney,
    getPages,
    getEvents,
    analyzeJourney,
    getJourneyDuration,
    getPageCount,
    getEventCount,
  };
};
