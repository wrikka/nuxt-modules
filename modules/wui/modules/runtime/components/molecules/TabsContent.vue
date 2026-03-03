<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  value: string
  class?: string
}

const _props = defineProps<Props>()

const tabs = inject('tabs') as {
  activeTab: { value: string }
  orientation: 'horizontal' | 'vertical'
}

const _isActive = computed(() => tabs.activeTab.value === _props.value)
</script>

<template>
  <div
    v-if="_isActive"
    :class="['mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', _props.class]"
  >
    <slot />
  </div>
</template>
