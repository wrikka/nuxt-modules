<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step {
  id: string
  title: string
  description?: string
  icon?: string
  validate?: () => boolean | Promise<boolean>
}

interface Props {
  steps: Step[]
  modelValue: number
  linear?: boolean
  showSteps?: boolean
  finishText?: string
}

const props = withDefaults(defineProps<Props>(), {
  linear: true,
  showSteps: true,
  finishText: 'Finish'
})

const emit = defineEmits<{
  'update:modelValue': [step: number]
  'finish': []
  'cancel': []
}>()

const currentStep = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isFirst = computed(() => currentStep.value === 0)
const isLast = computed(() => currentStep.value === props.steps.length - 1)
const canGoNext = ref(true)

const goNext = async () => {
  const step = props.steps[currentStep.value]
  if (step.validate) {
    const valid = await step.validate()
    if (!valid) return
  }
  
  if (isLast.value) {
    emit('finish')
  } else {
    currentStep.value++
  }
}

const goBack = () => {
  if (!isFirst.value) currentStep.value--
}

const goToStep = (index: number) => {
  if (props.linear && index > currentStep.value) return
  currentStep.value = index
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <div v-if="showSteps" class="mb-8">
      <div class="flex items-center">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex flex-1 items-center"
          :class="{ 'flex-none': index === steps.length - 1 }"
        >
          <button
            type="button"
            class="flex flex-col items-center gap-2"
            :disabled="linear && index > currentStep"
            :class="linear && index > currentStep ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
            @click="goToStep(index)"
          >
            <div
              class="flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors"
              :class="[
                index < currentStep ? 'bg-green-600 text-white' : '',
                index === currentStep ? 'bg-blue-600 text-white' : '',
                index > currentStep ? 'bg-gray-200 text-gray-600' : ''
              ]"
            >
              <span v-if="index < currentStep" class="i-lucide-check" />
              <span v-else-if="step.icon" :class="`i-lucide-${step.icon}`" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium" :class="index === currentStep ? 'text-gray-900' : 'text-gray-500'">
                {{ step.title }}
              </p>
              <p v-if="step.description" class="text-xs text-gray-400">{{ step.description }}</p>
            </div>
          </button>
          
          <div
            v-if="index < steps.length - 1"
            class="mx-4 h-0.5 flex-1 transition-colors"
            :class="index < currentStep ? 'bg-green-600' : 'bg-gray-200'"
          />
        </div>
      </div>
    </div>
    
    <div class="rounded-lg border border-gray-200 p-6">
      <slot :name="`step-${currentStep}`" :step="steps[currentStep]">
        <h3 class="text-lg font-semibold">{{ steps[currentStep].title }}</h3>
        <p v-if="steps[currentStep].description" class="mt-1 text-gray-600">
          {{ steps[currentStep].description }}
        </p>
      </slot>
    </div>
    
    <div class="mt-6 flex justify-between">
      <Button
        variant="outline"
        :disabled="isFirst"
        @click="goBack"
      >
        <span class="i-lucide-arrow-left mr-2" />
        Back
      </Button>
      
      <div class="flex gap-2">
        <Button variant="ghost" @click="$emit('cancel')">
          Cancel
        </Button>
        <Button @click="goNext">
          {{ isLast ? finishText : 'Next' }}
          <span v-if="!isLast" class="i-lucide-arrow-right ml-2" />
        </Button>
      </div>
    </div>
  </div>
</template>
