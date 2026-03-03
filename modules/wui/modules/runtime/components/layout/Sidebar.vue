<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  mobileWidth?: string
  side?: 'left' | 'right'
  bordered?: boolean
  collapsible?: boolean
  collapsed?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  width: '16rem',
  mobileWidth: '100%',
  side: 'left',
  bordered: true,
  collapsible: false,
  collapsed: false
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const _isCollapsed = computed({
  get: () => _props.collapsed,
  set: (val) => emit('update:collapsed', val)
})

const _currentWidth = computed(() => 
  _isCollapsed.value ? '4rem' : _props.width
)

const _classes = computed(() => [
  'flex flex-col h-full bg-background transition-all duration-300',
  _props.side === 'left' ? 'border-r' : 'border-l',
  _props.bordered && 'border-border'
])

const _toggleCollapse = () => {
  if (_props.collapsible) {
    _isCollapsed.value = !_isCollapsed.value
  }
}
</script>

<template>
  <aside
    :class="[_classes, _props.class]"
    :style="{ width: _currentWidth }"
  >
    <slot :collapsed="_isCollapsed" :toggle="_toggleCollapse" />
  </aside>
</template>
