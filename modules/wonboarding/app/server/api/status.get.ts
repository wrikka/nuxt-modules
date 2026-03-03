import { defineEventHandler } from 'h3';
import type { OnboardingServerState } from '../state';

declare global {
  var onboardingState: OnboardingServerState;
}

if (!globalThis.onboardingState) {
  globalThis.onboardingState = {
    steps: [],
    progress: {
      started: false,
      completed: false,
      skipped: false,
      currentStep: null,
      completedSteps: [],
      skippedSteps: [],
      percentage: 0,
    },
  };
}

export default defineEventHandler(() => {
  return globalThis.onboardingState;
});
