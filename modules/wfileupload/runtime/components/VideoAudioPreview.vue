<template>
  <div class="video-audio-preview space-y-4">
    <!-- Video Preview -->
    <div v-if="isVideo" class="space-y-2">
      <div class="relative bg-black rounded-lg overflow-hidden">
        <video
          ref="videoRef"
          :src="objectUrl"
          controls
          class="w-full max-h-[400px]"
          preload="metadata"
        />
      </div>

      <!-- Video Info -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="bg-gray-50 p-3 rounded">
          <span class="text-gray-500">ความละเอียด</span>
          <p class="font-medium">{{ videoWidth }}x{{ videoHeight }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded">
          <span class="text-gray-500">ระยะเวลา</span>
          <p class="font-medium">{{ formatDuration(videoDuration) }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded">
          <span class="text-gray-500">เฟรมเรต</span>
          <p class="font-medium">{{ videoFrameRate ? videoFrameRate.toFixed(2) : '-' }} fps</p>
        </div>
        <div class="bg-gray-50 p-3 rounded">
          <span class="text-gray-500">ขนาดไฟล์</span>
          <p class="font-medium">{{ formatFileSize(props.file.size) }}</p>
        </div>
      </div>

      <!-- Video Thumbnail Selection -->
      <div class="space-y-2">
        <label class="text-sm font-medium">เลือกภาพตัวอย่าง</label>
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="(thumb, index) in videoThumbnails"
            :key="index"
            @click="selectThumbnail(thumb)"
            :class="{ 'ring-2 ring-blue-500': selectedThumbnail === thumb }"
            class="flex-shrink-0 w-24 h-16 rounded overflow-hidden"
          >
            <img :src="thumb" class="w-full h-full object-cover" />
          </button>
          <button
            @click="generateMoreThumbnails"
            class="flex-shrink-0 w-24 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500"
          >
            <Icon name="mdi:refresh" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Audio Preview -->
    <div v-if="isAudio" class="space-y-4">
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Icon name="mdi:music" class="w-8 h-8" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-lg truncate">{{ props.file.name }}</p>
            <p class="text-white/80">{{ formatFileSize(props.file.size) }}</p>
          </div>
        </div>

        <audio
          ref="audioRef"
          :src="objectUrl"
          controls
          class="w-full mt-4"
        />
      </div>

      <!-- Audio Info -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="bg-gray-50 p-3 rounded">
          <span class="text-gray-500">ระยะเวลา</span>
          <p class="font-medium">{{ formatDuration(audioDuration) }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded">
          <span class="text-gray-500">บิตเรต</span>
          <p class="font-medium">{{ audioBitrate ? (audioBitrate / 1000).toFixed(0) : '-' }} kbps</p>
        </div>
      </div>

      <!-- Audio Waveform Visualization -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <canvas
          ref="waveformRef"
          class="w-full h-24"
        />
        <p class="text-xs text-gray-500 text-center mt-2">Waveform visualization</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        @click="trimMedia"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="mdi:content-cut" class="w-5 h-5" />
        ตัดคลิป
      </button>
      <button
        @click="extractFrame"
        v-if="isVideo"
        class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="mdi:image" class="w-5 h-5" />
        แยกเฟรม
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  file: File
}>()

const emit = defineEmits<{
  thumbnail: [imageFile: File]
  frame: [imageFile: File]
  trim: [start: number, end: number]
}>()

const videoRef = ref<HTMLVideoElement>()
const audioRef = ref<HTMLAudioElement>()
const waveformRef = ref<HTMLCanvasElement>()
const objectUrl = ref('')

const videoWidth = ref(0)
const videoHeight = ref(0)
const videoDuration = ref(0)
const videoFrameRate = ref(0)
const audioDuration = ref(0)
const audioBitrate = ref(0)

const videoThumbnails = ref<string[]>([])
const selectedThumbnail = ref<string>()

const isVideo = computed(() => props.file.type.startsWith('video/'))
const isAudio = computed(() => props.file.type.startsWith('audio/'))

onMounted(() => {
  objectUrl.value = URL.createObjectURL(props.file)

  if (isVideo.value) {
    loadVideoMetadata()
  } else if (isAudio.value) {
    loadAudioMetadata()
  }
})

onUnmounted(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
  }
  videoThumbnails.value.forEach(url => URL.revokeObjectURL(url))
})

const loadVideoMetadata = () => {
  const video = document.createElement('video')
  video.preload = 'metadata'

  video.onloadedmetadata = () => {
    videoWidth.value = video.videoWidth
    videoHeight.value = video.videoHeight
    videoDuration.value = video.duration

    // Estimate frame rate from common formats or default to 30
    videoFrameRate.value = 30

    generateThumbnails(video)
  }

  video.src = objectUrl.value
}

const loadAudioMetadata = () => {
  const audio = document.createElement('audio')
  audio.preload = 'metadata'

  audio.onloadedmetadata = () => {
    audioDuration.value = audio.duration
    // Estimate bitrate from file size and duration
    if (audio.duration > 0) {
      audioBitrate.value = (props.file.size * 8) / audio.duration
    }
    drawWaveform()
  }

  audio.src = objectUrl.value
}

const generateThumbnails = async (video: HTMLVideoElement) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 160
  canvas.height = 90

  const duration = video.duration
  const count = 5
  const thumbnails: string[] = []

  for (let i = 0; i < count; i++) {
    const time = (duration * (i + 1)) / (count + 1)
    video.currentTime = time

    await new Promise<void>(resolve => {
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        thumbnails.push(dataUrl)
        resolve()
      }
    })
  }

  videoThumbnails.value = thumbnails
  selectedThumbnail.value = thumbnails[0]
}

const generateMoreThumbnails = () => {
  // Regenerate with different positions
  if (videoRef.value) {
    videoThumbnails.value.forEach(url => URL.revokeObjectURL(url))
    generateThumbnails(videoRef.value)
  }
}

const selectThumbnail = (thumb: string) => {
  selectedThumbnail.value = thumb
}

const drawWaveform = () => {
  if (!waveformRef.value) return

  const canvas = waveformRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size
  canvas.width = canvas.offsetWidth * 2
  canvas.height = canvas.offsetHeight * 2

  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw simulated waveform (actual waveform generation requires AudioContext)
  ctx.fillStyle = '#8b5cf6'

  const bars = 50
  const barWidth = width / bars

  for (let i = 0; i < bars; i++) {
    const barHeight = Math.random() * height * 0.8 + height * 0.1
    const x = i * barWidth
    const y = (height - barHeight) / 2

    ctx.fillRect(x, y, barWidth - 2, barHeight)
  }
}

const trimMedia = () => {
  // Open trim dialog
  const startTime = 0
  const endTime = isVideo.value ? videoDuration.value : audioDuration.value
  emit('trim', startTime, endTime)
}

const extractFrame = () => {
  if (!videoRef.value || !selectedThumbnail.value) return

  fetch(selectedThumbnail.value)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], `frame_${Date.now()}.jpg`, { type: 'image/jpeg' })
      emit('frame', file)
    })
}

const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '--:--'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i]
}
</script>
