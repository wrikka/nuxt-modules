import { computed, ref } from 'vue';
import { useOnboarding } from './useOnboarding';
import type { OnboardingStep } from '#onboarding/types';

export const useOnboardingTimeTracking = () => {
  const { steps } = useOnboarding();

  const stepStartTime = ref<Date | null>(null);
  const totalTimeSpent = ref(0);

  const currentStepTime = computed(() => {
    if (!stepStartTime.value) return 0;
    return Date.now() - stepStartTime.value.getTime();
  });

  const startStepTimer = () => {
    stepStartTime.value = new Date();
  };

  const stopStepTimer = () => {
    if (stepStartTime.value) {
      const elapsed = Date.now() - stepStartTime.value.getTime();
      totalTimeSpent.value += elapsed;
      stepStartTime.value = null;
      return elapsed;
    }
    return 0;
  };

  const getStepTimeSpent = (stepId: string): number => {
    const step = steps.value.find((s: OnboardingStep) => s.id === stepId);
    return step?.timeSpent ?? 0;
  };

  const getAverageStepTime = (): number => {
    const completedSteps = steps.value.filter((s: OnboardingStep) => s.completed && s.timeSpent);
    if (completedSteps.length === 0) return 0;

    const totalTime = completedSteps.reduce((sum: number, s: OnboardingStep) => sum + (s.timeSpent ?? 0), 0);
    return totalTime / completedSteps.length;
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formattedTotalTime = computed(() => formatTime(totalTimeSpent.value));
  const formattedCurrentStepTime = computed(() => formatTime(currentStepTime.value));

  return {
    stepStartTime,
    totalTimeSpent,
    currentStepTime,
    formattedTotalTime,
    formattedCurrentStepTime,
    startStepTimer,
    stopStepTimer,
    getStepTimeSpent,
    getAverageStepTime,
    formatTime,
  };
};
