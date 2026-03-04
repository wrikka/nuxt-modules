<script setup lang="ts">
interface Props {
  src?: string
  width?: number
  height?: number
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
  preload?: 'none' | 'metadata' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  preload: 'metadata'
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number]
  volumechange: [volume: number]
}>()

const videoRef = ref<HTMLVideoElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)

const togglePlay = () => {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
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
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  emit('timeupdate', currentTime.value)
}

const onLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

const onEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const onVolumeChange = () => {
  if (!videoRef.value) return
  volume.value = videoRef.value.volume
  emit('volumechange', volume.value)
}

const seek = (time: number) => {
  if (!videoRef.value) return
  videoRef.value.currentTime = time
}

const setVolume = (val: number) => {
  if (!videoRef.value) return
  videoRef.value.volume = Math.max(0, Math.min(1, val))
}

defineExpose({
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  seek,
  setVolume,
  videoRef
})
</script>

<template>
  <div class="relative rounded-lg overflow-hidden bg-black">
    <video
      ref="videoRef"
      :src="src"
      :width="width"
      :height="height"
      :autoplay="autoplay"
      :controls="controls"
      :loop="loop"
      :muted="muted"
      :poster="poster"
      :preload="preload"
      class="w-full"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @volumechange="onVolumeChange"
    />
    
    <slot
      :is-playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :toggle-play="togglePlay"
      :seek="seek"
      :set-volume="setVolume"
    />
  </div>
</template>
