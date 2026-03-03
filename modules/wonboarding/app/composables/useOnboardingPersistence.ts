import type { OnboardingConfig, OnboardingProgress, OnboardingStep } from '#onboarding/types';

export const useOnboardingPersistence = (
  steps: { value: OnboardingStep[]; },
  progress: { value: OnboardingProgress; },
  isActive: { value: boolean; },
  onboardingConfig: OnboardingConfig,
) => {
  const persistProgress = () => {
    if (!onboardingConfig.persistProgress || !import.meta.client) return;

    try {
      localStorage.setItem(
        'onboarding_progress',
        JSON.stringify({
          steps: steps.value,
          progress: progress.value,
        }),
      );
    } catch {
      // Storage not available
    }
  };

  const loadProgress = () => {
    if (!onboardingConfig.persistProgress || !import.meta.client) return;

    try {
      const stored = localStorage.getItem('onboarding_progress');
      if (stored) {
        const data = JSON.parse(stored);
        steps.value = data.steps;
        progress.value = data.progress;
        isActive.value = data.progress.started && !data.progress.completed && !data.progress.skipped;
      }
    } catch {
      // Storage not available
    }
  };

  const clearProgress = () => {
    if (!onboardingConfig.persistProgress || !import.meta.client) return;

    try {
      localStorage.removeItem('onboarding_progress');
    } catch {
      // Storage not available
    }
  };

  return {
    persistProgress,
    loadProgress,
    clearProgress,
  };
};
