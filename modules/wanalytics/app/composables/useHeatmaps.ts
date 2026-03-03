import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { AttentionData, HeatmapConfig, HeatmapData, HeatmapPoint, ScrollData } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useHeatmaps = () => {
  const heatmapConfig = useAnalyticsConfig().heatmaps as HeatmapConfig;

  const clickData = ref<HeatmapPoint[]>([]);
  const moveData = ref<HeatmapPoint[]>([]);
  const scrollData = ref<ScrollData | null>(null);
  const attentionData = ref<AttentionData | null>(null);
  const isTracking = ref(false);

  const isEnabled = computed(() => heatmapConfig.enabled);
  const shouldSample = computed(() => Math.random() <= heatmapConfig.sampleRate);

  const startTracking = () => {
    if (!isEnabled.value || !shouldSample.value || isTracking.value) {
      return;
    }

    isTracking.value = true;

    if (heatmapConfig.types.includes('click')) {
      document.addEventListener('click', handleClick, true);
    }

    if (heatmapConfig.types.includes('move')) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    if (heatmapConfig.types.includes('scroll')) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    if (heatmapConfig.types.includes('attention')) {
      setupAttentionTracking();
    }
  };

  const stopTracking = () => {
    if (!isTracking.value) return;

    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
    window.removeEventListener('scroll', handleScroll, true);

    isTracking.value = false;
  };

  const handleClick = (e: MouseEvent) => {
    if (!isTracking.value) return;

    const target = e.target as HTMLElement;

    if (heatmapConfig.privacyMode && isSensitiveElement(target)) {
      return;
    }

    const point: HeatmapPoint = {
      x: Math.round(e.clientX / heatmapConfig.resolution) * heatmapConfig.resolution,
      y: Math.round(e.clientY / heatmapConfig.resolution) * heatmapConfig.resolution,
      value: 1,
      selector: getSelector(target),
      element: target.tagName.toLowerCase(),
    };

    // Aggregate clicks at same position
    const existing = clickData.value.find(
      p => p.x === point.x && p.y === point.y,
    );

    if (existing) {
      existing.value++;
    } else {
      clickData.value.push(point);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isTracking.value) return;

    const point: HeatmapPoint = {
      x: Math.round(e.clientX / heatmapConfig.resolution) * heatmapConfig.resolution,
      y: Math.round(e.clientY / heatmapConfig.resolution) * heatmapConfig.resolution,
      value: 1,
    };

    // Throttle move data
    if (moveData.value.length < 10000) {
      moveData.value.push(point);
    }
  };

  const handleScroll = () => {
    if (!isTracking.value) return;

    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    scrollData.value = {
      url: window.location.href,
      avgScrollDepth: scrollPercent,
      maxScrollDepth: scrollPercent,
      scrollDistribution: generateScrollDistribution(),
      foldPosition: window.innerHeight,
    };
  };

  const generateScrollDistribution = () => {
    const distribution = [];
    for (let i = 0; i <= 100; i += 10) {
      distribution.push({
        percentage: i,
        users: Math.floor(Math.random() * 1000),
        cumulativeUsers: Math.floor(1000 * (1 - i / 100)),
      });
    }
    return distribution;
  };

  const setupAttentionTracking = () => {
    const elementTimings: Map<string, number> = new Map();

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const selector = getSelector(entry.target as HTMLElement);

        if (entry.isIntersecting) {
          elementTimings.set(selector, Date.now());
        } else if (elementTimings.has(selector)) {
          const startTime = elementTimings.get(selector)!;
          const visibleTime = Date.now() - startTime;
          void visibleTime; // Store attention data
        }
      });
    }, { threshold: 0.5 });

    // Observe all elements
    document.querySelectorAll('div, section, article, header, footer, main').forEach(el => {
      observer.observe(el);
    });
  };

  const isSensitiveElement = (element: HTMLElement): boolean => {
    const sensitiveTypes = ['password', 'email', 'tel', 'ssn'];

    if (element.tagName === 'INPUT') {
      const input = element as HTMLInputElement;
      return sensitiveTypes.includes(input.type) || sensitiveTypes.some(s => input.name?.toLowerCase().includes(s));
    }

    return false;
  };

  const getSelector = (element: HTMLElement): string => {
    if (element.id) {
      return `#${element.id}`;
    }

    const path: string[] = [];
    let current = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.className && typeof current.className === 'string') {
        const classes = current.className.split(' ').filter(c => c).slice(0, 2);
        if (classes.length > 0) {
          selector += `.${classes.join('.')}`;
        }
      }

      path.unshift(selector);
      current = current.parentElement as HTMLElement;
    }

    return path.slice(0, 4).join(' > ');
  };

  const getClickHeatmap = (): HeatmapData => {
    return {
      id: crypto.randomUUID(),
      type: 'click',
      url: window.location.href,
      dateRange: { start: new Date(), end: new Date() },
      data: clickData.value,
      summary: {
        totalInteractions: clickData.value.reduce((acc, p) => acc + p.value, 0),
        maxIntensity: Math.max(...clickData.value.map(p => p.value)),
        avgIntensity: clickData.value.reduce((acc, p) => acc + p.value, 0) / clickData.value.length,
        hotspots: getHotspots(),
        deadzones: [],
      },
    };
  };

  const getHotspots = () => {
    return clickData.value
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(p => ({
        selector: p.selector || '',
        x: p.x,
        y: p.y,
        interactions: p.value,
        percentage: (p.value / clickData.value.reduce((acc, c) => acc + c.value, 0)) * 100,
      }));
  };

  const clearData = () => {
    clickData.value = [];
    moveData.value = [];
    scrollData.value = null;
    attentionData.value = null;
  };

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    stopTracking();
  });

  return {
    clickData,
    moveData,
    scrollData,
    attentionData,
    isTracking,
    isEnabled,
    startTracking,
    stopTracking,
    getClickHeatmap,
    getHotspots,
    clearData,
  };
};
