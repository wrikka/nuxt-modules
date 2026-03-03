<script setup lang="ts">
defineProps<{
	sheets: { name: string }[];
	activeSheetIndex: number;
}>();

const _emit = defineEmits<{
	(e: "addSheet"): void;
	(e: "setActiveSheet", index: number): void;
}>();
</script>

<template>
  <div class="px-2 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
    <div class="tabs flex items-center flex-1 overflow-x-auto">
      <button
        v-for="(sheet, index) in sheets"
        :key="index"
        class="border-b-2 px-4 py-2 text-sm transition-colors whitespace-nowrap"
        :class="[
          index === activeSheetIndex
            ? 'border-sky-500 text-sky-600 dark:text-sky-400'
            : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300',
        ]"
        @click="_emit('setActiveSheet', index)"
      >
        {{ sheet.name }}
      </button>
    </div>
    <ToolbarButton title="Add Sheet" @click="_emit('addSheet')">
      <Icon name="lucide:plus" size="16" />
    </ToolbarButton>
  </div>
</template>
