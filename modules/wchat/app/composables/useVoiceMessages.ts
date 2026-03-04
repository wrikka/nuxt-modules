import type { VoiceMessage, WaveformData } from '../types'

// Voice Messages 2.0 - Waveform, playback speed, skip silence
export const useVoiceMessages = () => {
  const config = useRuntimeConfig()
  const audioContext = ref<AudioContext | null>(null)
  const currentPlaying = ref<string | null>(null)
  const playbackRate = ref(1)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const waveformData = ref<Map<string, WaveformData>>(new Map())
  const skipSilenceEnabled = ref(false)
  const silenceThreshold = ref(-40) // dB

  // Generate waveform from audio file
  const generateWaveform = async (audioUrl: string): Promise<WaveformData> => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const response = await fetch(audioUrl)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.value!.decodeAudioData(arrayBuffer)

    // Generate waveform data (128 samples)
    const channelData = audioBuffer.getChannelData(0)
    const samples = 128
    const blockSize = Math.floor(channelData.length / samples)
    const peaks: number[] = []

    for (let i = 0; i < samples; i++) {
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j] || 0)
      }
      peaks.push(sum / blockSize)
    }

    // Normalize
    const max = Math.max(...peaks)
    const normalized = peaks.map(p => p / max)

    const data: WaveformData = {
      peaks: normalized,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate
    }

    waveformData.value.set(audioUrl, data)
    return data
  }

  // Detect silence segments for skip silence feature
  const detectSilenceSegments = (audioBuffer: AudioBuffer): Array<{ start: number; end: number }> => {
    const channelData = audioBuffer.getChannelData(0)
    const segments: Array<{ start: number; end: number }> = []
    const threshold = Math.pow(10, silenceThreshold.value / 20)
    let inSilence = false
    let silenceStart = 0
    const minSilenceDuration = 0.5 // seconds

    for (let i = 0; i < channelData.length; i++) {
      const isSilent = Math.abs(channelData[i]) < threshold
      const time = i / audioBuffer.sampleRate

      if (isSilent && !inSilence) {
        inSilence = true
        silenceStart = time
      } else if (!isSilent && inSilence) {
        inSilence = false
        if (time - silenceStart >= minSilenceDuration) {
          segments.push({ start: silenceStart, end: time })
        }
      }
    }

    return segments
  }

  // Play voice message
  const play = async (messageId: string, audioUrl: string, startTime = 0): Promise<void> => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    // Stop current
    if (currentPlaying.value) {
      await stop()
    }

    currentPlaying.value = messageId
    isPlaying.value = true

    try {
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.value!.decodeAudioData(arrayBuffer)

      duration.value = audioBuffer.duration

      // Create source
      const source = audioContext.value!.createBufferSource()
      source.buffer = audioBuffer
      source.playbackRate.value = playbackRate.value

      // Connect
      source.connect(audioContext.value!.destination)

      // Skip silence if enabled
      let segments = skipSilenceEnabled.value ? detectSilenceSegments(audioBuffer) : []

      // Play
      source.start(0, startTime)

      // Track time
      const startTimestamp = Date.now() - startTime * 1000
      const updateTime = () => {
        if (!isPlaying.value) return
        const elapsed = (Date.now() - startTimestamp) / 1000

        // Check if we hit a silence segment
        if (skipSilenceEnabled.value && segments.length > 0) {
          const currentSegment = segments.find(s => elapsed >= s.start && elapsed < s.end)
          if (currentSegment) {
            source.stop()
            play(messageId, audioUrl, currentSegment.end)
            return
          }
        }

        currentTime.value = Math.min(elapsed, duration.value)

        if (currentTime.value >= duration.value) {
          stop()
        } else {
          requestAnimationFrame(updateTime)
        }
      }

      requestAnimationFrame(updateTime)

    } catch {
      stop()
    }
  }

  // Stop playing
  const stop = (): void => {
    currentPlaying.value = null
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }

  // Toggle playback
  const toggle = async (messageId: string, audioUrl: string): Promise<void> => {
    if (currentPlaying.value === messageId) {
      stop()
    } else {
      await play(messageId, audioUrl)
    }
  }

  // Set playback speed
  const setPlaybackRate = (rate: number): void => {
    playbackRate.value = rate
    // Update if currently playing
    // Would need to recreate AudioBufferSourceNode with new rate
  }

  // Seek to position
  const seek = async (messageId: string, audioUrl: string, time: number): Promise<void> => {
    await play(messageId, audioUrl, time)
  }

  // Toggle skip silence
  const toggleSkipSilence = (): void => {
    skipSilenceEnabled.value = !skipSilenceEnabled.value
  }

  // Set silence threshold
  const setSilenceThreshold = (db: number): void => {
    silenceThreshold.value = db
  }

  // Record voice message
  const record = async (): Promise<Blob> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
        stream.getTracks().forEach(track => track.stop())
        resolve(blob)
      }

      mediaRecorder.onerror = reject

      mediaRecorder.start()

      // Stop recording after 2 minutes (max voice message length)
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop()
        }
      }, 120000)
    })
  }

  // Upload voice message
  const uploadVoice = async (blob: Blob, chatId: string): Promise<VoiceMessage | null> => {
    if (!config.public.wchat?.enableVoiceMessages) return null

    const formData = new FormData()
    formData.append('audio', blob, 'voice.ogg')
    formData.append('chatId', chatId)

    return await $fetch<VoiceMessage>('/api/chat/messages/voice', {
      method: 'POST',
      body: formData
    })
  }

  return {
    currentPlaying: readonly(currentPlaying),
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    playbackRate: readonly(playbackRate),
    waveformData: readonly(waveformData),
    skipSilenceEnabled: readonly(skipSilenceEnabled),
    silenceThreshold: readonly(silenceThreshold),
    play,
    stop,
    toggle,
    setPlaybackRate,
    seek,
    toggleSkipSilence,
    setSilenceThreshold,
    generateWaveform,
    record,
    uploadVoice
  }
}

// Playback speed options
export const playbackSpeedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 }
]
