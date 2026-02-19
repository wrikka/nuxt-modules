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
  <div class="flex items-center justify-between p-2 rounded hover:bg-accent">
    <div class="flex items-center">
      <Icon :name="priorityIcon.name" :class="priorityIcon.color" class="mr-2" />
      <span class="mr-2 text-muted-foreground">{{ task.id }}</span>
      <span class="text-foreground">{{ task.title }}</span>
    </div>
    <div class="flex items-center text-sm text-muted-foreground">
      <template v-if="visibleFields.includes('tags')">
        <span v-for="tag in task.tags" :key="tag.name" class="px-2 py-1 mr-4 text-xs rounded-full bg-secondary text-secondary-foreground">
          {{ tag.name }}
        </span>
      </template>
      <span v-if="visibleFields.includes('date')" class="mr-4">{{ task.date }}</span>
      <span class="mr-4">{{ timeAgo }}</span>
      <div v-if="(visibleFields.includes('comments') && task.comments.length > 0) || (visibleFields.includes('subtasks') && task.subtasks.length > 0)" class="flex items-center space-x-2 mr-4">
        <span v-if="visibleFields.includes('subtasks') && task.subtasks && task.subtasks.length > 0" class="flex items-center"><Icon name="mdi:subdirectory-arrow-right" class="mr-1" /> {{ task.subtasks.length }}</span>
        <span v-if="visibleFields.includes('comments') && task.comments.length > 0" class="flex items-center"><Icon name="mdi:comment-outline" class="mr-1" /> {{ task.comments.length }}</span>
      </div>
      <img v-if="visibleFields.includes('assignee') && task.assignee" :src="task.assignee.avatarUrl" :alt="task.assignee.name" class="w-6 h-6 rounded-full" />
    </div>
  </div>
</template>
