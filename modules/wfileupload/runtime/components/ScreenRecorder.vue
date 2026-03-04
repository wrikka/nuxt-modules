<template>
  <div class="screen-recording space-y-4">
    <!-- Preview Area -->
    <div class="relative bg-black rounded-lg overflow-hidden aspect-video">
      <video
        v-if="stream || recordedVideo"
        ref="videoRef"
        :src="recordedVideo || undefined"
        :srcObject="stream || undefined"
        autoplay
        playsinline
        muted
        class="w-full h-full object-cover"
        controls={!!recordedVideo}
      />
      <div v-else class="flex items-center justify-center h-full text-white">
        <div class="text-center">
          <Icon name="mdi:monitor-share" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>เลือกสิ่งที่ต้องการบันทึก</p>
        </div>
      </div>

      <!-- Recording Indicator -->
      <div v-if="isRecording" class="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>{{ formatDuration(recordingDuration) }}</span>
      </div>

      <!-- Recording Controls Overlay -->
      <div v-if="isRecording" class="absolute bottom-4 right-4">
        <button
          @click="stopRecording"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:stop-circle" class="w-5 h-5" />
          หยุดบันทึก
        </button>
      </div>
    </div>

    <!-- Source Selection -->
    <div v-if="!stream && !recordedVideo" class="grid grid-cols-2 gap-3">
      <button
        @click="startRecording('screen')"
        class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
      >
        <Icon name="mdi:monitor" class="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <span class="block font-medium">หน้าจอทั้งหมด</span>
        <span class="text-sm text-gray-500">บันทึกทั้งจอ</span>
      </button>
      <button
        @click="startRecording('window')"
        class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
      >
        <Icon name="mdi:window-restore" class="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <span class="block font-medium">หน้าต่าง</span>
        <span class="text-sm text-gray-500">เลือกหน้าต่างที่ต้องการ</span>
      </button>
      <button
        @click="startRecording('tab')"
        class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
      >
        <Icon name="mdi:tab" class="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <span class="block font-medium">แท็บเบราว์เซอร์</span>
        <span class="text-sm text-gray-500">บันทึกเฉพาะแท็บ</span>
      </button>
      <button
        @click="startRecording('camera')"
        class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
      >
        <Icon name="mdi:video" class="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <span class="block font-medium">กล้อง + หน้าจอ</span>
        <span class="text-sm text-gray-500">Picture-in-picture</span>
      </button>
    </div>

    <!-- Quality Settings -->
    <div v-if="!stream && !recordedVideo" class="space-y-2">
      <label class="block text-sm font-medium">คุณภาพวิดีโอ</label>
      <select v-model="quality" class="w-full px-3 py-2 border rounded-lg">
        <option value="low">ต่ำ (720p)</option>
        <option value="medium">กลาง (1080p)</option>
        <option value="high">สูง (1440p)</option>
        <option value="ultra">สูงสุด (4K)</option>
      </select>
    </div>

    <!-- Audio Toggle -->
    <div v-if="!stream && !recordedVideo" class="flex items-center gap-2">
      <input
        id="record-audio"
        v-model="recordAudio"
        type="checkbox"
        class="w-4 h-4 rounded border-gray-300"
      />
      <label for="record-audio" class="text-sm">บันทึกเสียงพร้อมวิดีโอ</label>
    </div>

    <!-- Recorded Actions -->
    <div v-if="recordedVideo" class="flex items-center justify-center gap-3">
      <button
        @click="retake"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
      >
        <Icon name="mdi:refresh" class="w-5 h-5" />
        บันทึกใหม่
      </button>
      <button
        @click="download"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Icon name="mdi:download" class="w-5 h-5" />
        ดาวน์โหลด
      </button>
      <button
        @click="useRecording"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
      >
        <Icon name="mdi:check" class="w-5 h-5" />
        ใช้วิดีโอนี้
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500 text-sm text-center">
      {{ error }}
    </div>

    <!-- Info -->
    <div class="text-xs text-gray-500 text-center">
      กด Esc เพื่อหยุดการบันทึกอย่างรวดเร็ว
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'

