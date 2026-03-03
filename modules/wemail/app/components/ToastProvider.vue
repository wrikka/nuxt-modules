<script setup lang="ts">
const { toasts: _toasts, remove: _remove } = useToast()

const _getColorClass = (color: 'green' | 'red') => {
  const _colors: Record<'green' | 'red', string> = {
    green: 'bg-green-500',
    red: 'bg-red-500',
  };
  return _colors[color] || 'bg-gray-500';
};
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in _toasts"
      :key="toast.id"
      class="flex items-center justify-between rounded-lg p-4 text-white shadow-lg"
      :class="_getColorClass(toast.color)"
    >
      <span>{{ toast.title }}</span>
      <button @click="_remove(toast.id)" class="ml-4 p-1 rounded-full hover:bg-white/20">
        <Icon name="mdi:close" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
