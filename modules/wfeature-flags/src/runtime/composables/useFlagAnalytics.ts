import { computed, useState } from 'vue';
import type { AnalyticsEvent, ExperimentStats, FlagUsageStats } from '#feature-flags/types';

export const useFlagAnalytics = () => {
  // TODO: Get config from runtime config
  // For now, use default values
  const config = {
    public: {
      featureFlags: {
        defaultFlags: {},
        analytics: { enabled: false, trackEvaluations: false },
      },
    },
  };
  const flagsConfig = config.public.featureFlags
    ?? { defaultFlags: {}, analytics: { enabled: false, trackEvaluations: false } };

  const usageStats = useState<Map<string, FlagUsageStats>>(
    'feature-flags-usage-stats',
    () => new Map(),
  );

  const experimentStats = useState<Map<string, ExperimentStats>>(
    'feature-flags-experiment-stats',
    () => new Map(),
  );

  const trackEvaluation = async (
    flagKey: string,
    enabled: boolean,
    context?: { userId?: string; sessionId?: string; attributes?: Record<string, unknown>; },
  ) => {
    // Update local stats
    const existing = usageStats.value.get(flagKey) ?? {
      flagKey,
      evaluations: 0,
      enabledCount: 0,
      disabledCount: 0,
      lastEvaluated: 0,
    };

    existing.evaluations++;
    existing.lastEvaluated = Date.now();

    if (enabled) {
      existing.enabledCount++;
    } else {
      existing.disabledCount++;
    }

    usageStats.value.set(flagKey, existing);

    // Send to analytics provider
    if (flagsConfig.analytics?.enabled && flagsConfig.analytics.trackEvaluations) {
      const event: AnalyticsEvent = {
        name: 'flag_evaluated',
        category: 'flag',
        action: enabled ? 'enabled' : 'disabled',
        timestamp: Date.now(),
        data: { flagKey, enabled },
        context,
      };

      await sendAnalyticsEvent(event);
    }
  };

  const trackExperimentParticipation = async (
    experimentId: string,
    variantId: string,
    context?: { userId?: string; sessionId?: string; },
  ) => {
    const key = `${experimentId}:${variantId}`;
    const existing = experimentStats.value.get(key) ?? {
      experimentId,
      variantId,
      participants: 0,
      conversions: 0,
      conversionRate: 0,
    };

    existing.participants++;
    experimentStats.value.set(key, existing);

    if (flagsConfig.analytics?.enabled && flagsConfig.analytics.trackExperiments) {
      const event: AnalyticsEvent = {
        name: 'experiment_participated',
        category: 'experiment',
        action: 'variant_assigned',
        timestamp: Date.now(),
        data: { experimentId, variantId },
        context,
      };

      await sendAnalyticsEvent(event);
    }
  };

  const trackExperimentConversion = async (
    experimentId: string,
    variantId: string,
    metricKey: string,
    value = 1,
    context?: { userId?: string; sessionId?: string; },
  ) => {
    const key = `${experimentId}:${variantId}`;
    const existing = experimentStats.value.get(key);

    if (existing) {
      existing.conversions += value;
      existing.conversionRate = existing.participants > 0
        ? existing.conversions / existing.participants
        : 0;

      experimentStats.value.set(key, existing);
    }

    if (flagsConfig.analytics?.enabled && flagsConfig.analytics.trackExperiments) {
      const event: AnalyticsEvent = {
        name: 'experiment_converted',
        category: 'experiment',
        action: 'conversion',
        timestamp: Date.now(),
        data: { experimentId, variantId, metricKey, value },
        context,
      };

      await sendAnalyticsEvent(event);
    }
  };

  const trackFlagChange = async (
    flagKey: string,
    previousValue: boolean,
    newValue: boolean,
    actor?: { type: string; id?: string; },
  ) => {
    if (flagsConfig.analytics?.enabled && flagsConfig.analytics.trackChanges) {
      const event: AnalyticsEvent = {
        name: 'flag_changed',
        category: 'flag',
        action: newValue ? 'enabled' : 'disabled',
        timestamp: Date.now(),
        data: { flagKey, previousValue, newValue },
        context: actor ? { userId: actor.id } : undefined,
      };

      await sendAnalyticsEvent(event);
    }
  };

  const getFlagStats = (flagKey: string): FlagUsageStats | undefined => {
    return usageStats.value.get(flagKey);
  };

  const getAllFlagStats = computed(() => Array.from(usageStats.value.values()));

  const getExperimentStats = (experimentId: string, variantId: string): ExperimentStats | undefined => {
    return experimentStats.value.get(`${experimentId}:${variantId}`);
  };

  const getAllExperimentStats = computed(() => Array.from(experimentStats.value.values()));

  const getTopFlags = (limit = 10) => {
    return getAllFlagStats.value
      .sort((a, b) => (b as FlagUsageStats).evaluations - (a as FlagUsageStats).evaluations)
      .slice(0, limit);
  };

  const clearStats = () => {
    usageStats.value.clear();
    experimentStats.value.clear();
  };

  return {
    trackEvaluation,
    trackExperimentParticipation,
    trackExperimentConversion,
    trackFlagChange,
    getFlagStats,
    getAllFlagStats,
    getExperimentStats,
    getAllExperimentStats,
    getTopFlags,
    clearStats,
  };
};

const sendAnalyticsEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    await $fetch('/api/feature-flags/analytics', {
      method: 'POST',
      body: event,
    });
  } catch {
    // Silently fail analytics tracking
  }
};
