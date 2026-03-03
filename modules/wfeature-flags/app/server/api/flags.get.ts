import { defineEventHandler, useRuntimeConfig } from 'h3';

export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const defaultFlags: Record<string, boolean> = config.public.featureFlags?.defaultFlags ?? {};
  const localProviderFlags: Record<string, unknown> = config.public.featureFlags?.providers?.local?.flags ?? {};

  // Return default flags for now
  // In production, this would fetch from the configured provider
  const flags: Record<string, boolean> = { ...defaultFlags };

  // Merge with local provider flags if configured
  if (localProviderFlags) {
    for (const [key, value] of Object.entries(localProviderFlags)) {
      if (typeof value === 'boolean') {
        flags[key] = value;
      } else if (typeof value === 'object' && value !== null && 'enabled' in value) {
        flags[key] = (value as { enabled: boolean; }).enabled;
      }
    }
  }

  return flags;
});
