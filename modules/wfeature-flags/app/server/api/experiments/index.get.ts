import { defineEventHandler, useRuntimeConfig } from 'h3';
import type { Experiment } from '#feature-flags/types';

export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const localProviderFlags: Record<string, unknown> = config.public.featureFlags?.providers?.local?.flags ?? {};

  const experiments: Experiment[] = [];

  // Load experiments from local provider
  if (localProviderFlags) {
    for (const [key, flag] of Object.entries(localProviderFlags)) {
      if (typeof flag === 'object' && flag !== null && 'variants' in flag) {
        experiments.push({
          id: `local_${key}`,
          key,
          name: key,
          enabled: (flag as { enabled?: boolean; }).enabled ?? false,
          variants: (flag as { variants?: Array<{ key: string; weight: number; payload?: unknown; }>; }).variants?.map((
            v,
            i,
          ) => ({
            id: `variant_${i}`,
            key: v.key,
            name: v.key,
            weight: v.weight,
            isControl: i === 0,
            payload: v.payload,
          })) ?? [],
        });
      }
    }
  }

  return experiments;
});
