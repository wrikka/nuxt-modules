// useFlowBuilder Composable
// Core logic for the Login Flow Builder

import { ref, computed } from 'vue'
import type { FlowStep, AvailableStep, FlowTemplate } from '../types/flow'
import { FLOW_STEP_TYPES, DEFAULT_TEMPLATES } from '../types/flow'

export function useFlowBuilder() {
  const flowSteps = ref<FlowStep[]>([
    {
      id: '1',
      type: 'sso',
      name: 'SSO Login',
      icon: '🔐',
      required: true,
      config: { provider: 'google' },
    },
    {
      id: '2',
      type: 'mfa',
      name: 'MFA Challenge',
      icon: '📱',
      required: true,
      config: { method: 'totp' },
    },
    {
      id: '3',
      type: 'redirect',
      name: 'Redirect to Dashboard',
      icon: '➡️',
      required: true,
      config: { url: '/dashboard' },
    },
  ])

  const selectedStepIndex = ref<number | null>(null)

  const selectedStep = computed<FlowStep | null>(() => {
    if (selectedStepIndex.value === null) return null
    return flowSteps.value[selectedStepIndex.value] ?? null
  })

  const availableSteps: AvailableStep[] = Object.entries(FLOW_STEP_TYPES).map(
    ([type, config]) => ({
      type,
      ...config,
    })
  )

  const dragStart = (event: DragEvent, step: AvailableStep) => {
    event.dataTransfer?.setData('step', JSON.stringify(step))
  }

  const dropStep = (event: DragEvent) => {
    const stepData = event.dataTransfer?.getData('step')
    if (stepData) {
      const step: AvailableStep = JSON.parse(stepData)
      flowSteps.value.push({
        id: Date.now().toString(),
        type: step.type,
        name: step.name,
        icon: step.icon,
        required: true,
        config: { ...step.defaultConfig },
      })
    }
  }

  const selectStep = (index: number) => {
    selectedStepIndex.value = index
  }

  const removeStep = (index: number) => {
    flowSteps.value.splice(index, 1)
    if (selectedStepIndex.value === index) {
      selectedStepIndex.value = null
    }
  }

  const loadTemplate = (template: string) => {
    flowSteps.value = DEFAULT_TEMPLATES[template] || []
  }

  const getDefaultSteps = (): FlowStep[] => [
    {
      id: '1',
      type: 'sso',
      name: 'SSO Login',
      icon: '🔐',
      required: true,
      config: { provider: 'google' },
    },
    {
      id: '2',
      type: 'mfa',
      name: 'MFA Challenge',
      icon: '📱',
      required: true,
      config: { method: 'totp' },
    },
    {
      id: '3',
      type: 'redirect',
      name: 'Redirect to Dashboard',
      icon: '➡️',
      required: true,
      config: { url: '/dashboard' },
    },
  ]

  return {
    flowSteps,
    selectedStepIndex,
    selectedStep,
    availableSteps,
    dragStart,
    dropStep,
    selectStep,
    removeStep,
    loadTemplate,
    getDefaultSteps,
  }
}
