<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-700">กำลังดำเนินการ...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>()
</script>
