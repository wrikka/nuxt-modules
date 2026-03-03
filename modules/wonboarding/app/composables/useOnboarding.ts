import { useRuntimeConfig } from '#app';
import type { OnboardingConfig, OnboardingStep } from '#onboarding/types';
import { useOnboardingState } from './useOnboardingState';
import { useOnboardingNavigation } from './useOnboardingNavigation';
import { useOnboardingPersistence } from './useOnboardingPersistence';
import { useOnboardingAPI } from './useOnboardingAPI';

export const useOnboarding = () => {
  const config = useRuntimeConfig();
  const onboardingConfig = config.public.onboarding as OnboardingConfig;

  const { steps, progress, isActive, isDebugEnabled, currentStepIndex } = useOnboardingState();
  const { nextStep, previousStep } = useOnboardingNavigation(steps, currentStepIndex);
  const { persistProgress, loadProgress, clearProgress } = useOnboardingPersistence(
    steps,
    progress,
    isActive,
    onboardingConfig,
  );
  const { completeStepAPI, skipStepAPI, fetchStatus } = useOnboardingAPI(isDebugEnabled);

  const start = () => {
    if (progress.value.started) return;

    progress.value.started = true;
    progress.value.startedAt = new Date();
    progress.value.currentStep = steps.value[0]?.id ?? null;
    isActive.value = true;

    persistProgress();
  };

  const completeStep = async (stepId: string) => {
    const step = steps.value.find((s: OnboardingStep) => s.id === stepId);
    if (!step) return;

    step.completed = true;
    step.completedAt = new Date();

    progress.value.completedSteps.push(stepId);

    const totalSteps = steps.value.filter((s: OnboardingStep) => s.required).length;
    const completedRequired = steps.value.filter((s: OnboardingStep) => s.required && s.completed).length;
    progress.value.percentage = Math.round((completedRequired / totalSteps) * 100);

    const next = nextStep.value;
    if (next) {
      progress.value.currentStep = next.id;
    } else {
      progress.value.completed = true;
      progress.value.completedAt = new Date();
      isActive.value = false;
    }

    persistProgress();

    await completeStepAPI(stepId);
  };

  const skipStep = async (stepId: string) => {
    if (!onboardingConfig.skipable) return;

    const step = steps.value.find((s: OnboardingStep) => s.id === stepId);
    if (!step || step.required) return;

    step.skipped = true;
    step.skippedAt = new Date();

    progress.value.skippedSteps.push(stepId);

    const next = nextStep.value;
    if (next) {
      progress.value.currentStep = next.id;
    }

    persistProgress();

    await skipStepAPI(stepId);
  };

  const skipAll = async () => {
    if (!onboardingConfig.skipable) return;

    for (const step of steps.value) {
      if (!step.completed && !step.required) {
        step.skipped = true;
        progress.value.skippedSteps.push(step.id);
      }
    }

    progress.value.skipped = true;
    progress.value.skippedAt = new Date();
    isActive.value = false;

    persistProgress();
  };

  const goToStep = (stepId: string) => {
    const step = steps.value.find((s: OnboardingStep) => s.id === stepId);
    if (step) {
      progress.value.currentStep = stepId;
      isActive.value = true;
    }
  };

  const reset = () => {
    for (const step of steps.value) {
      step.completed = false;
      step.skipped = false;
      step.completedAt = undefined;
    }

    progress.value = {
      started: false,
      completed: false,
      skipped: false,
      currentStep: null,
      completedSteps: [],
      skippedSteps: [],
      percentage: 0,
    };

    isActive.value = false;

    clearProgress();
  };

  return {
    steps,
    progress,
    isActive,
    currentStepIndex,
    nextStep,
    previousStep,
    start,
    completeStep,
    skipStep,
    skipAll,
    goToStep,
    reset,
    loadProgress,
    fetchStatus,
  };
};
