<script setup lang="ts">
import { SortBySchema, type SortBy } from '~/shared/types/task';

const { setSortBy } = useTaskFilter();
const isSortOpen = ref(false);

const sortOptions: { label: string; value: SortBy }[] = SortBySchema.options.map(value => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
}));
</script>

<template>
  <DropdownMenu v-model="isSortOpen" trigger-class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80">
    <template #trigger>
      <Icon name="mdi:sort" />
      <span>Sort</span>
    </template>
    <template #content>
      <button
        v-for="option in sortOptions"
        :key="option.value"
        class="w-full text-left flex items-center px-3 py-1.5 hover:bg-accent rounded-md"
        ~/click="() => { setSortBy(option.value); isSortOpen = false; }"
      >
        {{ option.label }}
      </button>
    </template>
  </DropdownMenu>
</template>
