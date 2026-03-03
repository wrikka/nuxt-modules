<script setup lang="ts">
import type { ProjectHistory } from "#shared/types/project";

const props = defineProps<{
	history: ProjectHistory[];
	loading?: boolean;
	error?: string | null;
}>();

const emit = defineEmits<{
	restore: [historyId: string];
	delete: [historyId: string];
	createSnapshot: [];
	cancel: [];
}>();

const handleRestore = (historyId: string) => {
	emit("restore", historyId);
};

const handleDelete = (historyId: string) => {
	emit("delete", historyId);
};

const handleCreateSnapshot = () => {
	emit("createSnapshot");
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};
</script>

<template>
	<div class="project-history space-y-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Version History
			</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				View and restore previous versions of your project
			</p>
		</div>

		<div v-if="loading" class="flex items-center justify-center py-12">
			<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
		</div>

		<div
			v-else-if="error"
			class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
		>
			{{ error }}
		</div>

		<div
			v-else-if="history.length === 0"
			class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-history text-6xl" />
			<p class="mt-2 text-lg">No history found</p>
			<p class="text-sm">Start editing your project to create history</p>
		</div>

		<div v-else class="space-y-3">
			<div
				v-for="item in history"
				:key="item.id"
				class="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
			>
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
							>v{{ item.version }}</span>
							<span class="text-sm text-gray-500 dark:text-gray-400">{{
								formatDate(item.createdAt)
							}}</span>
						</div>
						<p
							v-if="item.description"
							class="mt-2 text-sm text-gray-700 dark:text-gray-300"
						>
							{{ item.description }}
						</p>
						<p
							v-if="item.createdBy"
							class="mt-1 text-xs text-gray-500 dark:text-gray-400"
						>
							Created by {{ item.createdBy }}
						</p>
					</div>
					<div class="flex gap-2">
						<button
							@click="handleRestore(item.id)"
							:disabled="loading"
							class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
						>
							<i v-if="loading" class="i-mdi-loading animate-spin mr-1" />
							Restore
						</button>
						<button
							@click="handleDelete(item.id)"
							class="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-end gap-3">
			<button
				type="button"
				@click="$emit('cancel')"
				class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				Close
			</button>
			<button
				type="button"
				@click="handleCreateSnapshot"
				:disabled="loading"
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
			>
				<i v-if="loading" class="i-mdi-loading animate-spin mr-2" />
				Create Snapshot
			</button>
		</div>
	</div>
</template>
