<script setup lang="ts">
import type { Activity } from "#shared/types/collaboration";

defineProps<{
	activity: Activity;
}>();

const formatDate = (date: Date) => {
	const now = new Date();
	const diff = now.getTime() - new Date(date).getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return new Date(date).toLocaleDateString();
};
</script>

<template>
	<div class="activity-item flex items-start gap-3 py-3">
		<div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
			{{ activity.userName.charAt(0).toUpperCase() }}
		</div>
		<div class="flex-1 min-w-0">
			<p class="text-sm text-gray-900 dark:text-white">
				<span class="font-medium">{{ activity.userName }}</span>
				<span class="text-gray-600 dark:text-gray-400">{{
					activity.action
				}}</span>
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
				{{ activity.entityName }} · {{ formatDate(activity.createdAt) }}
			</p>
		</div>
	</div>
</template>
