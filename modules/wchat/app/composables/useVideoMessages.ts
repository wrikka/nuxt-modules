import type { VideoMessage, RecordingState } from '../types'

// Group Video Messages - 60s video messages
export const useVideoMessages = () => {
  const config = useRuntimeConfig()
  const isRecording = ref(false)
  const recordingState = ref<RecordingState>({
    startTime: null,
    duration: 0,
    isPaused: false
  })
  const recordedBlob = ref<Blob | null>(null)
  const previewUrl = ref<string>('')
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const recordedChunks = ref<Blob[]>([])
  const stream = ref<MediaStream | null>(null)
  const maxDuration = 60 // seconds

  // Start recording
  const startRecording = async (facingMode: 'user' | 'environment' = 'user'): Promise<void> => {
    if (!config.public.wchat?.enableVideoMessages) return

    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      })

      mediaRecorder.value = new MediaRecorder(stream.value)
      recordedChunks.value = []

      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.value.push(e.data)
        }
      }

      mediaRecorder.value.onstop = () => {
        recordedBlob.value = new Blob(recordedChunks.value, { type: 'video/webm' })
        previewUrl.value = URL.createObjectURL(recordedBlob.value)
      }

      mediaRecorder.value.start(1000) // Collect 1 second chunks
      isRecording.value = true
      recordingState.value = {
        startTime: Date.now(),
        duration: 0,
        isPaused: false
      }

      // Auto stop at max duration
      const checkDuration = () => {
        if (!isRecording.value || !recordingState.value.startTime) return

        const elapsed = Math.floor((Date.now() - recordingState.value.startTime) / 1000)
        recordingState.value.duration = elapsed

        if (elapsed >= maxDuration) {
          stopRecording()
        } else {
          requestAnimationFrame(checkDuration)
        }
      }
      requestAnimationFrame(checkDuration)

    } catch {
      // Handle error
    }
  }

  // Pause/Resume recording
  const togglePause = (): void => {
    if (!mediaRecorder.value) return

    if (recordingState.value.isPaused) {
      mediaRecorder.value.resume()
      recordingState.value.isPaused = false
      // Adjust start time for duration calculation
      recordingState.value.startTime = Date.now() - (recordingState.value.duration * 1000)
    } else {
      mediaRecorder.value.pause()
      recordingState.value.isPaused = true
    }
  }

  // Stop recording
  const stopRecording = (): void => {
    if (!mediaRecorder.value) return

    mediaRecorder.value.stop()
    stream.value?.getTracks().forEach(track => track.stop())
    isRecording.value = false
  }

  // Cancel recording
  const cancelRecording = (): void => {
    stopRecording()
    recordedBlob.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
  }

  // Upload video message
  const uploadVideoMessage = async (chatId: string): Promise<VideoMessage | null> => {
    if (!recordedBlob.value || !config.public.wchat?.enableVideoMessages) return null

    const formData = new FormData()
    formData.append('video', recordedBlob.value, 'video-message.webm')
    formData.append('chatId', chatId)
    formData.append('duration', recordingState.value.duration.toString())

    const message = await $fetch<VideoMessage>('/api/chat/messages/video', {
      method: 'POST',
      body: formData
    })

    // Clear after upload
    cancelRecording()

    return message
  }

  // Send video message (quick send)
  const sendVideoMessage = async (chatId: string, blob: Blob, duration: number): Promise<VideoMessage | null> => {
    const formData = new FormData()
    formData.append('video', blob, 'video-message.webm')
    formData.append('chatId', chatId)
    formData.append('duration', duration.toString())

    return await $fetch<VideoMessage>('/api/chat/messages/video', {
      method: 'POST',
      body: formData
    })
  }

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get remaining time
  const remainingTime = computed(() => {
    return maxDuration - recordingState.value.duration
  })

  return {
    isRecording: readonly(isRecording),
    recordingState: readonly(recordingState),
    recordedBlob: readonly(recordedBlob),
    previewUrl: readonly(previewUrl),
    maxDuration,
    remainingTime,
    startRecording,
    togglePause,
    stopRecording,
    cancelRecording,
    uploadVideoMessage,
    sendVideoMessage,
    formatDuration
  }
}

// Video message player
export const useVideoMessagePlayer = () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const isMuted = ref(false)
  const videoRef = ref<HTMLVideoElement | null>(null)

  const play = (): void => {
    videoRef.value?.play()
    isPlaying.value = true
  }

  const pause = (): void => {
    videoRef.value?.pause()
    isPlaying.value = false
  }

  const toggle = (): void => {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  const seek = (time: number): void => {
    if (videoRef.value) {
      videoRef.value.currentTime = time
    }
  }

  const toggleMute = (): void => {
    if (videoRef.value) {
      videoRef.value.muted = !videoRef.value.muted
      isMuted.value = videoRef.value.muted
    }
  }

  return {
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    isMuted: readonly(isMuted),
    videoRef,
    play,
    pause,
    toggle,
    seek,
    toggleMute
  }
}
