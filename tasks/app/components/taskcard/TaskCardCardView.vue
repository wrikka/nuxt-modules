<script setup lang="ts">
const props = defineProps<{ task: Task }>();

const { visibleFields } = useView();

const priorityIcon = computed(() => {
	switch (props.task.priority) {
		case 'Urgent':
			return { name: 'mdi:alert-circle', color: 'text-destructive' };
		case 'High':
			return { name: 'mdi:chevron-up', color: 'text-orange' };
		case 'Medium':
			return { name: 'mdi:equal', color: 'text-yellow' };
		case 'Low':
			return { name: 'mdi:chevron-down', color: 'text-blue' };
		default:
			return { name: 'mdi:minus', color: 'text-muted-foreground' };
	}
});

const timeAgo = useTimeAgo(new Date(props.task.updatedAt));
</script>

<template>
  <div :id="task.id" class="rounded-md bg-card p-3 shadow border border-border hover:border-primary">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Icon :name="priorityIcon.name" :class="priorityIcon.color" />
        <p class="text-sm text-card-foreground">{{ task.title }}</p>
      </div>
      <span class="text-xs text-muted-foreground">{{ task.id }}</span>
    </div>
    <div v-if="visibleFields.includes('tags') && task.tags?.length" class="flex gap-2 mb-3">
      <span v-for="tag in task.tags" :key="tag.name" class="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">{{ tag.name }}</span>
    </div>
    <div class="flex items-center justify-between text-xs text-muted-foreground">
      <div class="flex items-center gap-2">
        <span v-if="visibleFields.includes('comments') && task.comments.length" class="flex items-center gap-1"><Icon name="mdi:comment-outline" /> {{ task.comments.length }}</span>
        <span v-if="visibleFields.includes('subtasks') && task.subtasks" class="flex items-center gap-1"><Icon name="mdi:check-circle-outline" /> {{ task.subtasks }}</span>
        <span v-if="visibleFields.includes('date')" class="flex items-center gap-1"><Icon name="mdi:calendar-blank-outline" /> {{ task.date }}</span>
        <span class="flex items-center gap-1"><Icon name="mdi:update" /> {{ timeAgo }}</span>
      </div>
      <img v-if="visibleFields.includes('assignee') && task.assignee" :src="task.assignee.avatarUrl" :alt="task.assignee.name" class="w-5 h-5 rounded-full" />
    </div>
  </div>
</template>
