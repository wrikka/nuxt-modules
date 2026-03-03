import type { OnboardingProgress, OnboardingStep } from '#onboarding/types';

export interface OnboardingServerState {
  steps: OnboardingStep[];
  progress: OnboardingProgress;
}

declare global {
  var onboardingState: OnboardingServerState;
}
