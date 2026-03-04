<script setup lang="ts">
import type { AudioProjectVersion } from "#shared/types/audio";
import { format } from "date-fns";

const props = defineProps<{
	versions: AudioProjectVersion[];
	currentVersionId?: string;
}>();

const emit = defineEmits<{
	restore: [versionId: string];
	delete: [versionId: string];
	create: [name: string];
}>();

const newVersionName = ref("");
const showCreateForm = ref(false);

const sortedVersions = computed(() => {
	return [...props.versions].sort((a, b) => b.timestamp - a.timestamp);
});

const createVersion = () => {
	if (!newVersionName.value.trim()) return;
	emit("create", newVersionName.value);
	newVersionName.value = "";
	showCreateForm.value = false;
};

const formatTimestamp = (timestamp: number): string => {
	return format(timestamp, "MMM d, yyyy h:mm a");
};

const formatRelativeTime = (timestamp: number): string => {
	const now = Date.now();
	const diff = now - timestamp;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Version History</span>
			<button
				@click="showCreateForm = !showCreateForm"
				class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
			>
				{{ showCreateForm ? "Cancel" : "Save Version" }}
			</button>
		</div>

		<!-- Create Version Form -->
		<div v-if="showCreateForm" class="mb-4 space-y-2">
			<input
				v-model="newVersionName"
				placeholder="Version name..."
				class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
				@keyup.enter="createVersion"
			>
			<button
				@click="createVersion"
				:disabled="!newVersionName.trim()"
				class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				Save Current State
			</button>
		</div>

		<!-- Version List -->
		<div
			v-if="sortedVersions.length > 0"
			class="space-y-2 max-h-64 overflow-y-auto"
		>
			<div
				v-for="version in sortedVersions"
				:key="version.id"
				class="p-3 rounded transition-colors"
				:class="currentVersionId === version.id
				? 'bg-blue-900/30 border border-blue-700'
				: 'bg-gray-800 hover:bg-gray-700'"
			>
				<div class="flex items-start justify-between">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-300 font-medium truncate">{{
								version.name
							}}</span>
							<span
								v-if="currentVersionId === version.id"
								class="text-xs px-1.5 py-0.5 bg-blue-600 text-white rounded"
							>
								Current
							</span>
						</div>
						<div class="text-xs text-gray-500 mt-1">
							{{ formatTimestamp(version.timestamp) }}
							<span class="text-gray-600">•</span>
							{{ formatRelativeTime(version.timestamp) }}
						</div>
						<div v-if="version.changes.length > 0" class="mt-2 space-y-0.5">
							<div
								v-for="change in version.changes.slice(0, 3)"
								:key="change"
								class="text-xs text-gray-500 flex items-center gap-1"
							>
								<span class="w-1 h-1 rounded-full bg-gray-600"></span>
								{{ change }}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-1 ml-2">
						<button
							v-if="currentVersionId !== version.id"
							@click="emit('restore', version.id)"
							class="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded"
							title="Restore this version"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</button>
						<button
							@click="emit('delete', version.id)"
							class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
							title="Delete version"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Empty State -->
		<div v-else class="text-center py-8">
			<svg
				class="w-12 h-12 text-gray-700 mx-auto mb-3"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<p class="text-sm text-gray-500">No saved versions yet</p>
			<p class="text-xs text-gray-600 mt-1">
				Save versions to track your progress
			</p>
		</div>
	</div>
</template>
