<template>
  <div class="voice-message-player">
    <!-- Audio Player -->
    <div class="audio-controls">
      <button
        @click="togglePlay"
        :class="['play-button', { 'is-playing': isPlaying }]"
        :disabled="isLoading"
      >
        <Icon :name="isPlaying ? 'lucide:pause' : 'lucide:play'" class="w-4 h-4" />
      </button>
      
      <div class="audio-info">
        <div class="audio-progress" @click="seekTo">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="audio-time">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>
      
      <button
        @click="deleteMessage"
        class="delete-button"
        v-if="showDelete"
      >
        <Icon name="lucide:trash-2" class="w-4 h-4" />
      </button>
    </div>

    <!-- Transcript -->
    <div v-if="transcript" class="transcript">
      <div class="transcript-header">
        <span class="transcript-label">Transcript</span>
        <button
          @click="toggleTranscript"
          class="toggle-button"
        >
          <Icon 
            :name="showTranscript ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
            class="w-4 h-4" 
          />
        </button>
      </div>
      <div v-if="showTranscript" class="transcript-content">
        {{ transcript }}
      </div>
    </div>

    <!-- Recording Indicator -->
    <div v-if="isRecording" class="recording-indicator">
      <div class="recording-dot"></div>
      <span>Recording... {{ recordingDuration }}</span>
      <button @click="stopRecording" class="stop-button">
        <Icon name="lucide:square" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVoiceMessages } from '../../composables/features'
import type { VoiceMessage } from '../../types/domain'

interface Props {
  voiceMessage: VoiceMessage
  showDelete?: boolean
  autoTranscribe?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDelete: true,
  autoTranscribe: true
})

const emit = defineEmits<{
  delete: [messageId: string]
  transcript: [messageId: string, transcript: string]
}>()

const {
  isPlaying,
  playVoiceMessage,
  transcribeVoiceMessage,
  deleteVoiceMessage
} = useVoiceMessages()

const audioRef = ref<HTMLAudioElement>()
const currentTime = ref(0)
const duration = ref(0)
const isLoading = ref(false)
const transcript = ref<string>('')
const showTranscript = ref(false)

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const isRecording = ref(false)
const recordingDuration = ref('00:00')

function togglePlay() {
  if (isPlaying.value === props.voiceMessage.id) {
    // Pause logic would be handled in the composable
    return
  }
  
  playVoiceMessage(props.voiceMessage.id)
  
  // Create audio element for progress tracking
  if (!audioRef.value) {
    audioRef.value = new Audio(URL.createObjectURL(props.voiceMessage.audioBlob))
    
    audioRef.value.addEventListener('timeupdate', () => {
      currentTime.value = audioRef.value?.currentTime || 0
    })
    
    audioRef.value.addEventListener('loadedmetadata', () => {
      duration.value = audioRef.value?.duration || 0
    })
    
    audioRef.value.addEventListener('ended', () => {
      currentTime.value = 0
    })
  }
}

function seekTo(event: MouseEvent) {
  if (!audioRef.value) return
  
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const seekTime = percentage * duration.value
  
  audioRef.value.currentTime = seekTime
  currentTime.value = seekTime
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function toggleTranscript() {
  showTranscript.value = !showTranscript.value
}

async function generateTranscript() {
  if (transcript.value || !props.autoTranscribe) return
  
  isLoading.value = true
  try {
    const result = await transcribeVoiceMessage(props.voiceMessage)
    transcript.value = result
    emit('transcript', props.voiceMessage.id, result)
  } catch (error) {
    console.error('Error generating transcript:', error)
  } finally {
    isLoading.value = false
  }
}

function deleteMessage() {
  emit('delete', props.voiceMessage.id)
  deleteVoiceMessage(props.voiceMessage.id)
}

function stopRecording() {
  isRecording.value = false
  // This would be handled by the parent component
}

onMounted(() => {
  generateTranscript()
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    URL.revokeObjectURL(audioRef.value.src)
  }
})
</script>

<style scoped>
.voice-message-player {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-3;
}

.audio-controls {
  @apply flex items-center gap-3;
}

.play-button {
  @apply w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors;
}

.play-button.is-playing {
  @apply bg-red-500 hover:bg-red-600;
}

.audio-info {
  @apply flex-1 space-y-1;
}

.audio-progress {
  @apply h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative;
}

.progress-bar {
  @apply h-full bg-blue-500 rounded-full transition-all duration-100;
}

.audio-time {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.delete-button {
  @apply w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors;
}

.transcript {
  @apply border-t border-gray-200 dark:border-gray-700 pt-3;
}

.transcript-header {
  @apply flex items-center justify-between mb-2;
}

.transcript-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.toggle-button {
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
}

.transcript-content {
  @apply text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded p-2;
}

.recording-indicator {
  @apply flex items-center gap-2 text-red-500;
}

.recording-dot {
  @apply w-2 h-2 bg-red-500 rounded-full animate-pulse;
}

.stop-button {
  @apply w-6 h-6 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors;
}
</style>
