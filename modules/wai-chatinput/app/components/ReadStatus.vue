<template>
  <div class="read-status flex items-center gap-1 text-xs text-gray-400">
    <span v-if="readCount > 0" class="flex items-center gap-1">
      <Icon name="mdi:check-all" class="w-4 h-4 text-blue-500" />
      <span>อ่านแล้ว {{ readCount }} คน</span>
    </span>
    <span v-else class="flex items-center gap-1">
      <Icon name="mdi:check" class="w-4 h-4" />
      <span>ส่งแล้ว</span>
    </span>

    <div
      v-if="readCount > 0"
      class="group relative"
    >
      <button class="hover:text-gray-600">
        <Icon name="mdi:information-outline" class="w-3 h-3" />
      </button>
      <div class="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10">
        <div v-for="receipt in readReceipts" :key="receipt.userId" class="flex items-center gap-2">
          <span>{{ receipt.userName }}</span>
          <span class="text-gray-400">{{ formatReadTime(receipt.readAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReadReceipts } from '../../../../wcomposables/packages/composables/src/chat/useReadReceipts'

const props = defineProps<{
  messageId: number
  currentUserId: string
}>()

const { getReadReceipts, getReadCount, formatReadTime } = useReadReceipts(props.currentUserId)

const readReceipts = computed(() => getReadReceipts(props.messageId))
const readCount = computed(() => getReadCount(props.messageId))

import { computed } from 'vue'
</script>
