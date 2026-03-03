<script setup lang="ts">
defineProps<{
	title: string;
	tasks: Task[];
}>();
</script>

<template>
  <div>
    <div class="mb-4">
      <h3 class="font-semibold text-muted-foreground">{{ title }} <span class="text-xs">{{ tasks.length }}</span></h3>
    </div>
    <ul class="space-y-2">
      <li v-for="task in tasks" :key="task.id">
        <TaskCard :task="task" view="list" />
      </li>
    </ul>
  </div>
</template>
