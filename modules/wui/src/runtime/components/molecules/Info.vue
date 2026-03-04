<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: string
  dismissible?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Info',
  message: 'Here is some information for you.',
  icon: 'i-lucide-info',
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4 text-blue-700',
      _props.class
    ]"
    role="status"
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
      class="-mr-1 -mt-1 p-1 hover:bg-blue-500/20 rounded"
      @click="$emit('dismiss')"
    >
      <span class="i-lucide-x h-4 w-4" />
    </button>
  </div>
</template>
