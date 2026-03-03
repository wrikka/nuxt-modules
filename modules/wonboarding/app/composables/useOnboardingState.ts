import { computed } from 'vue';
import { useRuntimeConfig, useState } from '#app';
import type { OnboardingConfig, OnboardingProgress, OnboardingStep, OnboardingStepInput } from '#onboarding/types';

export const useOnboardingState = () => {
  const config = useRuntimeConfig();
  const onboardingConfig = config.public.onboarding as OnboardingConfig;

  const steps = useState<OnboardingStep[]>(
    'onboarding-steps',
    () =>
      (onboardingConfig.steps ?? []).map((step: OnboardingStepInput) => ({
        ...step,
        completed: false,
        skipped: false,
        required: step.required ?? true,
      })),
  );

  const progress = useState<OnboardingProgress>('onboarding-progress', () => ({
    started: false,
    completed: false,
    skipped: false,
    currentStep: null,
    completedSteps: [],
    skippedSteps: [],
    percentage: 0,
  }));

  const isActive = useState<boolean>('onboarding-active', () => false);

  const isDebugEnabled = computed(() => onboardingConfig.debug);

  const currentStepIndex = computed(() => {
    if (!progress.value.currentStep) return 0;
    return steps.value.findIndex((s: OnboardingStep) => s.id === progress.value.currentStep);
  });

  return {
    steps,
    progress,
    isActive,
    isDebugEnabled,
    currentStepIndex,
  };
};
