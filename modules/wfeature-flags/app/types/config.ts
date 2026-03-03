import type { FlagsmithConfig, LaunchDarklyConfig, LocalProviderConfig, UnleashConfig } from './provider';
import type { SSEConfig } from './events';

export interface FeatureFlagsConfig {
  enabled: boolean;
  providers: {
    launchdarkly?: LaunchDarklyConfig;
    flagsmith?: FlagsmithConfig;
    unleash?: UnleashConfig;
    local?: LocalProviderConfig;
  };
  defaultFlags: Record<string, boolean>;
  persistInStorage: boolean;
  debug: boolean;
  realtime?: SSEConfig;
}

export interface FeatureFlagsRuntimeConfig {
  public: {
    featureFlags: FeatureFlagsConfig;
  };
}

declare module '@nuxt/schema' {
  interface RuntimeConfig extends FeatureFlagsRuntimeConfig {}
}
