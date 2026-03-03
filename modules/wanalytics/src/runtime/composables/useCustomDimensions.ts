import { computed, ref } from 'vue';
import type { CustomDataConfig, CustomDataReport, CustomDimension, CustomMetric } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useCustomDimensions = () => {
  const customConfig = useAnalyticsConfig().customData as CustomDataConfig;

  const dimensions = ref<Map<string, CustomDimension>>(new Map());
  const metrics = ref<Map<string, CustomMetric>>(new Map());
  const activeDimensions = ref<Map<string, unknown>>(new Map());
  const activeMetrics = ref<Map<string, number>>(new Map());

  const isEnabled = computed(() => customConfig.enabled);

  const createDimension = (
    name: string,
    scope: CustomDimension['scope'],
    options: Partial<CustomDimension> = {},
  ): CustomDimension | null => {
    if (!isEnabled.value) return null;
    if (dimensions.value.size >= customConfig.maxDimensions) return null;

    const dimension: CustomDimension = {
      id: crypto.randomUUID(),
      name,
      key: options.key ?? name.toLowerCase().replace(/\s+/g, '_'),
      type: options.type ?? 'string',
      scope,
      active: true,
      description: options.description,
    };

    dimensions.value.set(dimension.id, dimension);
    return dimension;
  };

  const createMetric = (
    name: string,
    type: CustomMetric['type'],
    scope: CustomMetric['scope'],
    options: Partial<CustomMetric> = {},
  ): CustomMetric | null => {
    if (!isEnabled.value) return null;
    if (metrics.value.size >= customConfig.maxMetrics) return null;

    const metric: CustomMetric = {
      id: crypto.randomUUID(),
      name,
      key: options.key ?? name.toLowerCase().replace(/\s+/g, '_'),
      type,
      scope,
      active: true,
      unit: options.unit,
      description: options.description,
      formatting: options.formatting,
    };

    metrics.value.set(metric.id, metric);
    return metric;
  };

  const setDimension = (name: string, value: unknown): boolean => {
    if (!isEnabled.value) return false;

    // Find dimension by name
    const dimension = Array.from(dimensions.value.values()).find(d => d.name === name);
    if (!dimension) return false;

    activeDimensions.value.set(dimension.id, value);
    return true;
  };

  const setMetric = (name: string, value: number): boolean => {
    if (!isEnabled.value) return false;

    // Find metric by name
    const metric = Array.from(metrics.value.values()).find(m => m.name === name);
    if (!metric) return false;

    if (metric.type === 'currency' && metric.formatting?.currency) {
      // Apply currency formatting if needed
    }

    activeMetrics.value.set(metric.id, value);
    return true;
  };

  const incrementMetric = (name: string, amount: number = 1): boolean => {
    if (!isEnabled.value) return false;

    const metric = Array.from(metrics.value.values()).find(m => m.name === name);
    if (!metric || metric.type !== 'integer') return false;

    const currentValue = activeMetrics.value.get(metric.id) ?? 0;
    activeMetrics.value.set(metric.id, currentValue + amount);
    return true;
  };

  const getDimension = (name: string): unknown => {
    const dimension = Array.from(dimensions.value.values()).find(d => d.name === name);
    if (!dimension) return undefined;

    return activeDimensions.value.get(dimension.id);
  };

  const getMetric = (name: string): number | undefined => {
    const metric = Array.from(metrics.value.values()).find(m => m.name === name);
    if (!metric) return undefined;

    return activeMetrics.value.get(metric.id);
  };

  const getAllDimensions = (): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    dimensions.value.forEach((dimension, id) => {
      const value = activeDimensions.value.get(id);
      if (value !== undefined) {
        result[dimension.name] = value;
      }
    });

    return result;
  };

  const getAllMetrics = (): Record<string, number> => {
    const result: Record<string, number> = {};

    metrics.value.forEach((metric, id) => {
      const value = activeMetrics.value.get(id);
      if (value !== undefined) {
        result[metric.name] = value;
      }
    });

    return result;
  };

  const clearDimension = (name: string): boolean => {
    const dimension = Array.from(dimensions.value.values()).find(d => d.name === name);
    if (!dimension) return false;

    return activeDimensions.value.delete(dimension.id);
  };

  const clearMetric = (name: string): boolean => {
    const metric = Array.from(metrics.value.values()).find(m => m.name === name);
    if (!metric) return false;

    return activeMetrics.value.delete(metric.id);
  };

  const clearAll = () => {
    activeDimensions.value.clear();
    activeMetrics.value.clear();
  };

  const getReport = async (period: { start: Date; end: Date; }): Promise<CustomDataReport> => {
    const dimensionValues = getAllDimensions();
    const metricValues = getAllMetrics();

    return {
      period,
      dimensions: Array.from(dimensions.value.values()),
      metrics: Array.from(metrics.value.values()),
      data: [{
        dimensions: dimensionValues,
        metrics: metricValues,
      }],
      totals: metricValues,
    };
  };

  const initAutoTrack = () => {
    if (!isEnabled.value) return;

    customConfig.autoTrack.forEach(item => {
      // Auto-track specified dimensions/metrics
      if (item === 'page_author') {
        setDimension(
          'page_author',
          document.querySelector('meta[name="author"]')?.getAttribute('content') || 'Unknown',
        );
      }
      if (item === 'page_category') {
        setDimension(
          'page_category',
          document.querySelector('meta[name="category"]')?.getAttribute('content') || 'Uncategorized',
        );
      }
      if (item === 'scroll_depth') {
        // Track scroll depth as metric
        window.addEventListener('scroll', () => {
          const depth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          setMetric('scroll_depth', Math.round(depth));
        });
      }
    });
  };

  return {
    dimensions,
    metrics,
    activeDimensions,
    activeMetrics,
    isEnabled,
    createDimension,
    createMetric,
    setDimension,
    setMetric,
    incrementMetric,
    getDimension,
    getMetric,
    getAllDimensions,
    getAllMetrics,
    clearDimension,
    clearMetric,
    clearAll,
    getReport,
    initAutoTrack,
  };
};
