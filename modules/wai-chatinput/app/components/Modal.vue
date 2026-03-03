<template>
  <transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="$emit('update:modelValue', false)"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <button
            @click="$emit('update:modelValue', false)"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <slot name="body"></slot>
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
