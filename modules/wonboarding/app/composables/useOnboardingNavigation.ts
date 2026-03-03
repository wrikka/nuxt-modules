import { computed } from 'vue';
import type { OnboardingStep } from '#onboarding/types';

export const useOnboardingNavigation = (steps: { value: OnboardingStep[]; }, currentStepIndex: { value: number; }) => {
  const nextStep = computed(() => {
    const currentIndex = currentStepIndex.value;
    for (let i = currentIndex + 1; i < steps.value.length; i++) {
      if (!steps.value[i].completed && !steps.value[i].skipped) {
        return steps.value[i] as OnboardingStep | null;
      }
    }
    return null;
  });

  const previousStep = computed(() => {
    const currentIndex = currentStepIndex.value;
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!steps.value[i].skipped) {
        return steps.value[i] as OnboardingStep | null;
      }
    }
    return null;
  });

  return {
    nextStep,
    previousStep,
  };
};