type RecordingSource = 'screen' | 'window' | 'tab' | 'camera'
type Quality = 'low' | 'medium' | 'high' | 'ultra'

const emit = defineEmits<{
  capture: [file: File]
}>()

const stream = ref<MediaStream | null>(null)
const videoRef = ref<HTMLVideoElement>()
const recordedVideo = ref<string>()
const isRecording = ref(false)
const recordingDuration = ref(0)
const quality = ref<Quality>('medium')
const recordAudio = ref(true)
const error = ref('')

let mediaRecorder: MediaRecorder | null = null
let recordingInterval: ReturnType<typeof setInterval> | null = null
let recordedChunks: Blob[] = []

const qualitySettings: Record<Quality, { width: number; height: number; bitrate: number }> = {
  low: { width: 1280, height: 720, bitrate: 2500000 },
  medium: { width: 1920, height: 1080, bitrate: 5000000 },
  high: { width: 2560, height: 1440, bitrate: 8000000 },
  ultra: { width: 3840, height: 2160, bitrate: 12000000 }
}

const startRecording = async (source: RecordingSource) => {
  try {
    error.value = ''
    const settings = qualitySettings[quality.value]

    let displayStream: MediaStream
    let cameraStream: MediaStream | null = null

    if (source === 'camera') {
      // Get both screen and camera for picture-in-picture
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: settings.width },
          height: { ideal: settings.height },
          frameRate: { ideal: 30 }
        },
        audio: recordAudio.value
      })

      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false
        })
      } catch {
        // Camera not available, continue without it
      }
    } else {
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: settings.width },
          height: { ideal: settings.height },
          frameRate: { ideal: 30 },
          displaySurface: source === 'tab' ? 'browser' : source
        },
        audio: recordAudio.value
      })
    }

    // Combine streams if camera is available
    if (cameraStream) {
      const combinedTracks = [
        ...displayStream.getTracks(),
        ...cameraStream.getTracks()
      ]
      stream.value = new MediaStream(combinedTracks)
    } else {
      stream.value = displayStream
    }

    // Handle stream ending (user stops sharing)
    displayStream.getVideoTracks()[0].onended = () => {
      stopRecording()
    }

    // Start recording
    setupMediaRecorder()
  } catch (err) {
    if ((err as Error).name !== 'NotAllowedError') {
      error.value = 'ไม่สามารถเริ่มการบันทึกได้'
      console.error('Recording error:', err)
    }
  }
}

const setupMediaRecorder = () => {
  if (!stream.value) return

  const settings = qualitySettings[quality.value]

  const options: MediaRecorderOptions = {
    mimeType: 'video/webm;codecs=vp9,opus',
    videoBitsPerSecond: settings.bitrate
  }

  // Fallback to VP8 if VP9 not supported
  if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
    options.mimeType = 'video/webm;codecs=vp8,opus'
  }

  // Final fallback
  if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
    options.mimeType = 'video/webm'
  }

  mediaRecorder = new MediaRecorder(stream.value, options)
  recordedChunks = []

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    recordedVideo.value = URL.createObjectURL(blob)
    stopStream()
  }

  mediaRecorder.start(100)
  isRecording.value = true
  recordingDuration.value = 0

  recordingInterval = setInterval(() => {
    recordingDuration.value++
  }, 1000)
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
  isRecording.value = false
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
}

const stopStream = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

const retake = () => {
  if (recordedVideo.value) {
    URL.revokeObjectURL(recordedVideo.value)
    recordedVideo.value = undefined
  }
  recordedChunks = []
}

const download = () => {
  if (!recordedVideo.value) return

  const a = document.createElement('a')
  a.href = recordedVideo.value
  a.download = `screen-recording-${Date.now()}.webm`
  a.click()
}

const useRecording = () => {
  if (recordedChunks.length === 0) return

  const blob = new Blob(recordedChunks, { type: 'video/webm' })
  const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'video/webm' })
  emit('capture', file)
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Keyboard shortcut
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isRecording.value) {
    stopRecording()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopRecording()
  stopStream()
  if (recordedVideo.value) {
    URL.revokeObjectURL(recordedVideo.value)
  }
  document.removeEventListener('keydown', handleKeydown)
})
</script>
