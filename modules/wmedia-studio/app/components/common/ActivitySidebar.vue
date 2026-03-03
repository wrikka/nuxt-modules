<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	activities: {
		id: string;
		user: { name: string; avatar?: string };
		action: string;
		target: string;
		timestamp: string;
		type: "create" | "update" | "delete" | "share" | "comment";
	}[];
}>();

const emit = defineEmits<{
	close: [];
	viewAll: [];
}>();

const typeIcons = {
	create: "mdi:plus-circle",
	update: "mdi:pencil",
	delete: "mdi:delete",
	share: "mdi:share",
	comment: "mdi:comment",
};

const typeColors = {
	create: "text-green-500",
	update: "text-blue-500",
	delete: "text-red-500",
	share: "text-purple-500",
	comment: "text-yellow-500",
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
	>
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<Icon name="mdi:pulse" class="w-5 h-5" />
				Recent Activity
			</h3>
			<button
				@click="emit('close')"
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div class="space-y-4">
				<div
					v-for="activity in activities"
					:key="activity.id"
					class="flex gap-3"
				>
					<div class="relative">
						<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
							{{ activity.user.avatar || activity.user.name[0] }}
						</div>
						<div
							:class="[
								'absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center',
								typeColors[activity.type],
							]"
						>
							<Icon :name="typeIcons[activity.type]" class="w-3 h-3" />
						</div>
					</div>
					<div class="flex-1">
						<p class="text-sm text-gray-900 dark:text-white">
							<span class="font-medium">{{ activity.user.name }}</span>
							{{ activity.action }}
							<span class="font-medium">{{ activity.target }}</span>
						</p>
						<p class="text-xs text-gray-500 mt-0.5">{{ activity.timestamp }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<button
				@click="emit('viewAll')"
				class="w-full py-2 text-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
			>
				View All Activity
			</button>
		</div>
	</div>
</template>
