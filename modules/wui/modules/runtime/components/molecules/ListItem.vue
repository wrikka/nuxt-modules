<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  icon?: string
  active?: boolean
  disabled?: boolean
  clickable?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  disabled: false,
  active: false,
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const _classes = computed(() => [
  'flex items-center gap-3 p-4 transition-colors',
  _props.clickable && 'cursor-pointer hover:bg-accent',
  _props.active && 'bg-accent',
  _props.disabled && 'opacity-50 cursor-not-allowed'
])

const _handleClick = () => {
  if (_props.disabled) return
  emit('click')
}
</script>

<template>
  <li :class="[_classes, _props.class]" @click="_handleClick">
    <div v-if="icon || $slots.icon" class="shrink-0">
      <slot name="icon">
        <span :class="[icon, 'h-5 w-5 text-muted-foreground']" />
      </slot>
    </div>
    
    <div class="min-w-0 flex-1">
      <div v-if="title || $slots.title" class="font-medium">
        <slot name="title">{{ title }}</slot>
      </div>
      <p v-if="description || $slots.description" class="text-sm text-muted-foreground">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    
    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </li>
</template>
