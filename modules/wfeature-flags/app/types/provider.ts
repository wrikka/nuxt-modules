import type { FeatureFlag, FlagEvaluationContext, FlagEvaluationResult } from './flag';

export interface FeatureFlagProvider {
  name: string;
  getFlag: (key: string) => Promise<FeatureFlag | null>;
  getAllFlags: () => Promise<FeatureFlag[]>;
  evaluate: (key: string, context?: FlagEvaluationContext) => Promise<FlagEvaluationResult>;
}

export interface LaunchDarklyConfig {
  sdkKey?: string;
  clientSideId?: string;
}

export interface FlagsmithConfig {
  environmentId?: string;
  apiHost?: string;
}

export interface UnleashConfig {
  url?: string;
  appName?: string;
}

export interface LocalProviderConfig {
  flags?: Record<string, boolean | FeatureFlag>;
}
