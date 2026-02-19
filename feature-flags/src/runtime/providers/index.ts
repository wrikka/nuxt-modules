export { BaseProvider } from './base';
export { FlagsmithProvider } from './flagsmith';
export { LaunchDarklyProvider } from './launchdarkly';
export { LocalProvider } from './local';
export { UnleashProvider } from './unleash';

import type { FeatureFlagProvider } from '#feature-flags/types';
import type { FeatureFlagsConfig } from '#feature-flags/types';
import { LocalProvider } from './local';
import { LaunchDarklyProvider } from './launchdarkly';
import { FlagsmithProvider } from './flagsmith';
import { UnleashProvider } from './unleash';

export function createProvider(config: FeatureFlagsConfig): FeatureFlagProvider | null {
  // Priority: external providers first, then local fallback

  if (config.providers.launchdarkly?.sdkKey) {
    return new LaunchDarklyProvider(config.providers.launchdarkly);
  }

  if (config.providers.flagsmith?.environmentId) {
    return new FlagsmithProvider(config.providers.flagsmith);
  }

  if (config.providers.unleash?.url) {
    return new UnleashProvider(config.providers.unleash);
  }

  if (config.providers.local) {
    return new LocalProvider(config.providers.local);
  }

  return new LocalProvider();
}

export async function initializeProvider(
  provider: FeatureFlagProvider,
): Promise<void> {
  if ('initialize' in provider && typeof provider.initialize === 'function') {
    await (provider as { initialize: () => Promise<void>; }).initialize();
  }
}
