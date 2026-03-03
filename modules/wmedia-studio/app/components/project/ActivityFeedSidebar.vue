<script setup lang="ts">
interface Activity {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	action: string;
	entityName: string;
	entityType: string;
	createdAt: Date;
}

const props = defineProps<{
	activities: Activity[];
}>();

const formatTime = (date: Date) => {
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

const getActionIcon = (action: string) => {
	const icons: Record<string, string> = {
		created: "➕",
		updated: "✏️",
		deleted: "🗑️",
		shared: "🔗",
		exported: "📤",
		commented: "💬",
		favorited: "⭐",
	};
	return icons[action] || "📝";
};
</script>

<template>
	<div class="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
		<div class="p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Activity Feed
			</h3>
		</div>
		<div class="flex-1 overflow-auto p-4 space-y-4">
			<div
				v-for="activity in activities"
				:key="activity.id"
				class="flex gap-3"
			>
				<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm flex-shrink-0">
					{{ getActionIcon(activity.action) }}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm text-gray-900 dark:text-white">
						<span class="font-medium">{{ activity.userName }}</span>
						{{ activity.action }}
						<span class="font-medium truncate">{{ activity.entityName }}</span>
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
						{{ formatTime(activity.createdAt) }}
					</p>
				</div>
			</div>
			<div
				v-if="activities.length === 0"
				class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm"
			>
				No recent activity
			</div>
		</div>
	</div>
</template>
