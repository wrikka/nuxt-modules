<script setup lang="ts">
interface CleanupSuggestion {
	id: string;
	name: string;
	size: number;
	type: "unused" | "large" | "duplicate";
	lastAccessed: Date;
	path: string;
}

const props = defineProps<{
	suggestions: CleanupSuggestion[];
}>();

const emit = defineEmits<{
	delete: [id: string];
	deleteAll: [];
}>();

const totalPotentialSavings = computed(() =>
	props.suggestions.reduce((sum, s) => sum + s.size, 0)
);

const sortedSuggestions = computed(() =>
	[...props.suggestions].sort((a, b) => b.size - a.size)
);

function getTypeIcon(type: CleanupSuggestion["type"]): string {
	switch (type) {
		case "unused":
			return "i-mdi-clock-outline";
		case "large":
			return "i-mdi-file-chart";
		case "duplicate":
			return "i-mdi-content-copy";
		default:
			return "i-mdi-file";
	}
}

function getTypeLabel(type: CleanupSuggestion["type"]): string {
	switch (type) {
		case "unused":
			return "Unused";
		case "large":
			return "Large File";
		case "duplicate":
			return "Duplicate";
		default:
			return "Other";
	}
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-broom text-orange-500" />
				Storage Cleanup Suggestions
			</h3>
			<span
				v-if="suggestions.length"
				class="text-sm px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full"
			>
				{{ suggestions.length }} items
			</span>
		</div>

		<div
			v-if="totalPotentialSavings > 0"
			class="mb-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/20"
		>
			<div class="flex items-center justify-between">
				<div>
					<div class="text-sm text-gray-600 dark:text-gray-400">
						Potential savings
					</div>
					<div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
						{{ formatBytes(totalPotentialSavings) }}
					</div>
				</div>
				<button
					class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
					@click="emit('deleteAll')"
				>
					Delete All
				</button>
			</div>
		</div>

		<div class="space-y-2 max-h-64 overflow-y-auto">
			<div
				v-for="item in sortedSuggestions"
				:key="item.id"
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div class="flex items-center gap-3 min-w-0">
					<i :class="getTypeIcon(item.type)" class="text-gray-400" />
					<div class="min-w-0">
						<div class="font-medium text-gray-900 dark:text-white truncate">
							{{ item.name }}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400">
							{{ formatBytes(item.size) }} • {{ getTypeLabel(item.type) }}
						</div>
					</div>
				</div>
				<button
					class="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
					@click="emit('delete', item.id)"
					title="Delete item"
				>
					<i class="i-mdi-delete" />
				</button>
			</div>
		</div>

		<div
			v-if="suggestions.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-check-circle text-3xl mb-2 text-green-500" />
			<p>Great! No cleanup suggestions found.</p>
		</div>
	</div>
</template>
