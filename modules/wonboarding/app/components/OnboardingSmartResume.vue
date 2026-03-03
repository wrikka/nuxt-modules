<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  lastStep?: string;
  lastStepTitle?: string;
  progress?: number;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lastStep: '',
  lastStepTitle: '',
  progress: 0,
  show: true,
});

const emit = defineEmits<{
  resume: [];
  'start-fresh': [];
  close: [];
}>();

const progressColor = computed(() => {
  if (props.progress >= 75) return 'bg-green-500';
  if (props.progress >= 50) return 'bg-blue-500';
  if (props.progress >= 25) return 'bg-yellow-500';
  return 'bg-orange-500';
});
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
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Resume Onboarding
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Pick up where you left off
                  </p>
                </div>
              </div>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('close')"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mb-6">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600 dark:text-gray-400">Progress</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ progress }}%</span>
              </div>
              <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-500 rounded-full"
                  :class="progressColor"
                  :style="{ width: `${progress}%` }"
                />
              </div>
            </div>

            <div v-if="lastStep" class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Step
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ lastStepTitle }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <button
                class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                @click="emit('resume')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume
              </button>
              <button
                class="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="emit('start-fresh')"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
