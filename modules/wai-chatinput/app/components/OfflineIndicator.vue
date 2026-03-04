<template>
  <div
    v-if="!isOnline || isOfflineMode"
    :class="['flex items-center gap-2 px-3 py-2 rounded-lg text-sm', isOfflineMode ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700']"
  >
    <Icon :name="isOfflineMode ? 'mdi:cloud-off' : 'mdi:wifi-off'" class="w-4 h-4" />
    <span v-if="isOfflineMode">
      โหมดออฟไลน์
      <span v-if="queuedMessages.length > 0">({{ queuedMessages.length }} ข้อความรอส่ง)</span>
    </span>
    <span v-else>ขาดการเชื่อมต่อ</span>

    <button
      v-if="!isOnline"
      @click="retryConnection"
      class="ml-2 px-2 py-0.5 bg-white/50 rounded text-xs hover:bg-white"
    >
      ลองใหม่
    </button>
  </div>
</template>

<script setup lang="ts">
import { useOfflineMode } from '../../../../wcomposables/packages/composables/src/chat/useOfflineMode'

const { isOnline, isOfflineMode, queuedMessages, setupNetworkListeners } = useOfflineMode()

const retryConnection = () => {
  // Retry connection
  window.location.reload()
}

onMounted(() => {
  setupNetworkListeners()
})

import { onMounted } from 'vue'
</script>
