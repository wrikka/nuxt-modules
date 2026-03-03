import { useOnboarding } from './useOnboarding';
import type { OnboardingCondition } from '#onboarding/types';

export const useOnboardingConditions = () => {
  const { steps } = useOnboarding();

  const evaluateCondition = (
    condition: OnboardingCondition,
    context: Record<string, unknown>,
  ): boolean => {
    const fieldValue = context[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(condition.value as string);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      default:
        return true;
    }
  };

  const filterStepsByConditions = (
    context: Record<string, unknown>,
  ) => {
    return steps.value.filter(step => {
      if (!step.condition) return true;
      return evaluateCondition(step.condition, context);
    });
  };

  const isStepVisible = (
    stepId: string,
    context: Record<string, unknown>,
  ): boolean => {
    const step = steps.value.find(s => s.id === stepId);
    if (!step) return false;
    if (!step.condition) return true;
    return evaluateCondition(step.condition, context);
  };

  return {
    evaluateCondition,
    filterStepsByConditions,
    isStepVisible,
  };
};
