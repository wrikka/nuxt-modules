<script setup lang="ts">
import type { Project } from "#shared/types";

const props = defineProps<{
	project: Project | null;
}>();

const emit = defineEmits<{
	close: [];
	open: [projectId: string];
}>();

const isOpen = computed(() => !!props.project);

const typeLabels: Record<string, string> = {
	designer: "Design Project",
	"audio-editor": "Audio Project",
	"video-editor": "Video Project",
	"video-recording": "Recording Project",
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

const formatSize = (bytes?: number) => {
	if (!bytes) return "0 B";
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/70" @click="emit('close')" />

		<!-- Modal -->
		<div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div>
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
						{{ project?.name }}
					</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
						{{ typeLabels[project?.type || "designer"] }}
					</p>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					@click="emit('close')"
				>
					<svg
						class="w-6 h-6 text-gray-500"
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

			<!-- Content -->
			<div class="flex-1 overflow-auto p-6">
				<!-- Preview Image -->
				<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-6">
					<img
						v-if="project?.thumbnail"
						:src="project.thumbnail"
						:alt="project.name"
						class="w-full h-full object-cover"
					/>
					<div
						v-else
						class="w-full h-full flex items-center justify-center text-gray-400"
					>
						<span class="text-8xl">📄</span>
					</div>
				</div>

				<!-- Info Grid -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
							Status
						</p>
						<p class="text-sm font-medium text-gray-900 dark:text-white capitalize">
							{{ project?.status || "draft" }}
						</p>
					</div>
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
							Size
						</p>
						<p class="text-sm font-medium text-gray-900 dark:text-white">
							{{ formatSize(project?.size) }}
						</p>
					</div>
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
							Version
						</p>
						<p class="text-sm font-medium text-gray-900 dark:text-white">
							v{{ project?.version || 1 }}
						</p>
					</div>
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
							Dimensions
						</p>
						<p class="text-sm font-medium text-gray-900 dark:text-white">
							{{ project?.width }} × {{ project?.height }}
						</p>
					</div>
				</div>

				<!-- Description -->
				<div v-if="project?.description" class="mb-6">
					<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
						Description
					</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{{ project.description }}
					</p>
				</div>

				<!-- Tags -->
				<div v-if="project?.tags?.length" class="mb-6">
					<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
						Tags
					</h3>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="tag in project.tags"
							:key="tag"
							class="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
						>
							{{ tag }}
						</span>
					</div>
				</div>

				<!-- Collaborators -->
				<div v-if="project?.sharedWith?.length" class="mb-6">
					<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
						Shared With
					</h3>
					<div class="flex flex-wrap gap-3">
						<div
							v-for="user in project.sharedWith"
							:key="user.userId"
							class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
						>
							<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm text-white font-medium">
								{{ user.userId.charAt(0).toUpperCase() }}
							</div>
							<span class="text-sm text-gray-700 dark:text-gray-300">{{
								user.userId
							}}</span>
							<span class="text-xs text-gray-500 capitalize"
							>({{ user.role }})</span>
						</div>
					</div>
				</div>

				<!-- Dates -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-xs text-gray-500 dark:text-gray-400">Created</p>
						<p class="text-sm text-gray-700 dark:text-gray-300">
							{{ formatDate(project?.createdAt || new Date()) }}
						</p>
					</div>
					<div>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							Last Modified
						</p>
						<p class="text-sm text-gray-700 dark:text-gray-300">
							{{ formatDate(project?.updatedAt || new Date()) }}
						</p>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
				<button
					class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
					@click="emit('close')"
				>
					Close
				</button>
				<button
					class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
					@click="emit('open', project!.id)"
				>
					Open in Editor
				</button>
			</div>
		</div>
	</div>
</template>
