<script setup lang="ts">
import { useCalls } from '../../composables/useCalls'
import type { Call, CallParticipant } from '../../types'

const { activeCall, localStream, remoteStreams, endCall, toggleMute, toggleVideo, startScreenShare, stopScreenShare } = useCalls()

const isMuted = computed(() => activeCall.value?.isMuted ?? false)
const isVideoEnabled = computed(() => activeCall.value?.isVideoEnabled ?? false)
const isScreenSharing = computed(() => activeCall.value?.isScreenSharing ?? false)
const callDuration = ref(0)

// Format duration
const formattedDuration = computed(() => {
  const mins = Math.floor(callDuration.value / 60)
  const secs = callDuration.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// Timer
let timer: NodeJS.Timeout
onMounted(() => {
  timer = setInterval(() => {
    if (activeCall.value?.startedAt) {
      callDuration.value = Math.floor((Date.now() - new Date(activeCall.value.startedAt).getTime()) / 1000)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const handleEndCall = async () => {
  await endCall()
}

const handleToggleMute = async () => {
  await toggleMute()
}

const handleToggleVideo = async () => {
  await toggleVideo()
}

const handleToggleScreenShare = async () => {
  if (isScreenSharing.value) {
    await stopScreenShare()
  } else {
    await startScreenShare()
  }
}
</script>

<template>
  <MoleculesDialog :open="!!activeCall" @update:open="(v) => !v && handleEndCall()">
    <MoleculesDialogContent class="sm:max-w-4xl p-0 overflow-hidden">
      <!-- Call Header -->
      <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div class="flex items-center gap-3">
          <AtomsBadge variant="destructive" class="animate-pulse">
            <span class="i-lucide-phone w-3 h-3 mr-1" />
            {{ activeCall?.isGroup ? 'Group Call' : activeCall?.type === 'video' ? 'Video Call' : 'Voice Call' }}
          </AtomsBadge>
          <span class="text-white font-mono">{{ formattedDuration }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-white/80 text-sm">E2EE</span>
          <span class="i-lucide-lock w-4 h-4 text-green-400" />
        </div>
      </div>

      <!-- Video Grid -->
      <div class="relative bg-black aspect-video flex items-center justify-center">
        <!-- Remote video (or placeholder for voice) -->
        <div v-if="activeCall?.type === 'video' || isScreenSharing" class="absolute inset-0">
          <video
            v-if="activeCall?.type === 'video'"
            autoplay
            playsinline
            class="w-full h-full object-cover"
          />
          <!-- Screen share indicator -->
          <div v-if="isScreenSharing" class="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <span class="i-lucide-monitor w-4 h-4" />
            Sharing Screen
          </div>
        </div>

        <!-- Voice call avatar -->
        <div v-else class="flex flex-col items-center gap-4">
          <AtomsAvatar size="xl" class="w-32 h-32 text-4xl" fallback="?" />
          <AtomsText size="xl" class="text-white">In Call</AtomsText>
        </div>

        <!-- Local video preview -->
        <div
          v-if="activeCall?.type === 'video'"
          class="absolute bottom-4 right-4 w-48 aspect-video rounded-lg overflow-hidden border-2 border-white/20"
        >
          <video
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover mirror"
          />
          <div v-if="!isVideoEnabled" class="absolute inset-0 bg-black/80 flex items-center justify-center">
            <span class="i-lucide-video-off w-8 h-8 text-white/60" />
          </div>
        </div>

        <!-- Participants (for group calls) -->
        <div v-if="activeCall?.isGroup" class="absolute bottom-4 left-4 flex -space-x-2">
          <div
            v-for="participant in activeCall?.participants?.slice(0, 4)"
            :key="participant.userId"
            class="w-10 h-10 rounded-full border-2 border-black bg-surface"
          >
            <AtomsAvatar size="sm" :src="participant.avatar" :fallback="participant.username.charAt(0)" />
          </div>
          <div v-if="(activeCall?.participants?.length || 0) > 4" class="w-10 h-10 rounded-full border-2 border-black bg-surface flex items-center justify-center text-sm text-white">
            +{{ activeCall!.participants!.length - 4 }}
          </div>
        </div>
      </div>

      <!-- Call Controls -->
      <div class="p-6 bg-surface">
        <div class="flex items-center justify-center gap-4">
          <!-- Mute -->
          <AtomsButton
            :variant="isMuted ? 'destructive' : 'secondary'"
            size="icon-lg"
            class="rounded-full"
            @click="handleToggleMute"
          >
            <span :class="isMuted ? 'i-lucide-mic-off' : 'i-lucide-mic'" class="w-6 h-6" />
          </AtomsButton>

          <!-- Video toggle -->
          <AtomsButton
            v-if="activeCall?.type === 'video'"
            :variant="isVideoEnabled ? 'secondary' : 'destructive'"
            size="icon-lg"
            class="rounded-full"
            @click="handleToggleVideo"
          >
            <span :class="isVideoEnabled ? 'i-lucide-video' : 'i-lucide-video-off'" class="w-6 h-6" />
          </AtomsButton>

          <!-- Screen share -->
          <AtomsButton
            :variant="isScreenSharing ? 'primary' : 'secondary'"
            size="icon-lg"
            class="rounded-full"
            @click="handleToggleScreenShare"
          >
            <span class="i-lucide-monitor-up w-6 h-6" />
          </AtomsButton>

          <!-- End call -->
          <AtomsButton
            variant="destructive"
            size="icon-lg"
            class="rounded-full"
            @click="handleEndCall"
          >
            <span class="i-lucide-phone-off w-6 h-6" />
          </AtomsButton>
        </div>

        <!-- Info text -->
        <div class="text-center mt-4 text-sm text-muted">
          <span v-if="isMuted">Muted</span>
          <span v-if="isScreenSharing" class="ml-2">Sharing screen</span>
          <span v-if="activeCall?.isE2EE" class="ml-2 flex items-center justify-center gap-1">
            <span class="i-lucide-shield-check w-4 h-4 text-green-500" />
            End-to-end encrypted
          </span>
        </div>
      </div>
    </MoleculesDialogContent>
  </MoleculesDialog>
</template>

<style scoped>
.mirror {
  transform: scaleX(-1);
}
</style>
