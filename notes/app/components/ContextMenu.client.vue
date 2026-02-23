<script setup lang="ts">
const _props = defineProps<{ options: { label: string; action: () => void }[] }>()
const emit = defineEmits(['close'])

const menu = ref<HTMLElement | null>(null)
onClickOutside(menu, () => emit('close'))
</script>

<template>
  <div ref="menu" class="absolute z-20 bg-white dark:bg-gray-800 border rounded-md shadow-lg p-2">
    <ul>
      <li
        v-for="option in options"
        :key="option.label"
        class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md"
        @click="option.action"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
