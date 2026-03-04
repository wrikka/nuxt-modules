<template>
  <div class="webcam-capture space-y-4">
    <!-- Preview Area -->
    <div class="relative bg-black rounded-lg overflow-hidden aspect-video">
      <video
        v-if="stream"
        ref="videoRef"
        :srcObject="stream"
        autoplay
        playsinline
        muted
        class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center h-full text-white">
        <div class="text-center">
          <Icon name="mdi:camera" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>กด "เปิดกล้อง" เพื่อเริ่มต้น</p>
        </div>
      </div>

      <!-- Recording Indicator -->
      <div v-if="isRecording" class="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>{{ formatDuration(recordingDuration) }}</span>
      </div>

      <!-- Photo Preview -->
      <img
        v-if="photoPreview && !stream"
        :src="photoPreview"
        class="w-full h-full object-contain"
        alt="Captured photo"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-3">
      <template v-if="!stream && !photoPreview && !videoBlob">
        <button
          @click="startCamera"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:camera" class="w-5 h-5" />
          เปิดกล้อง
        </button>
      </template>

      <template v-if="stream && mode === 'photo'">
        <button
          @click="capturePhoto"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:camera-iris" class="w-5 h-5" />
          ถ่ายรูป
        </button>
        <button
          @click="stopCamera"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ปิดกล้อง
        </button>
      </template>

      <template v-if="stream && mode === 'video'">
        <button
          v-if="!isRecording"
          @click="startRecording"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:record-circle" class="w-5 h-5" />
          บันทึกวิดีโอ
        </button>
        <button
          v-else
          @click="stopRecording"
          class="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:stop-circle" class="w-5 h-5" />
          หยุดบันทึก
        </button>
        <button
          @click="stopCamera"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ปิดกล้อง
        </button>
      </template>

      <template v-if="photoPreview || videoBlob">
        <button
          @click="retake"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:refresh" class="w-5 h-5" />
          ถ่ายใหม่
        </button>
        <button
          @click="confirmCapture"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Icon name="mdi:check" class="w-5 h-5" />
          ใช้รูปนี้
        </button>
      </template>
    </div>

    <!-- Mode Switcher -->
    <div v-if="!photoPreview && !videoBlob" class="flex items-center justify-center gap-2">
      <button
        @click="mode = 'photo'"
        :class="{ 'bg-blue-100 text-blue-700': mode === 'photo' }"
        class="px-3 py-1 rounded-full text-sm transition-colors"
      >
        ถ่ายรูป
      </button>
      <button
        @click="mode = 'video'"
        :class="{ 'bg-blue-100 text-blue-700': mode === 'video' }"
        class="px-3 py-1 rounded-full text-sm transition-colors"
      >
        วิดีโอ
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500 text-sm text-center">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

type CaptureMode = 'photo' | 'video'

const props = defineProps<{
  defaultMode?: CaptureMode
}>()

const emit = defineEmits<{
  capture: [file: File]
}>()

const mode = ref<CaptureMode>(props.defaultMode || 'photo')
const stream = ref<MediaStream | null>(null)
const videoRef = ref<HTMLVideoElement>()
const photoPreview = ref<string>()
const videoBlob = ref<Blob>()
const isRecording = ref(false)
const recordingDuration = ref(0)
const error = ref('')

let mediaRecorder: MediaRecorder | null = null
let recordingInterval: ReturnType<typeof setInterval> | null = null
let recordedChunks: Blob[] = []

const startCamera = async () => {
  try {
    error.value = ''
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: mode.value === 'video'
    })
  } catch (err) {
    error.value = 'ไม่สามารถเข้าถึงกล้องได้'
    console.error('Camera error:', err)
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  stopRecording()
}

const capturePhoto = () => {
  if (!videoRef.value || !stream.value) return

  const video = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Mirror the image for selfie feel
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0)

  canvas.toBlob((blob) => {
    if (blob) {
      photoPreview.value = URL.createObjectURL(blob)
      stopCamera()
    }
  }, 'image/jpeg', 0.9)
}

const startRecording = () => {
  if (!stream.value) return

  recordedChunks = []
  mediaRecorder = new MediaRecorder(stream.value, {
    mimeType: 'video/webm;codecs=vp9,opus'
  })

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }

  mediaRecorder.onstop = () => {
    videoBlob.value = new Blob(recordedChunks, { type: 'video/webm' })
    stopCamera()
  }

  mediaRecorder.start(100) // Collect data every 100ms
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

const retake = () => {
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = undefined
  }
  videoBlob.value = undefined
  startCamera()
}

const confirmCapture = () => {
  if (photoPreview.value) {
    // Convert data URL back to blob
    fetch(photoPreview.value)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
        emit('capture', file)
      })
  } else if (videoBlob.value) {
    const file = new File([videoBlob.value], `video_${Date.now()}.webm`, { type: 'video/webm' })
    emit('capture', file)
  }
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  stopCamera()
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
  }
})
</script>
