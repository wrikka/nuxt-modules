<script setup lang="ts">
const props = defineProps<{
	title: string;
	activities: {
		id: string;
		user: string;
		action: string;
		target: string;
		time: string;
		avatar?: string;
	}[];
}>();
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
		<div class="p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
		</div>
		<div class="p-4 space-y-4 max-h-80 overflow-y-auto">
			<div
				v-for="activity in activities"
				:key="activity.id"
				class="flex items-start gap-3"
			>
				<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
					{{ activity.avatar || activity.user[0] }}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm text-gray-900 dark:text-white">
						<span class="font-medium">{{ activity.user }}</span>
						{{ activity.action }}
						<span class="font-medium">{{ activity.target }}</span>
					</p>
					<p class="text-xs text-gray-500 mt-0.5">{{ activity.time }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
