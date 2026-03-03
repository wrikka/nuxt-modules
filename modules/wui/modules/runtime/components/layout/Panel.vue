<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
  collapsible?: boolean
  collapsed?: boolean
  bordered?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  collapsible: false,
  collapsed: false,
  bordered: true
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const _isCollapsed = computed({
  get: () => _props.collapsed,
  set: (val) => emit('update:collapsed', val)
})

const _toggle = () => {
  if (_props.collapsible) {
    _isCollapsed.value = !_isCollapsed.value
  }
}

const _classes = computed(() => [
  'rounded-lg bg-background',
  _props.bordered && 'border'
])
</script>

<template>
  <div :class="[_classes, _props.class]">
    <div
      v-if="title || $slots.header"
      :class="[
        'flex items-center justify-between px-4 py-3',
        collapsible && 'cursor-pointer',
        bordered && 'border-b'
      ]"
      @click="_toggle"
    >
      <slot name="header">
        <h3 class="font-semibold">{{ title }}</h3>
      </slot>
      <span
        v-if="collapsible"
        :class="[
          'h-4 w-4 transition-transform',
          _isCollapsed ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'
        ]"
      />
    </div>
    
    <div
      v-show="!_isCollapsed"
      class="p-4"
    >
      <slot />
    </div>
  </div>
</template>
