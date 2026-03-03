<template>
  <main class="flex-grow p-8 overflow-y-auto">
    <draggable :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" item-key="id" class="space-y-4 min-h-[200px] bg-white p-4 rounded-md border-dashed border-2">
      <template #item="{ element, index }">
        <div @click="$emit('select-block', index)" :class="{ 'border-blue-500 border-2': selectedBlockIndex === index }" class="p-4 border rounded-md cursor-pointer">
          <strong>{{ element.type }}</strong>
          <pre class="text-xs text-gray-500">{{ element.props }}</pre>
        </div>
      </template>
    </draggable>
  </main>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import type { PageBlock } from '~~/shared/types';

defineProps<{
  modelValue: PageBlock[];
  selectedBlockIndex: number | null;
}>();

defineEmits(['update:modelValue', 'select-block']);
</script>
