<template>
  <button
    @click="toggleFocusMode"
    :class="['p-2 rounded-lg transition-colors', isFocusMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100']"
    :title="isFocusMode ? 'ออกจากโฟกัสโหมด' : 'เข้าโฟกัสโหมด'"
  >
    <Icon :name="isFocusMode ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { useFocusMode } from '../../../../wcomposables/packages/composables/src/chat/useFocusMode'

const { isFocusMode, toggleFocusMode } = useFocusMode()
</script>
