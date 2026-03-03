import type { OnboardingStepInput } from './step';

export interface OnboardingConfig {
  enabled: boolean;
  autoStart: boolean;
  persistProgress: boolean;
  steps: OnboardingStepInput[];
  skipable: boolean;
  showProgress: boolean;
  debug: boolean;
}

export interface OnboardingRuntimeConfig {
  public: {
    onboarding: OnboardingConfig;
  };
}

declare module 'nuxt/schema' {
  interface RuntimeConfig extends OnboardingRuntimeConfig {}
}
