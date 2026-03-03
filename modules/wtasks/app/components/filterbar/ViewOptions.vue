<script setup lang="ts">
import { GroupBySchema, FieldSchema, type GroupBy, type Field } from '~/shared/types/view';

const { currentView, setView, groupBy, setGroupBy, visibleFields, toggleField } = useView();

const isGroupByOpen = ref(false);
const isFieldsOpen = ref(false);

const groupByOptionsComputed = computed(() => {
	return GroupBySchema.options.map(o => ({ label: o.charAt(0).toUpperCase() + o.slice(1), value: o as GroupBy }));
});

const fieldOptionsComputed = computed(() => {
	return FieldSchema.options.map(o => ({ label: o.charAt(0).toUpperCase() + o.slice(1), value: o as Field }));
});
</script>

<template>
  <div class="flex items-center gap-2">
    <div v-if="currentView === 'list'" class="flex items-center gap-2">
      <span class="text-muted-foreground">Group by:</span>
      <DropdownMenu v-model="isGroupByOpen" trigger-class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80">
        <template #trigger>
          <span>{{ groupByOptionsComputed.find(o => o.value === groupBy)?.label }}</span>
          <Icon name="mdi:chevron-down" />
        </template>
        <template #content>
          <button
            v-for="option in groupByOptionsComputed"
            :key="option.value"
            class="w-full text-left flex items-center px-3 py-1.5 hover:bg-accent rounded-md"
            ~/click="() => { setGroupBy(option.value); isGroupByOpen = false; }"
          >
            {{ option.label }}
          </button>
        </template>
      </DropdownMenu>
    </div>

    <div class="flex items-center bg-secondary border border-border rounded-md p-0.5">
      <button class="p-1.5 rounded-md" :class="{ 'bg-primary text-primary-foreground': currentView === 'list' }" ~/click="setView('list')">
        <Icon name="mdi:format-list-bulleted" />
      </button>
      <button class="p-1.5 rounded-md" :class="{ 'bg-primary text-primary-foreground': currentView === 'kanban' }" ~/click="setView('kanban')">
        <Icon name="mdi:view-dashboard" />
      </button>
    </div>

    <DropdownMenu v-model="isFieldsOpen" trigger-class="p-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80">
      <template #trigger>
        <Icon name="mdi:dots-horizontal" />
      </template>
      <template #content>
        <h4 class="text-xs font-bold text-muted-foreground px-3 py-1">Visible Fields</h4>
        <label v-for="field in fieldOptionsComputed" :key="field.value" class="flex items-center px-3 py-1.5 hover:bg-accent rounded-md cursor-pointer">
          <input type="checkbox" :checked="visibleFields.includes(field.value)" ~/change="toggleField(field.value)" class="mr-2">
          {{ field.label }}
        </label>
      </template>
    </DropdownMenu>
  </div>
</template>
