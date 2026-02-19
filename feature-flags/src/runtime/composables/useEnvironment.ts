import { computed, useRuntimeConfig, useState } from '#imports';
import type { Environment } from '#feature-flags/types';

export const useEnvironment = () => {
  const config = useRuntimeConfig();
  const flagsConfig = config.public.featureFlags;

  const currentEnvironment = useState<string>(
    'feature-flags-environment',
    () => flagsConfig.environment?.current ?? 'default',
  );

  const environments = useState<Map<string, Environment>>(
    'feature-flags-environments',
    () => {
      const map = new Map<string, Environment>();
      const envs = flagsConfig.environment?.environments ?? [];

      for (const env of envs) {
        map.set(env.key, env);
      }

      return map;
    },
  );

  const current = computed(() => environments.value.get(currentEnvironment.value));

  const allEnvironments = computed(() => Array.from(environments.value.values()));

  const isProduction = computed(() => ['production', 'prod'].includes(currentEnvironment.value.toLowerCase()));

  const isDevelopment = computed(() =>
    ['development', 'dev', 'local'].includes(currentEnvironment.value.toLowerCase())
  );

  const isStaging = computed(() => ['staging', 'stage', 'test'].includes(currentEnvironment.value.toLowerCase()));

  const switchEnvironment = async (key: string) => {
    if (!environments.value.has(key)) {
      throw new Error(`Environment "${key}" not found`);
    }

    const previous = currentEnvironment.value;
    currentEnvironment.value = key;

    // Persist to storage
    if (flagsConfig.persistInStorage && import.meta.client) {
      try {
        localStorage.setItem('ff_environment', key);
      } catch {
        // Storage not available
      }
    }

    // Refresh flags for new environment
    const { refreshFlags } = useFeatureFlags();
    await refreshFlags();

    return { previous, current: key };
  };

  const loadEnvironmentFromStorage = () => {
    if (!flagsConfig.persistInStorage || !import.meta.client) {
      return;
    }

    try {
      const stored = localStorage.getItem('ff_environment');
      if (stored && environments.value.has(stored)) {
        currentEnvironment.value = stored;
      }
    } catch {
      // Storage not available
    }
  };

  const getEnvironmentFlagPrefix = computed(() => {
    const env = current.value;
    if (!env || env.isDefault) {
      return '';
    }
    return `${env.key}_`;
  });

  const getEnvironmentKey = (flagKey: string): string => {
    return `${getEnvironmentFlagPrefix.value}${flagKey}`;
  };

  const addEnvironment = (env: Environment) => {
    environments.value.set(env.key, env);
  };

  const removeEnvironment = (key: string) => {
    if (currentEnvironment.value === key) {
      throw new Error('Cannot remove current environment');
    }
    environments.value.delete(key);
  };

  return {
    currentEnvironment,
    current,
    allEnvironments,
    isProduction,
    isDevelopment,
    isStaging,
    switchEnvironment,
    loadEnvironmentFromStorage,
    getEnvironmentFlagPrefix,
    getEnvironmentKey,
    addEnvironment,
    removeEnvironment,
  };
};
