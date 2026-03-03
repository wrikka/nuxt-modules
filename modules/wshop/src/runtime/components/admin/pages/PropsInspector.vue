<template>
  <aside class="w-80 bg-gray-100 p-4 overflow-y-auto">
    <h3 class="text-lg font-semibold mb-4">Properties</h3>
    <div v-if="selectedBlock">
      <div v-for="(prop, key) in selectedBlock.props" :key="key" class="mb-4">
        <label :for="`prop-${key}`" class="block text-sm font-medium text-gray-700">{{ key }}</label>
        <input v-if="typeof prop === 'string'" type="text" :id="`prop-${key}`" :value="prop" @input="$emit('update-prop', { key, value: ($event.target as HTMLInputElement).value })" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        <!-- Add more input types for numbers, booleans etc. later -->
      </div>
    </div>
    <div v-else class="text-sm text-gray-500">Select a component to see its properties.</div>
  </aside>
</template>

<script setup lang="ts">
import type { PageBlock } from '~~/shared/types';

defineProps<{
  selectedBlock: PageBlock | null;
}>();

defineEmits(['update-prop']);
</script>
