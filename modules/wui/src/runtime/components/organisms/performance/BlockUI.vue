<script setup lang="ts">
interface Props {
  visible?: boolean
  message?: string
  spinner?: boolean
  opacity?: number
  zIndex?: number
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  message: 'Loading...',
  spinner: true,
  opacity: 0.5,
  zIndex: 1000,
  fullScreen: false
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="block-ui">
      <div
        v-if="visible"
        class="flex items-center justify-center bg-black"
        :class="fullScreen ? 'fixed inset-0' : 'absolute inset-0'"
        :style="{
          opacity: opacity,
          zIndex: zIndex
        }"
        @click="emit('click')"
      >
        <div class="flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-xl">
          <Spinner v-if="spinner" size="lg" />
          <span class="text-sm font-medium text-gray-700">{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.block-ui-enter-active,
.block-ui-leave-active {
  transition: opacity 0.3s ease;
}

.block-ui-enter-from,
.block-ui-leave-to {
  opacity: 0;
}
</style>
