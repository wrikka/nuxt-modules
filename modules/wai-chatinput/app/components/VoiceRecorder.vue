<template>
  <div class="voice-recorder">
    <div
      v-if="!isRecording"
      @click="startRecording"
      class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
    >
      <Icon name="mdi:microphone" class="w-5 h-5 text-gray-600" />
      <span class="text-sm">บันทึกเสียง</span>
    </div>

    <div
      v-else
      class="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span class="text-sm text-red-600 font-medium">{{ formatDuration(duration) }}</span>
      </div>

      <div class="flex-1 h-8 flex items-center gap-0.5">
        <div
          v-for="i in 20"
          :key="i"
          class="w-1 bg-red-400 rounded-full transition-all duration-100"
          :style="{ height: `${Math.random() * 100}%` }"
        />
      </div>

      <button
        @click="stopRecording"
        class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        <Icon name="mdi:stop" class="w-4 h-4" />
      </button>

      <button
        @click="cancelRecording"
        class="p-2 hover:bg-red-100 rounded-lg text-red-500"
      >
        <Icon name="mdi:close" class="w-4 h-4" />
      </button>
    </div>

    <div v-if="voiceMessages.length > 0" class="mt-2 space-y-2">
      <div
        v-for="msg in voiceMessages.slice(-3)"
        :key="msg.id"
        class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
      >
        <button
          @click="playVoice(msg)"
          class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <Icon :name="isPlaying(msg.id) ? 'mdi:pause' : 'mdi:play'" class="w-4 h-4" />
        </button>

        <div class="flex-1">
          <div class="flex items-center gap-1 h-8">
            <div
              v-for="(amp, i) in msg.waveform?.slice(0, 30) || []"
              :key="i"
              class="w-1 bg-blue-400 rounded-full"
              :style="{ height: `${amp}%` }"
            />
          </div>
          <div class="text-xs text-gray-400">{{ formatDuration(msg.duration) }}</div>
        </div>

        <button
          @click="deleteVoiceMessage(msg.id)"
          class="p-1 hover:bg-red-100 rounded text-red-500"
        >
          <Icon name="mdi:delete" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVoiceMessage } from '../../../../wcomposables/packages/composables/src/chat/useVoiceMessage'
import type { VoiceMessage } from '../../../../wcomposables/packages/composables/src/chat/useVoiceMessage'

const { isRecording, duration, voiceMessages, startVoiceRecording, stopVoiceRecording, cancelVoiceRecording, playVoiceMessage, deleteVoiceMessage } = useVoiceMessage()

const currentlyPlaying = ref<string | null>(null)

const startRecording = async () => {
  await startVoiceRecording()
}

const stopRecording = async () => {
  stopVoiceRecording()
  // Auto send after recording
  await new Promise(resolve => setTimeout(resolve, 100))
}

const playVoice = async (msg: VoiceMessage) => {
  if (currentlyPlaying.value === msg.id) {
    currentlyPlaying.value = null
  } else {
    await playVoiceMessage(msg)
    currentlyPlaying.value = msg.id
  }
}

const isPlaying = (id: string) => currentlyPlaying.value === id

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>
