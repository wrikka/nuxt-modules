// useFlowPreview Composable
// Preview functionality for the Login Flow Builder

import { ref, computed } from 'vue'
import type { FlowStep } from '../types/flow'

export function useFlowPreview(flowSteps: Ref<FlowStep[]>) {
  const showPreview = ref(false)
  const previewStep = ref(0)

  const isPreviewActive = computed(() => showPreview.value)
  const currentPreviewStep = computed(() => previewStep.value)
  const totalPreviewSteps = computed(() => flowSteps.value.length)
  const hasMoreSteps = computed(() => previewStep.value < flowSteps.value.length)

  const previewFlow = () => {
    showPreview.value = true
    previewStep.value = 0
  }

  const nextPreviewStep = () => {
    previewStep.value++
  }

  const resetPreview = () => {
    previewStep.value = 0
  }

  const closePreview = () => {
    showPreview.value = false
    previewStep.value = 0
  }

  const getCurrentStep = (): FlowStep | undefined => {
    return flowSteps.value[previewStep.value]
  }

  return {
    showPreview,
    previewStep,
    isPreviewActive,
    currentPreviewStep,
    totalPreviewSteps,
    hasMoreSteps,
    previewFlow,
    nextPreviewStep,
    resetPreview,
    closePreview,
    getCurrentStep,
  }
}
