<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: string
  dismissible?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Warning',
  message: 'Please be careful with this action.',
  icon: 'i-lucide-alert-triangle',
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-700',
      _props.class
    ]"
    role="alert"
  >
    <span :class="[icon, 'h-5 w-5 shrink-0 mt-0.5']" />
    
    <div class="flex-1">
      <h3 class="font-semibold">{{ title }}</h3>
      <p class="mt-1 text-sm opacity-90">
        <slot>{{ message }}</slot>
      </p>
    </div>
    
    <button
      v-if="dismissible"
      class="-mr-1 -mt-1 p-1 hover:bg-yellow-500/20 rounded"
      @click="$emit('dismiss')"
    >
      <span class="i-lucide-x h-4 w-4" />
    </button>
  </div>
</template>
