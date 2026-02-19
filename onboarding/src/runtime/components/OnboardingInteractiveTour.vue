<script setup lang="ts">
import { computed } from 'vue';

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    type: 'click' | 'hover' | 'input';
    selector?: string;
  };
}

interface Props {
  steps?: TourStep[];
  currentStepIndex?: number;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  currentStepIndex: 0,
  show: true,
});

const emit = defineEmits<{
  next: [];
  previous: [];
  skip: [];
  complete: [];
  close: [];
}>();

const currentStep = computed(() => props.steps[props.currentStepIndex]);

const isLastStep = computed(() => props.currentStepIndex === props.steps.length - 1);
const isFirstStep = computed(() => props.currentStepIndex === 0);

const handleNext = () => {
  if (isLastStep.value) {
    emit('complete');
  } else {
    emit('next');
  }
};

const handlePrevious = () => {
  if (!isFirstStep.value) {
    emit('previous');
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 pointer-events-none">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div class="absolute inset-0 pointer-events-none">
          <div
            v-if="currentStep"
            class="absolute bg-white dark:bg-gray-800 rounded-2xl shadow-2xl pointer-events-auto max-w-sm"
            :style="{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }"
          >
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {{ currentStepIndex + 1 }}
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ currentStep.title }}
                    </h3>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ currentStep.content }}
                  </p>
                </div>
                <button
                  class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ml-2"
                  @click="emit('close')"
                >
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center justify-between gap-3">
                <button
                  class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  :disabled="isFirstStep"
                  @click="handlePrevious"
                >
                  Back
                </button>

                <div class="flex gap-2">
                  <button
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    @click="emit('skip')"
                  >
                    Skip
                  </button>
                  <button
                    class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    @click="handleNext"
                  >
                    {{ isLastStep ? 'Finish' : 'Next' }}
                  </button>
                </div>
              </div>

              <div class="flex gap-1 mt-4">
                <div
                  v-for="(step, index) in steps"
                  :key="step.id"
                  class="h-1 flex-1 rounded-full transition-all"
                  :class="{
                    'bg-blue-500': index <= currentStepIndex,
                    'bg-gray-300 dark:bg-gray-600': index > currentStepIndex,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
