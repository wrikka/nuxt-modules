<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OnboardingVideo as OnboardingVideoType } from '#onboarding/types';

const props = defineProps<{
  video: OnboardingVideoType;
  autoplay?: boolean;
  showControls?: boolean;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
  ended: [];
  timeUpdate: [currentTime: number];
}>();

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(props.video.duration ?? 0);

const thumbnailUrl = computed(() => props.video.thumbnail);

const videoUrl = computed(() => {
  const url = props.video.url;
  
  if (props.video.provider === 'youtube') {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  
  if (props.video.provider === 'vimeo') {
    const videoId = extractVimeoId(url);
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  
  return url;
});

const progress = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

const isEmbed = computed(() => 
  props.video.provider === 'youtube' || props.video.provider === 'vimeo'
);
</script>

<template>
  <div class="onboarding-video">
    <!-- Thumbnail -->
    <div v-if="thumbnailUrl && !isPlaying" class="onboarding-video__thumbnail">
      <img :src="thumbnailUrl" alt="Video thumbnail" />
      <button 
        type="button"
        class="onboarding-video__play-btn"
        @click="isPlaying = true"
      >
        ▶
      </button>
    </div>

    <!-- Embed Video (YouTube/Vimeo) -->
    <iframe
      v-else-if="isEmbed && isPlaying"
      :src="`${videoUrl}?autoplay=1`"
      class="onboarding-video__iframe"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />

    <!-- Self-hosted Video -->
    <video
      v-else-if="!isEmbed"
      class="onboarding-video__player"
      :autoplay="autoplay ?? video.autoplay"
      controls
      @play="emit('play')"
      @pause="emit('pause')"
      @ended="emit('ended')"
      @timeupdate="(e: Event) => emit('timeUpdate', (e.currentTarget as HTMLVideoElement)?.currentTime ?? 0)"
    >
      <source :src="video.url" type="video/mp4" />
    </video>

    <!-- Progress bar for self-hosted -->
    <div v-if="!isEmbed && showControls !== false" class="onboarding-video__progress">
      <div class="onboarding-video__progress-bar">
        <div 
          class="onboarding-video__progress-fill"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-video {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #000;
}

.onboarding-video__thumbnail {
  position: relative;
  cursor: pointer;
}

.onboarding-video__thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}

.onboarding-video__play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: none;
  background: var(--onboarding-primary, #3b82f6);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.onboarding-video__play-btn:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.onboarding-video__iframe,
.onboarding-video__player {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
}

.onboarding-video__progress {
  padding: 0.5rem;
  background: rgb(0 0 0 / 0.5);
}

.onboarding-video__progress-bar {
  height: 0.25rem;
  background: rgb(255 255 255 / 0.3);
  border-radius: 9999px;
  overflow: hidden;
}

.onboarding-video__progress-fill {
  height: 100%;
  background: var(--onboarding-primary, #3b82f6);
  transition: width 0.1s linear;
}
</style>
