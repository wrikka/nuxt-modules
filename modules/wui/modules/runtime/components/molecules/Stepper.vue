<script setup lang="ts">
import { computed } from 'vue'

interface StepItem {
  id: string
  label: string
  description?: string
  status?: 'pending' | 'active' | 'completed' | 'error'
  disabled?: boolean
}

interface Props {
  steps: StepItem[]
  currentStep?: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  size: 'md'
})

const emit = defineEmits<{
  'step-click': [step: StepItem, index: number]
}>()

const _orientationClasses = computed(() => {
  return props.orientation === 'horizontal'
    ? 'flex-row items-center justify-between'
    : 'flex-col items-start space-y-4'
})

const _sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  return sizes[props.size]
})

const stepIndex = computed(() => {
  const index = props.steps.findIndex(step => step.id === props.currentStep)
  return index >= 0 ? index : 0
})

const _onStepClick = (step: StepItem, index: number) => {
  if (!step.disabled) {
    emit('step-click', step, index)
  }
}

const _getStepStatus = (step: StepItem, index: number) => {
  if (step.status) return step.status
  if (index < stepIndex.value) return 'completed'
  if (index === stepIndex.value) return 'active'
  return 'pending'
}

const _getStatusClasses = (status: string) => {
  const classes = {
    pending: 'bg-muted text-muted-foreground',
    active: 'bg-primary text-primary-foreground',
    completed: 'bg-green-500 text-white',
    error: 'bg-destructive text-destructive-foreground'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const _getConnectorClasses = (status: string) => {
  const classes = {
    pending: 'bg-muted',
    active: 'bg-primary',
    completed: 'bg-green-500',
    error: 'bg-destructive'
  }
  return classes[status as keyof typeof classes] || classes.pending
}
</script>

<template>
  <div :class="['flex', _orientationClasses, _sizeClasses, props.class]">
    <div
      v-for="(step, index) in props.steps"
      :key="step.id"
      class="flex items-center"
      :class="props.orientation === 'vertical' ? 'w-full' : 'flex-1'"
    >
      <!-- Step indicator -->
      <div class="flex items-center">
        <button
          type="button"
          :disabled="step.disabled"
          class="flex items-center justify-center w-8 h-8 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :class="_getStatusClasses(_getStepStatus(step, index))"
          @click="_onStepClick(step, index)"
        >
          <div
            v-if="_getStepStatus(step, index) === 'completed'"
            class="i-lucide-check h-4 w-4"
          />
          <div
            v-else-if="_getStepStatus(step, index) === 'error'"
            class="i-lucide-x h-4 w-4"
          />
          <span v-else>{{ index + 1 }}</span>
        </button>
        
        <!-- Step content -->
        <div
          v-if="props.orientation === 'vertical' || index === props.steps.length - 1"
          class="ml-4"
        >
          <div class="font-medium">{{ step.label }}</div>
          <div v-if="step.description" class="text-sm text-muted-foreground">
            {{ step.description }}
          </div>
        </div>
      </div>
      
      <!-- Connector -->
      <div
        v-if="props.orientation === 'horizontal' && index < props.steps.length - 1"
        class="flex-1 h-0.5 mx-4"
        :class="_getConnectorClasses(_getStepStatus(props.steps[index + 1]!, index + 1))"
      />
      
      <div
        v-else-if="props.orientation === 'vertical' && index < props.steps.length - 1"
        class="w-0.5 h-8 ml-4"
        :class="_getConnectorClasses(_getStepStatus(props.steps[index + 1]!, index + 1))"
      />
    </div>
  </div>
</template>
