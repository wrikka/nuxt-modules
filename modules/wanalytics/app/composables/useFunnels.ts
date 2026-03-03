import { computed, ref } from 'vue';
import type {
  DateRange,
  Funnel,
  FunnelComparison,
  FunnelConfig,
  FunnelData,
  FunnelStep,
  FunnelStepData,
} from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useFunnels = () => {
  const funnelConfig = useAnalyticsConfig().funnels as FunnelConfig;

  const funnels = ref<Funnel[]>([]);
  const currentFunnelData = ref<FunnelData | null>(null);

  const isEnabled = computed(() => funnelConfig.enabled);

  const createFunnel = (name: string, steps: Omit<FunnelStep, 'id' | 'order'>[]): Funnel => {
    const funnel: Funnel = {
      id: crypto.randomUUID(),
      name,
      steps: steps.map((step, index) => ({
        ...step,
        id: crypto.randomUUID(),
        order: index,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    funnels.value.push(funnel);
    return funnel;
  };

  const updateFunnel = (funnelId: string, updates: Partial<Funnel>): Funnel | null => {
    const index = funnels.value.findIndex(f => f.id === funnelId);
    if (index === -1) return null;

    funnels.value[index] = {
      ...funnels.value[index],
      ...updates,
      updatedAt: new Date(),
    };

    return funnels.value[index];
  };

  const deleteFunnel = (funnelId: string): boolean => {
    const index = funnels.value.findIndex(f => f.id === funnelId);
    if (index === -1) return false;

    funnels.value.splice(index, 1);
    return true;
  };

  const getFunnel = (funnelId: string): Funnel | undefined => {
    return funnels.value.find(f => f.id === funnelId);
  };

  const trackStep = async (funnelId: string, _stepId: string): Promise<void> => {
    const funnel = getFunnel(funnelId);
    if (!funnel) return;

    // This would typically send to backend
    // For now, we just update local state
  };

  const getFunnelData = async (
    funnelId: string,
    period: DateRange,
  ): Promise<FunnelData | null> => {
    const funnel = getFunnel(funnelId);
    if (!funnel) return null;

    // Mock data for UI - would be fetched from backend
    const stepsData: FunnelStepData[] = funnel.steps.map((step, index) => {
      const visitors = Math.floor(1000 * Math.pow(0.7, index));
      const previousVisitors = index === 0 ? 1000 : Math.floor(1000 * Math.pow(0.7, index - 1));

      return {
        stepId: step.id,
        stepName: step.name,
        visitors,
        dropOff: previousVisitors - visitors,
        dropOffRate: ((previousVisitors - visitors) / previousVisitors) * 100,
        conversionRate: (visitors / 1000) * 100,
        averageTimeToComplete: Math.floor(Math.random() * 60) + 10,
        previousStepVisitors: previousVisitors,
      };
    });

    const funnelData: FunnelData = {
      funnelId,
      period,
      steps: stepsData,
      totalVisitors: 1000,
      conversionRate: stepsData[stepsData.length - 1].conversionRate,
      averageTime: stepsData.reduce((acc, s) => acc + s.averageTimeToComplete, 0),
    };

    currentFunnelData.value = funnelData;
    return funnelData;
  };

  const compareFunnels = async (
    funnelId: string,
    currentPeriod: DateRange,
    previousPeriod: DateRange,
  ): Promise<FunnelComparison | null> => {
    const current = await getFunnelData(funnelId, currentPeriod);
    const previous = await getFunnelData(funnelId, previousPeriod);

    if (!current || !previous) return null;

    return {
      current,
      previous,
      change: {
        conversionRateChange: current.conversionRate - previous.conversionRate,
        visitorsChange: current.totalVisitors - previous.totalVisitors,
        dropOffChange: current.steps[0].dropOffRate - previous.steps[0].dropOffRate,
      },
    };
  };

  const analyzeDropOffs = (funnelData: FunnelData): FunnelStepData[] => {
    return funnelData.steps
      .filter(step => step.dropOffRate > 20)
      .sort((a, b) => b.dropOffRate - a.dropOffRate);
  };

  const getConversionPath = (funnelData: FunnelData): string[] => {
    return funnelData.steps.map(step => step.stepName);
  };

  const initDefaultFunnels = () => {
    if (funnelConfig.defaultSteps.length > 0) {
      createFunnel(
        'Default Funnel',
        funnelConfig.defaultSteps.map(step => ({
          name: step.name,
          type: step.type,
          target: step.target,
        })),
      );
    }
  };

  return {
    funnels,
    currentFunnelData,
    isEnabled,
    createFunnel,
    updateFunnel,
    deleteFunnel,
    getFunnel,
    trackStep,
    getFunnelData,
    compareFunnels,
    analyzeDropOffs,
    getConversionPath,
    initDefaultFunnels,
  };
};
