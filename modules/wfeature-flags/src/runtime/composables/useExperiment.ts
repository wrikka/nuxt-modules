import { computed, useRuntimeConfig, useState } from '#imports';
import type {
  Experiment,
  ExperimentAllocation,
  ExperimentResult,
  ExperimentVariant,
  FlagEvaluationContext,
} from '#feature-flags/types';

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const allocateVariant = (
  experiment: Experiment,
  userId: string,
): ExperimentVariant => {
  const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
  const hash = hashString(`${experiment.id}:${userId}`);
  const bucket = (hash % 10000) / 10000;

  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight / totalWeight;
    if (bucket < cumulative) {
      return variant;
    }
  }

  return experiment.variants[0];
};

export const useExperiment = (experimentKey: string) => {
  const config = useRuntimeConfig();
  const flagsConfig = config.public.featureFlags;

  const context = useState<FlagEvaluationContext>('feature-flags-context');
  const allocations = useState<Map<string, ExperimentAllocation>>(
    'feature-flags-allocations',
    () => new Map(),
  );

  const experiments = useState<Map<string, Experiment>>(
    'feature-flags-experiments',
    () => new Map(),
  );

  const experiment = computed(() => experiments.value.get(experimentKey));

  const variant = computed<ExperimentVariant | null>(() => {
    const exp = experiment.value;
    if (!exp || !exp.enabled) {
      return null;
    }

    const userId = context.value.userId;
    if (!userId) {
      return null;
    }

    // Check existing allocation
    const existingAllocation = allocations.value.get(exp.id);
    if (existingAllocation) {
      return exp.variants.find(v => v.id === existingAllocation.variantId) ?? null;
    }

    // Allocate new variant
    const allocatedVariant = allocateVariant(exp, userId);

    // Store allocation
    const allocation: ExperimentAllocation = {
      experimentId: exp.id,
      variantId: allocatedVariant.id,
      userId,
      timestamp: Date.now(),
    };
    allocations.value.set(exp.id, allocation);

    // Persist to storage
    if (flagsConfig.persistInStorage && import.meta.client) {
      try {
        localStorage.setItem(
          `exp_${exp.id}`,
          JSON.stringify(allocation),
        );
      } catch {
        // Storage not available
      }
    }

    return allocatedVariant;
  });

  const result = computed<ExperimentResult | null>(() => {
    const exp = experiment.value;
    const v = variant.value;

    if (!exp || !v) {
      return null;
    }

    return {
      experimentId: exp.id,
      variantId: v.id,
      variantKey: v.key,
      payload: v.payload,
      isControl: v.isControl,
    };
  });

  const isControl = computed(() => variant.value?.isControl ?? false);

  const payload = computed(() => variant.value?.payload);

  const isActive = computed(() => {
    const exp = experiment.value;
    if (!exp || !exp.enabled) {
      return false;
    }

    if (exp.startDate && Date.now() < exp.startDate) {
      return false;
    }

    if (exp.endDate && Date.now() > exp.endDate) {
      return false;
    }

    return true;
  });

  const trackMetric = async (metricKey: string, value = 1) => {
    const exp = experiment.value;
    const v = variant.value;

    if (!exp || !v) {
      return;
    }

    try {
      await $fetch('/api/feature-flags/experiments/metrics', {
        method: 'POST',
        body: {
          experimentId: exp.id,
          variantId: v.id,
          metricKey,
          value,
          context: context.value,
        },
      });
    } catch (error) {
      if (flagsConfig.debug) {
        console.error('[FeatureFlags] Error tracking metric:', error);
      }
    }
  };

  const loadAllocationFromStorage = () => {
    if (!flagsConfig.persistInStorage || !import.meta.client) {
      return;
    }

    const exp = experiment.value;
    if (!exp) {
      return;
    }

    try {
      const stored = localStorage.getItem(`exp_${exp.id}`);
      if (stored) {
        const allocation: ExperimentAllocation = JSON.parse(stored);
        allocations.value.set(exp.id, allocation);
      }
    } catch {
      // Storage not available or invalid data
    }
  };

  return {
    experiment,
    variant,
    result,
    isControl,
    payload,
    isActive,
    trackMetric,
    loadAllocationFromStorage,
  };
};

export const useExperiments = () => {
  const config = useRuntimeConfig();
  const flagsConfig = config.public.featureFlags;

  const experiments = useState<Map<string, Experiment>>(
    'feature-flags-experiments',
    () => new Map(),
  );

  const allExperiments = computed(() => Array.from(experiments.value.values()));

  const activeExperiments = computed(() =>
    allExperiments.value.filter(exp => {
      if (!exp.enabled) {
        return false;
      }

      if (exp.startDate && Date.now() < exp.startDate) {
        return false;
      }

      if (exp.endDate && Date.now() > exp.endDate) {
        return false;
      }

      return true;
    })
  );

  const refreshExperiments = async () => {
    try {
      const data = await $fetch<Experiment[]>('/api/feature-flags/experiments');
      experiments.value.clear();
      for (const exp of data) {
        experiments.value.set(exp.key, exp);
      }
    } catch (error) {
      if (flagsConfig.debug) {
        console.error('[FeatureFlags] Error refreshing experiments:', error);
      }
    }
  };

  const getExperiment = (key: string) => {
    return experiments.value.get(key);
  };

  return {
    experiments: allExperiments,
    activeExperiments,
    refreshExperiments,
    getExperiment,
  };
};
