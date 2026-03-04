<script setup lang="ts">
export interface Version {
	id: string;
	name: string;
	timestamp: number;
	author: string;
	thumbnail?: string;
	changes: string[];
}

const props = defineProps<{
	versions: Version[];
	currentVersionId: string | null;
}>();

const emit = defineEmits<{
	(e: "restore", versionId: string): void;
	(e: "preview", versionId: string): void;
	(e: "rename", versionId: string, name: string): void;
	(e: "delete", versionId: string): void;
	(e: "createVersion"): void;
}>();

const formatDate = (timestamp: number): string => {
	const date = new Date(timestamp);
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const getTimeAgo = (timestamp: number): string => {
	const now = Date.now();
	const diff = now - timestamp;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 30) return `${days}d ago`;
	return formatDate(timestamp);
};

const editingVersion = ref<string | null>(null);
const editName = ref("");

const startEdit = (version: Version) => {
	editingVersion.value = version.id;
	editName.value = version.name;
};

const saveEdit = (versionId: string) => {
	emit("rename", versionId, editName.value);
	editingVersion.value = null;
};

const cancelEdit = () => {
	editingVersion.value = null;
	editName.value = "";
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Version History
			</h3>
			<button
				type="button"
				class="p-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1 text-xs"
				@click="$emit('createVersion')"
			>
				<svg
					class="w-3 h-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Save Version
			</button>
		</div>

		<div
			v-if="versions.length === 0"
			class="text-center py-6 text-sm text-gray-500 dark:text-gray-400"
		>
			<svg
				class="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600"
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
			<p>No versions saved yet</p>
			<p class="text-xs mt-1">Save a version to track changes</p>
		</div>

		<div v-else class="space-y-2 max-h-64 overflow-y-auto">
			<div
				v-for="(version, index) in versions"
				:key="version.id"
				class="group relative p-3 rounded-lg border transition-all"
				:class="currentVersionId === version.id
				? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
				: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
			>
				<div
					class="absolute left-0 top-0 bottom-0 w-0.5"
					:class="index === 0 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'"
				/>

				<div class="flex items-start gap-3">
					<div class="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
						<svg
							v-if="version.thumbnail"
							class="w-6 h-6 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span v-else class="text-lg">{{ index + 1 }}</span>
					</div>

					<div class="flex-1 min-w-0">
						<div
							v-if="editingVersion === version.id"
							class="flex items-center gap-1 mb-1"
						>
							<input
								v-model="editName"
								type="text"
								class="flex-1 px-1.5 py-0.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@keyup.enter="saveEdit(version.id)"
								@keyup.escape="cancelEdit"
							>
							<button
								type="button"
								class="p-1 text-green-600 hover:text-green-700"
								@click="saveEdit(version.id)"
							>
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</button>
						</div>
						<div
							v-else
							class="font-medium text-sm text-gray-700 dark:text-gray-300 truncate"
						>
							{{ version.name || `Version ${index + 1}` }}
						</div>

						<div class="flex items-center gap-2 text-xs text-gray-500">
							<span>{{ getTimeAgo(version.timestamp) }}</span>
							<span>•</span>
							<span>{{ version.author }}</span>
						</div>

						<div v-if="version.changes.length > 0" class="mt-1 space-y-0.5">
							<div
								v-for="change in version.changes.slice(0, 2)"
								:key="change"
								class="text-xs text-gray-500 dark:text-gray-400"
							>
								• {{ change }}
							</div>
							<div
								v-if="version.changes.length > 2"
								class="text-xs text-gray-400"
							>
								+ {{ version.changes.length - 2 }} more
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							type="button"
							class="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
							@click="$emit('restore', version.id)"
						>
							Restore
						</button>
						<div class="flex gap-1">
							<button
								type="button"
								class="p-1 text-gray-400 hover:text-gray-600"
								title="Rename"
								@click="startEdit(version)"
							>
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
									/>
								</svg>
							</button>
							<button
								type="button"
								class="p-1 text-gray-400 hover:text-red-500"
								title="Delete"
								@click="$emit('delete', version.id)"
							>
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
