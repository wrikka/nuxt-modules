<template>
  <div class="flex items-center gap-2">
    <button
      @click="_handleRecordCall"
      :class="chatInput.isCallRecording ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'"
      class="text-white p-2 rounded-full"
      title="Toggle recording"
    >
      <Icon :name="chatInput.isCallRecording ? 'mdi:stop' : 'mdi:record'" class="w-5 h-5" />
    </button>
    <button
      @click="_handleToggleVideo"
      :class="chatInput.isVideoOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'"
      class="text-white p-2 rounded-full"
      title="Toggle video"
    >
      <Icon :name="chatInput.isVideoOn ? 'mdi:video' : 'mdi:video-off'" class="w-5 h-5" />
    </button>
    <button
      @click="_handleShareScreen"
      class="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full"
      title="Share screen"
    >
      <Icon name="mdi:monitor-share" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface ChatInput {
  isInCall: boolean
  isCallRecording: boolean
  isVideoOn: boolean
  stopCallRecording: () => void
  recordCall: () => void
  toggleVideo: () => void
  shareScreen: () => void
}

const props = defineProps<{
  chatInput: ChatInput
}>()

const _handleRecordCall = () => {
  if (props.chatInput.isCallRecording) {
    props.chatInput.stopCallRecording()
  } else {
    props.chatInput.recordCall()
  }
}

const _handleToggleVideo = () => {
  props.chatInput.toggleVideo()
}

const _handleShareScreen = () => {
  props.chatInput.shareScreen()
}
</script>
