<script setup lang="ts">
interface Props {
  src?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  showWaveform?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  preload: 'metadata',
  showWaveform: false
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number]
}>()

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

const onTimeUpdate = () => {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
  emit('timeupdate', currentTime.value)
}

const onLoadedMetadata = () => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

const onEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const seek = (time: number) => {
  if (!audioRef.value) return
  audioRef.value.currentTime = time
}

defineExpose({
  play: () => audioRef.value?.play(),
  pause: () => audioRef.value?.pause(),
  seek,
  audioRef
})
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
      @click="togglePlay"
    >
      <span v-if="isPlaying" class="i-lucide-pause size-5" />
      <span v-else class="i-lucide-play size-5" />
    </button>
    
    <div v-if="showWaveform" class="h-10 flex-1 rounded bg-gray-100">
      <div class="flex h-full items-center justify-center text-gray-400">
        <span class="i-lucide-waveform size-5" />
      </div>
    </div>
    
    <div class="text-sm text-gray-600">
      {{ Math.floor(currentTime / 60) }}:{{ String(Math.floor(currentTime % 60)).padStart(2, '0') }}
      / {{ Math.floor(duration / 60) }}:{{ String(Math.floor(duration % 60)).padStart(2, '0') }}
    </div>
    
    <audio
      ref="audioRef"
      :src="src"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :preload="preload"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />
  </div>
</template>
