<script setup lang="ts">
const props = defineProps<{
	title: string;
	items: {
		id: string;
		name: string;
		status: "pending" | "completed" | "in-progress";
		dueDate?: string;
	}[];
}>();

const emit = defineEmits<{
	toggle: [itemId: string];
}>();

const statusIcons = {
	pending: "mdi:circle",
	"in-progress": "mdi:loading",
	completed: "mdi:check-circle",
};

const statusColors = {
	pending: "text-gray-400",
	"in-progress": "text-yellow-500",
	completed: "text-green-500",
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
		<div class="p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
		</div>
		<div class="divide-y divide-gray-200 dark:divide-gray-700">
			<div
				v-for="item in items"
				:key="item.id"
				class="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
			>
				<Icon
					:name="statusIcons[item.status]"
					:class="[statusColors[item.status], 'w-5 h-5']"
				/>
				<span
					:class="[
						'flex-1',
						item.status === 'completed' && 'line-through text-gray-400',
					]"
				>{{ item.name }}</span>
				<span v-if="item.dueDate" class="text-xs text-gray-500">{{
					item.dueDate
				}}</span>
			</div>
		</div>
	</div>
</template>
