<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="relative max-w-4xl max-h-[90vh]">
      <img
        :src="image"
        alt="Review image"
        class="max-w-full max-h-full object-contain"
      />
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
      >
        <NuxtIcon name="i-mdi-close" class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  image: string
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
