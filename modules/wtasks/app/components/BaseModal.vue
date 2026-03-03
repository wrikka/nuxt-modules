<script setup lang="ts">
const emit = defineEmits(['close']);

onKeyStroke('Escape', (e) => {
  e.preventDefault();
  emit('close');
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-250 ease"
    leave-active-class="transition-opacity duration-250 ease"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" ~/click.self="emit('close')">
      <div class="w-full max-w-md rounded-lg bg-[#1a1a1c] p-6 shadow-lg border border-gray-700 transition-all duration-250 ease">
        <header class="flex items-center justify-between mb-4">
          <slot name="header" />
          <button ~/click="emit('close')" class="text-gray-400 hover:text-white">
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
        </header>
        <main>
          <slot />
        </main>
        <footer class="mt-6 flex justify-end space-x-3">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>
