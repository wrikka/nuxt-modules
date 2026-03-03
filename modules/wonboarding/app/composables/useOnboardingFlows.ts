import { computed, ref } from 'vue';
import { useOnboarding } from './useOnboarding';
import type { OnboardingFlow, OnboardingStep } from '#onboarding/types';

export const useOnboardingFlows = () => {
  const { steps } = useOnboarding();

  const currentFlowId = ref<string | null>(null);
  const availableFlows = ref<OnboardingFlow[]>([]);

  const flows = computed(() => {
    const flowMap = new Map<string, OnboardingFlow>();

    for (const step of steps.value) {
      if (step.flowId && !flowMap.has(step.flowId)) {
        flowMap.set(step.flowId, {
          id: step.flowId,
          name: step.flowId,
          active: true,
        });
      }
    }

    return Array.from(flowMap.values());
  });

  const currentFlow = computed(() => {
    if (!currentFlowId.value) return null;
    return flows.value.find((f: OnboardingFlow) => f.id === currentFlowId.value) ?? null;
  });

  const currentFlowSteps = computed(() => {
    if (!currentFlowId.value) {
      return steps.value.filter((s: OnboardingStep) => !s.flowId);
    }
    return steps.value.filter((s: OnboardingStep) => s.flowId === currentFlowId.value);
  });

  const selectFlow = (flowId: string) => {
    const flow = flows.value.find((f: OnboardingFlow) => f.id === flowId);
    if (flow) {
      currentFlowId.value = flowId;
    }
  };

  const clearFlow = () => {
    currentFlowId.value = null;
  };

  const getFlowById = (flowId: string) => {
    return flows.value.find((f: OnboardingFlow) => f.id === flowId);
  };

  const getStepsByFlow = (flowId: string) => {
    return steps.value.filter((s: OnboardingStep) => s.flowId === flowId);
  };

  return {
    flows,
    currentFlowId,
    currentFlow,
    currentFlowSteps,
    availableFlows,
    selectFlow,
    clearFlow,
    getFlowById,
    getStepsByFlow,
  };
};
