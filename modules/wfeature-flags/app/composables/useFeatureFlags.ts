import { computed, useState } from 'vue';
import type { FlagEvaluationContext, FlagEvaluationResult } from '#feature-flags/types';

export const useFeatureFlags = () => {
  // TODO: Get config from runtime config
  // For now, use default values
  const config = {
    public: {
      featureFlags: {
        defaultFlags: {},
        providers: {},
        debug: false,
        persistInStorage: false,
        analytics: {},
      },
    },
  };
  const flagsConfig = config.public.featureFlags
    ?? { defaultFlags: {}, providers: {}, debug: false, persistInStorage: false, analytics: {} };

  const flags = useState<Record<string, boolean>>('feature-flags', () => ({
    ...flagsConfig.defaultFlags,
  }));

  const context = useState<FlagEvaluationContext>('feature-flags-context', () => ({
    userId: undefined,
    sessionId: undefined,
    attributes: {},
  }));

  const isDebugEnabled = computed(() => flagsConfig.debug);

  const isEnabled = (key: string): boolean => {
    return flags.value[key] ?? false;
  };

  const setFlag = (key: string, value: boolean) => {
    flags.value[key] = value;

    if (flagsConfig.persistInStorage && import.meta.client) {
      try {
        localStorage.setItem(`ff_${key}`, String(value));
      } catch {
        // Storage not available
      }
    }

    if (isDebugEnabled.value) {
      console.log(`[FeatureFlags] Set flag "${key}" to ${value}`);
    }
  };

  const setFlags = (newFlags: Record<string, boolean>) => {
    for (const [key, value] of Object.entries(newFlags)) {
      setFlag(key, value);
    }
  };

  const setContext = (newContext: Partial<FlagEvaluationContext>) => {
    context.value = { ...context.value, ...newContext };

    if (isDebugEnabled.value) {
      console.log('[FeatureFlags] Updated context:', context.value);
    }
  };

  const loadFromStorage = () => {
    if (!flagsConfig.persistInStorage || !import.meta.client) {
      return;
    }

    try {
      for (const [key, defaultValue] of Object.entries(flagsConfig.defaultFlags)) {
        const stored = localStorage.getItem(`ff_${key}`);
        if (stored !== null) {
          flags.value[key] = stored === 'true';
        } else {
          flags.value[key] = defaultValue;
        }
      }
    } catch {
      // Storage not available
    }
  };

  const evaluateFlag = async (key: string): Promise<FlagEvaluationResult> => {
    try {
      const result = await $fetch<FlagEvaluationResult>('/api/feature-flags/evaluate', {
        method: 'POST',
        body: {
          flag: key,
          context: context.value,
        },
      });

      if (result.enabled !== undefined) {
        setFlag(key, result.enabled);
      }

      return result;
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error(`[FeatureFlags] Error evaluating flag "${key}":`, error);
      }

      return {
        flag: key,
        enabled: flags.value[key] ?? false,
        reason: 'ERROR',
      };
    }
  };

  const refreshFlags = async () => {
    try {
      const remoteFlags = await $fetch<Record<string, boolean>>('/api/feature-flags');
      setFlags(remoteFlags);
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[FeatureFlags] Error refreshing flags:', error);
      }
    }
  };

  const withFeature = <T>(
    key: string,
    onEnabled: () => T,
    onDisabled?: () => T,
  ): T | undefined => {
    if (isEnabled(key)) {
      return onEnabled();
    }
    return onDisabled?.();
  };

  return {
    flags,
    context,
    isEnabled,
    setFlag,
    setFlags,
    setContext,
    loadFromStorage,
    evaluateFlag,
    refreshFlags,
    withFeature,
  };
};
