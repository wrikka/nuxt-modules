<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  title?: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  duration: 5000,
  position: 'bottom-right'
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)
const progress = ref(100)

onMounted(() => {
  isVisible.value = true
  const interval = setInterval(() => {
    progress.value -= 100 / (props.duration / 100)
    if (progress.value <= 0) {
      clearInterval(interval)
      close()
    }
  }, 100)
})

const close = () => {
  isVisible.value = false
  setTimeout(() => emit('close'), 300)
}

const variantClasses = {
  default: 'bg-white border-secondary-200',
  success: 'bg-success-50 border-success-200',
  error: 'bg-error-50 border-error-200',
  warning: 'bg-warning-50 border-warning-200',
  info: 'bg-blue-50 border-blue-200'
}

const iconClasses = {
  default: 'text-secondary-400',
  success: 'text-success-500',
  error: 'text-error-500',
  warning: 'text-warning-500',
  info: 'text-blue-500'
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
}
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="isVisible"
      class="fixed z-50 w-full max-w-sm shadow-lg rounded-lg border pointer-events-auto"
      :class="[variantClasses[variant], positionClasses[position]]"
      role="alert"
      aria-live="polite"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              v-if="variant === 'success'"
              class="h-6 w-6"
              :class="iconClasses[variant]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else-if="variant === 'error'"
              class="h-6 w-6"
              :class="iconClasses[variant]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg
              v-else-if="variant === 'warning'"
              class="h-6 w-6"
              :class="iconClasses[variant]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              :class="iconClasses[variant]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p v-if="title" class="text-sm font-medium text-secondary-900">
              {{ title }}
            </p>
            <p class="mt-1 text-sm text-secondary-500" :class="title ? '' : 'font-medium text-secondary-900'">
              <slot />
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              @click="close"
              aria-label="Close notification"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        class="h-1 bg-primary-500 rounded-b-lg transition-all duration-100"
        :style="{ width: `${progress}%` }"
        aria-hidden="true"
      />
    </div>
  </Transition>
</template>
