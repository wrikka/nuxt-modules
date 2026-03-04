<script setup lang="ts">
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()

const variantClasses = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-success-50 text-success-800 border-success-200',
  warning: 'bg-warning-50 text-warning-800 border-warning-200',
  error: 'bg-error-50 text-error-800 border-error-200'
}

const iconClasses = {
  info: 'text-blue-400',
  success: 'text-success-400',
  warning: 'text-warning-400',
  error: 'text-error-400'
}
</script>

<template>
  <div
    class="rounded-lg border p-4"
    :class="variantClasses[variant]"
    role="alert"
    aria-live="polite"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <svg
          v-if="variant === 'info'"
          class="h-5 w-5"
          :class="iconClasses[variant]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
        </svg>
        <svg
          v-else-if="variant === 'success'"
          class="h-5 w-5"
          :class="iconClasses[variant]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
        <svg
          v-else-if="variant === 'warning'"
          class="h-5 w-5"
          :class="iconClasses[variant]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <svg
          v-else
          class="h-5 w-5"
          :class="iconClasses[variant]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium">
          {{ title }}
        </h3>
        <div class="text-sm" :class="title ? 'mt-2' : ''">
          <slot />
        </div>
      </div>
      <button
        v-if="dismissible"
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="variant === 'error' ? 'focus:ring-error-500' : 'focus:ring-primary-500'"
        aria-label="Dismiss"
        @click="emit('dismiss')"
      >
        <span class="sr-only">Dismiss</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  </div>
</template>
