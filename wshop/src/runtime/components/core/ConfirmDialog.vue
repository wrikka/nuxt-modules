<script setup lang="ts">
const { isRevealed, confirm, cancel, state } = useConfirmationDialog()
</script>

<template>
  <div v-if="isRevealed" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-sm">
      <h3 class="text-lg font-semibold mb-4">{{ state.title }}</h3>
      <p class="text-gray-600 mb-6" v-html="state.message"></p>
      <div class="flex justify-end space-x-2">
        <button
          @click="cancel"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {{ state.cancelText }}
        </button>
        <button
          @click="confirm"
          :class="[
            'px-4 py-2 text-white rounded-lg',
            state.isDestructive
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700',
          ]"
        >
          {{ state.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
