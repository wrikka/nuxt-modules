<template>
  <div class="analytics-panel bg-white rounded-lg shadow-lg">
    <div class="flex items-center justify-between p-4 border-b">
      <h3 class="font-medium flex items-center gap-2">
        <Icon name="mdi:chart-bar" class="w-5 h-5" />
        สถิติการใช้งาน
      </h3>
      <button @click="showDetails = !showDetails" class="text-sm text-blue-500 hover:underline">
        {{ showDetails ? 'ซ่อน' : 'ดูเพิ่มเติม' }}
      </button>
    </div>

    <div class="p-4 grid grid-cols-2 gap-4">
      <div class="text-center p-3 bg-blue-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ analytics?.totalMessages || 0 }}</div>
        <div class="text-xs text-gray-500">ข้อความทั้งหมด</div>
      </div>
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ analytics?.conversationsStarted || 0 }}</div>
        <div class="text-xs text-gray-500">สนทนา</div>
      </div>
      <div class="text-center p-3 bg-purple-50 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">{{ analytics?.averageMessageLength || 0 }}</div>
        <div class="text-xs text-gray-500">ตัวอักษร/ข้อความ</div>
      </div>
      <div class="text-center p-3 bg-orange-50 rounded-lg">
        <div class="text-2xl font-bold text-orange-600">{{ streak }}</div>
        <div class="text-xs text-gray-500">วันต่อเนื่อง</div>
      </div>
    </div>

    <div v-if="showDetails" class="border-t p-4 space-y-4">
      <div v-if="analytics?.weeklyActivity">
        <h4 class="text-sm font-medium mb-2">กิจกรรมรายวัน</h4>
        <div class="flex items-end gap-2 h-24">
          <div
            v-for="day in analytics.weeklyActivity"
            :key="day.day"
            class="flex-1 flex flex-col items-center gap-1"
          >
            <div
              class="w-full bg-blue-500 rounded-t transition-all"
              :style="{ height: `${Math.max(5, (day.messages / maxWeeklyMessages) * 100)}%` }"
            />
            <span class="text-xs text-gray-500">{{ day.day.slice(0, 3) }}</span>
          </div>
        </div>
      </div>

      <div v-if="analytics?.topKeywords?.length">
        <h4 class="text-sm font-medium mb-2">คำที่ใช้บ่อย</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="kw in analytics.topKeywords.slice(0, 10)"
            :key="kw.word"
            class="px-2 py-1 bg-gray-100 rounded-full text-xs"
          >
            {{ kw.word }} ({{ kw.count }})
          </span>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          @click="exportData('json')"
          class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          <Icon name="mdi:download" class="w-4 h-4" />
          JSON
        </button>
        <button
          @click="exportData('csv')"
          class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          <Icon name="mdi:download" class="w-4 h-4" />
          CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessageAnalytics } from '../../../../wcomposables/packages/composables/src/chat/useMessageAnalytics'
import type { ChatMessage } from '../../../../wcomposables/packages/composables/src/types/chat'

const props = defineProps<{
  messages: ChatMessage[]
  conversations: any[]
}>()

const { analyticsData: analytics, calculateAnalytics, exportAnalytics, getStreak } = useMessageAnalytics()
const showDetails = ref(false)

const maxWeeklyMessages = computed(() => {
  if (!analytics.value?.weeklyActivity) return 1
  return Math.max(...analytics.value.weeklyActivity.map(d => d.messages), 1)
})

const streak = computed(() => getStreak(props.messages))

const exportData = (format: 'json' | 'csv') => {
  const data = exportAnalytics(format)
  const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  calculateAnalytics(props.messages, props.conversations)
})

import { onMounted } from 'vue'
</script>
