<template>
  <div class="schedule-picker bg-white border rounded-lg shadow-lg p-4 w-72">
    <h3 class="font-medium mb-4">ตั้งเวลาส่งข้อความ</h3>

    <div class="space-y-3">
      <div>
        <label class="text-sm text-gray-600 block mb-1">วันที่</label>
        <input
          v-model="selectedDate"
          type="date"
          class="w-full px-3 py-2 border rounded-lg"
          :min="minDate"
        />
      </div>

      <div>
        <label class="text-sm text-gray-600 block mb-1">เวลา</label>
        <input
          v-model="selectedTime"
          type="time"
          class="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div class="flex gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="applyPreset(preset.minutes)"
          class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          {{ preset.label }}
        </button>
      </div>

      <div v-if="scheduledTime" class="p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
        จะส่ง: {{ formatScheduledTime }}
      </div>
    </div>

    <div class="flex gap-2 mt-4">
      <button
        @click="schedule"
        :disabled="!canSchedule || isProcessing"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isProcessing ? 'กำลังตั้งเวลา...' : 'ตั้งเวลา' }}
      </button>
      <button
        @click="$emit('cancel')"
        class="px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        ยกเลิก
      </button>
    </div>

    <div v-if="upcomingMessages.length > 0" class="mt-4 border-t pt-4">
      <h4 class="text-sm font-medium mb-2">ข้อความที่รอส่ง ({{ upcomingMessages.length }})</h4>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="msg in upcomingMessages.slice(0, 3)"
          :key="msg.id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
        >
          <span class="truncate flex-1">{{ msg.content.slice(0, 30) }}...</span>
          <button
            @click="cancelMessage(msg.id)"
            class="p-1 hover:bg-red-100 rounded text-red-500"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessageScheduling } from '../../../../wcomposables/packages/composables/src/chat/useMessageScheduling'

const props = defineProps<{
  content: string
  conversationId: string
}>()

const emit = defineEmits<{
  schedule: [date: Date]
  cancel: []
}>()

const { isProcessing, scheduleMessage, cancelScheduledMessage, getScheduledMessagesForConversation } = useMessageScheduling()

const selectedDate = ref('')
const selectedTime = ref('')

const minDate = computed(() => new Date().toISOString().split('T')[0])

const scheduledTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return null
  return new Date(`${selectedDate.value}T${selectedTime.value}`)
})

const canSchedule = computed(() => {
  if (!scheduledTime.value) return false
  return scheduledTime.value > new Date()
})

const formatScheduledTime = computed(() => {
  if (!scheduledTime.value) return ''
  return scheduledTime.value.toLocaleString('th-TH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const upcomingMessages = computed(() => getScheduledMessagesForConversation(props.conversationId))

const presets = [
  { label: '+5 นาที', minutes: 5 },
  { label: '+30 นาที', minutes: 30 },
  { label: '+1 ชม.', minutes: 60 },
  { label: 'พรุ่งนี้', minutes: 24 * 60 }
]

const applyPreset = (minutes: number) => {
  const date = new Date(Date.now() + minutes * 60000)
  selectedDate.value = date.toISOString().split('T')[0]
  selectedTime.value = date.toTimeString().slice(0, 5)
}

const schedule = () => {
  if (!scheduledTime.value) return
  scheduleMessage(props.content, scheduledTime.value, props.conversationId)
  emit('schedule', scheduledTime.value)
}

const cancelMessage = (messageId: string) => {
  cancelScheduledMessage(messageId)
}
</script>
