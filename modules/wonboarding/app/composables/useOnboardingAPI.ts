import type { OnboardingProgress, OnboardingStep } from '#onboarding/types';

export const useOnboardingAPI = (isDebugEnabled: { value: boolean; }) => {
  const completeStepAPI = async (stepId: string) => {
    try {
      await $fetch('/api/onboarding/complete', {
        method: 'POST',
        body: { stepId },
      });
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Onboarding] Error completing step:', error);
      }
    }
  };

  const skipStepAPI = async (stepId: string) => {
    try {
      await $fetch('/api/onboarding/skip', {
        method: 'POST',
        body: { stepId },
      });
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Onboarding] Error skipping step:', error);
      }
    }
  };

  const fetchStatus = async () => {
    try {
      const result = await $fetch<{
        steps: OnboardingStep[];
        progress: OnboardingProgress;
      }>('/api/onboarding/status');

      return result;
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Onboarding] Error fetching status:', error);
      }
      return null;
    }
  };

  return {
    completeStepAPI,
    skipStepAPI,
    fetchStatus,
  };
};
