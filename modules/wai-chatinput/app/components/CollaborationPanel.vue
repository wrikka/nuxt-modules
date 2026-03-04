<template>
  <div class="collaboration-panel">
    <div class="flex items-center justify-between p-3 border-b">
      <h3 class="font-medium">ผู้ใช้ที่กำลังทำงาน</h3>
      <div class="flex items-center gap-1">
        <span
          class="w-2 h-2 rounded-full"
          :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
        />
        <span class="text-xs text-gray-500">{{ isConnected ? 'Online' : 'Offline' }}</span>
      </div>
    </div>

    <div class="p-3 space-y-2">
      <div
        v-for="user in activeUsers"
        :key="user.id"
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
          :style="{ backgroundColor: user.color }"
        >
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate">{{ user.name }}</div>
          <div class="text-xs text-gray-400">
            <span v-if="user.isTyping" class="text-blue-500">กำลังพิมพ์...</span>
            <span v-else>เมื่อ {{ formatLastSeen(user.lastSeen) }}</span>
          </div>
        </div>
        <div
          v-if="user.cursorPosition"
          class="text-xs text-gray-400"
        >
          บรรทัด {{ Math.round(user.cursorPosition.y / 20) }}
        </div>
      </div>

      <div v-if="activeUsers.length === 0" class="text-center text-gray-400 py-4">
        ไม่มีผู้ใช้ออนไลน์
      </div>
    </div>

    <div v-if="isUserTyping" class="p-3 border-t bg-blue-50">
      <div class="flex items-center gap-2 text-sm text-blue-600">
        <span class="flex gap-1">
          <span class="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0s" />
          <span class="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s" />
          <span class="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s" />
        </span>
        มีคนกำลังพิมพ์...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollaboration } from '../../../../wcomposables/packages/composables/src/chat/useCollaboration'

const props = defineProps<{
  currentUserId: string
}>()

const { activeUsers, isConnected, isUserTyping } = useCollaboration(props.currentUserId)

const formatLastSeen = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`
  return `${Math.floor(minutes / 60)} ชั่วโมงที่แล้ว`
}
</script>
