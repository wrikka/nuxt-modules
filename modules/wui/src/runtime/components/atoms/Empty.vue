<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon?: string
  title?: string
  description?: string
  actionText?: string
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-inbox',
  title: 'No data',
  description: 'There are no items to display'
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div :class="['flex flex-col items-center justify-center p-8 text-center', _props.class]">
    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <span :class="[icon, 'h-10 w-10 text-muted-foreground']" />
    </div>
    
    <h3 class="mt-4 text-lg font-semibold">{{ title }}</h3>
    
    <p class="mt-1 max-w-sm text-sm text-muted-foreground">
      <slot name="description">{{ description }}</slot>
    </p>
    
    <button
      v-if="actionText"
      class="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      @click="$emit('action')"
    >
      {{ actionText }}
    </button>
    
    <slot />
  </div>
</template>
