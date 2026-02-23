import { ref, computed } from 'vue'
import type { VoiceMessage } from '../../types/domain'

export function useVoiceMessages() {
  const isRecording = ref(false)
  const recordingTime = ref(0)
  const voiceMessages = ref<VoiceMessage[]>([])
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioChunks = ref<Blob[]>([])

  const isPlaying = ref<string | null>(null)
  const audioElement = ref<HTMLAudioElement | null>(null)

  const recordingDuration = computed(() => {
    const minutes = Math.floor(recordingTime.value / 60)
    const seconds = recordingTime.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)
      audioChunks.value = []

      mediaRecorder.value.ondataavailable = (event) => {
        audioChunks.value.push(event.data)
      }

      mediaRecorder.value.onstop = () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
        const voiceMessage: VoiceMessage = {
          id: `voice_${Date.now()}`,
          audioBlob,
          duration: recordingTime.value,
          isPlaying: false
        }
        voiceMessages.value.push(voiceMessage)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.value.start()
      isRecording.value = true
      recordingTime.value = 0

      // Start timer
      const timer = setInterval(() => {
        recordingTime.value++
        if (!isRecording.value) {
          clearInterval(timer)
        }
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      throw new Error('ไม่สามารถเริ่มบันทึกเสียงได้')
    }
  }

  function stopRecording() {
    if (mediaRecorder.value && isRecording.value) {
      mediaRecorder.value.stop()
      isRecording.value = false
    }
  }

  async function transcribeVoiceMessage(voiceMessage: VoiceMessage): Promise<string> {
    try {
      // ส่งไปยัง speech-to-text API
      const formData = new FormData()
      formData.append('audio', voiceMessage.audioBlob, 'voice.wav')

      const response = await $fetch<{ transcript: string }>('/api/speech-to-text', {
        method: 'POST',
        body: formData
      })

      return response.transcript
    } catch (error) {
      console.error('Error transcribing voice message:', error)
      throw new Error('ไม่สามารถแปลงเสียงเป็นข้อความได้')
    }
  }

  function playVoiceMessage(messageId: string) {
    const message = voiceMessages.value.find(m => m.id === messageId)
    if (!message) return

    // Stop current playing audio
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value = null
    }

    if (isPlaying.value === messageId) {
      isPlaying.value = null
      return
    }

    // Create new audio element
    audioElement.value = new Audio(URL.createObjectURL(message.audioBlob))
    audioElement.value.onended = () => {
      isPlaying.value = null
    }

    audioElement.value.play()
    isPlaying.value = messageId

    // Update message state
    message.isPlaying = true
  }

  function deleteVoiceMessage(messageId: string) {
    const index = voiceMessages.value.findIndex(m => m.id === messageId)
    if (index !== -1) {
      voiceMessages.value.splice(index, 1)
    }
  }

  return {
    // State
    isRecording,
    recordingTime,
    recordingDuration,
    voiceMessages,
    isPlaying,

    // Actions
    startRecording,
    stopRecording,
    transcribeVoiceMessage,
    playVoiceMessage,
    deleteVoiceMessage
  }
}
