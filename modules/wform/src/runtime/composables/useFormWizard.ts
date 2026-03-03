import { computed, ref } from 'vue';
import type { FormValues, UseFormWizardOptions, UseFormWizardReturn, WizardStep } from '../types';

export function useFormWizard<T extends FormValues = FormValues>(
  options: UseFormWizardOptions<T>,
): UseFormWizardReturn<T> {
  const {
    steps,
    initialStep = 0,
    validateStep,
    onStepChange,
    onComplete,
    linear = true,
  } = options;

  const currentStepIndex = ref(initialStep);
  const visitedSteps = ref(new Set<number>([initialStep]));
  const stepHistory = ref<number[]>([initialStep]);

  const currentStep = computed<WizardStep<T>>(() => steps[currentStepIndex.value]);
  const totalSteps = computed(() => steps.length);
  const isFirstStep = computed(() => currentStepIndex.value === 0);
  const isLastStep = computed(() => currentStepIndex.value === steps.length - 1);
  const progress = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100);

  const canGoNext = computed(() => {
    if (isLastStep.value) return false;
    if (linear) {
      return visitedSteps.value.has(currentStepIndex.value + 1) ||
             !validateStep ||
             validateStep(currentStepIndex.value);
    }
    return true;
  });

  const canGoPrevious = computed(() => !isFirstStep.value);

  const goToStep = async (index: number): Promise<boolean> => {
    if (index < 0 || index >= steps.length) return false;
    if (linear && index > currentStepIndex.value + 1) return false;

    if (validateStep && index > currentStepIndex.value) {
      const isValid = await Promise.resolve(validateStep(currentStepIndex.value));
      if (!isValid) return false;
    }

    onStepChange?.(currentStepIndex.value, index);
    currentStepIndex.value = index;
    visitedSteps.value.add(index);
    stepHistory.value.push(index);
    return true;
  };

  const nextStep = async (): Promise<boolean> => {
    if (isLastStep.value) {
      if (validateStep) {
        const isValid = await Promise.resolve(validateStep(currentStepIndex.value));
        if (!isValid) return false;
      }
      onComplete?.();
      return true;
    }
    return goToStep(currentStepIndex.value + 1);
  };

  const previousStep = async (): Promise<boolean> => {
    return goToStep(currentStepIndex.value - 1);
  };

  const goBack = async (): Promise<boolean> => {
    if (stepHistory.value.length <= 1) return false;
    stepHistory.value.pop();
    const previousIndex = stepHistory.value[stepHistory.value.length - 1];
    if (previousIndex !== undefined) {
      currentStepIndex.value = previousIndex;
      onStepChange?.(currentStepIndex.value, previousIndex);
      return true;
    }
    return false;
  };

  const reset = (step: number = initialStep): void => {
    currentStepIndex.value = step;
    visitedSteps.value = new Set([step]);
    stepHistory.value = [step];
  };

  const getStepStatus = (index: number): 'pending' | 'current' | 'completed' | 'error' => {
    if (index === currentStepIndex.value) return 'current';
    if (visitedSteps.value.has(index)) return 'completed';
    return 'pending';
  };

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    canGoNext,
    canGoPrevious,
    visitedSteps,
    stepHistory,
    goToStep,
    nextStep,
    previousStep,
    goBack,
    reset,
    getStepStatus,
  };
}
