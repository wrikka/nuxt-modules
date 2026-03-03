<script setup lang="ts">
import type { Project } from "#shared/types";
import { format } from "date-fns";

const props = defineProps<{
	project: Project;
	viewMode: "grid" | "list";
	selected?: boolean;
}>();

const emit = defineEmits<{
	select: [projectId: string, selected: boolean];
	open: [projectId: string];
	duplicate: [projectId: string];
	delete: [projectId: string];
	favorite: [projectId: string, isFavorite: boolean];
	share: [projectId: string];
	preview: [projectId: string];
}>();

const isHovered = ref(false);

const formatDate = (date: Date) => {
	return format(new Date(date), "MMM d, yyyy");
};

const formatSize = (bytes?: number) => {
	if (!bytes) return "0 B";
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const statusColors: Record<string, string> = {
	draft: "bg-gray-400",
	active: "bg-blue-500",
	completed: "bg-green-500",
	archived: "bg-yellow-500",
};

const statusLabels: Record<string, string> = {
	draft: "Draft",
	active: "In Progress",
	completed: "Completed",
	archived: "Archived",
};

const typeIcons: Record<string, string> = {
	designer: "🎨",
	"audio-editor": "🎵",
	"video-editor": "🎬",
	"video-recording": "📹",
};

const onSelect = (e: Event) => {
	const target = e.target as HTMLInputElement;
	emit("select", props.project.id, target.checked);
};
</script>

<template>
	<!-- Grid View -->
	<div
		v-if="viewMode === 'grid'"
		class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 relative"
		:class="{ 'ring-2 ring-blue-500': selected }"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<!-- Checkbox for bulk select -->
		<div class="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
			<input
				type="checkbox"
				:checked="selected"
				class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
				@click.stop="onSelect"
			/>
		</div>

		<!-- Favorite Button -->
		<button
			class="absolute top-2 right-2 z-20 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
			:class="project.isFavorite
			? 'opacity-100 text-yellow-400'
			: 'text-gray-400 hover:text-yellow-400 bg-white dark:bg-gray-700 shadow-sm'"
			@click.stop="emit('favorite', project.id, !project.isFavorite)"
		>
			<svg
				class="w-5 h-5"
				:fill="project.isFavorite ? 'currentColor' : 'none'"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
				/>
			</svg>
		</button>

		<!-- Thumbnail Area -->
		<div
			class="aspect-video bg-gray-100 dark:bg-gray-700 relative cursor-pointer overflow-hidden"
			@click="emit('open', project.id)"
		>
			<img
				v-if="project.thumbnail"
				:src="project.thumbnail"
				:alt="project.name"
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			<div
				v-else
				class="w-full h-full flex items-center justify-center text-6xl"
			>
				{{ typeIcons[project.type || "designer"] }}
			</div>

			<!-- Hover Overlay -->
			<div
				class="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-200"
				:class="isHovered ? 'opacity-100' : 'opacity-0'"
			>
				<button
					class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
					@click.stop="emit('preview', project.id)"
					title="Quick Preview"
				>
					<svg
						class="w-5 h-5 text-gray-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
				</button>
				<button
					class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
					@click.stop="emit('duplicate', project.id)"
					title="Duplicate"
				>
					<svg
						class="w-5 h-5 text-gray-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
				</button>
				<button
					class="p-2 bg-white rounded-full hover:bg-blue-100 transition-colors shadow-lg"
					@click.stop="emit('share', project.id)"
					title="Share"
				>
					<svg
						class="w-5 h-5 text-gray-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
						/>
					</svg>
				</button>
				<button
					class="p-2 bg-white rounded-full hover:bg-red-100 transition-colors shadow-lg"
					@click.stop="emit('delete', project.id)"
					title="Move to Trash"
				>
					<svg
						class="w-5 h-5 text-gray-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
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

			<!-- Status Badge -->
			<div
				class="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white"
				:class="statusColors[project.status || 'draft']"
			>
				{{ statusLabels[project.status || "draft"] }}
			</div>

			<!-- Version Count -->
			<div
				v-if="project.version && project.version > 1"
				class="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-800/80 text-white"
			>
				v{{ project.version }}
			</div>
		</div>

		<!-- Info Area -->
		<div class="p-4">
			<div class="flex items-start justify-between gap-2">
				<div class="flex-1 min-w-0">
					<h3
						class="font-semibold text-gray-900 dark:text-white truncate"
						:title="project.name"
					>
						{{ project.name }}
					</h3>
					<p
						v-if="project.description"
						class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1"
					>
						{{ project.description }}
					</p>
				</div>
				<span
					class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap"
				>
					{{ formatSize(project.size) }}
				</span>
			</div>

			<!-- Tags -->
			<div v-if="project.tags?.length" class="flex flex-wrap gap-1 mt-2">
				<span
					v-for="tag in project.tags.slice(0, 3)"
					:key="tag"
					class="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
				>
					{{ tag }}
				</span>
				<span
					v-if="project.tags.length > 3"
					class="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
				>
					+{{ project.tags.length - 3 }}
				</span>
			</div>

			<!-- Collaborators & Date -->
			<div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
				<div v-if="project.sharedWith?.length" class="flex -space-x-2">
					<div
						v-for="(user, i) in project.sharedWith.slice(0, 3)"
						:key="i"
						class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium"
					>
						{{ user.userId.charAt(0).toUpperCase() }}
					</div>
					<div
						v-if="project.sharedWith.length > 3"
						class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium"
					>
						+{{ project.sharedWith.length - 3 }}
					</div>
				</div>
				<span class="text-xs text-gray-400 dark:text-gray-500">
					{{ formatDate(project.updatedAt) }}
				</span>
			</div>
		</div>
	</div>

	<!-- List View -->
	<div
		v-else
		class="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
		:class="{ 'ring-2 ring-blue-500': selected }"
	>
		<!-- Checkbox -->
		<input
			type="checkbox"
			:checked="selected"
			class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
			@click.stop="onSelect"
		/>

		<!-- Favorite -->
		<button
			class="p-1 transition-colors"
			:class="project.isFavorite
			? 'text-yellow-400'
			: 'text-gray-300 hover:text-yellow-400'"
			@click.stop="emit('favorite', project.id, !project.isFavorite)"
		>
			<svg
				class="w-5 h-5"
				:fill="project.isFavorite ? 'currentColor' : 'none'"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
				/>
			</svg>
		</button>

		<!-- Thumbnail -->
		<div
			class="w-20 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl cursor-pointer flex-shrink-0 overflow-hidden"
			@click="emit('open', project.id)"
		>
			<img
				v-if="project.thumbnail"
				:src="project.thumbnail"
				:alt="project.name"
				class="w-full h-full object-cover"
			/>
			<span v-else>{{ typeIcons[project.type || "designer"] }}</span>
		</div>

		<!-- Info -->
		<div
			class="flex-1 min-w-0 cursor-pointer"
			@click="emit('open', project.id)"
		>
			<h3 class="font-semibold text-gray-900 dark:text-white truncate">
				{{ project.name }}
			</h3>
			<div class="flex items-center gap-3 mt-1">
				<span
					class="px-2 py-0.5 rounded-full text-xs font-medium text-white"
					:class="statusColors[project.status || 'draft']"
				>
					{{ statusLabels[project.status || "draft"] }}
				</span>
				<span class="text-xs text-gray-500 dark:text-gray-400">
					{{ typeIcons[project.type || "designer"] }} {{
						project.type || "designer"
					}}
				</span>
				<span class="text-xs text-gray-400 dark:text-gray-500">
					{{ formatSize(project.size) }}
				</span>
			</div>
		</div>

		<!-- Tags -->
		<div
			v-if="project.tags?.length"
			class="hidden lg:flex flex-wrap gap-1 max-w-xs"
		>
			<span
				v-for="tag in project.tags.slice(0, 3)"
				:key="tag"
				class="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
			>
				{{ tag }}
			</span>
		</div>

		<!-- Collaborators -->
		<div v-if="project.sharedWith?.length" class="hidden md:flex -space-x-2">
			<div
				v-for="(user, i) in project.sharedWith.slice(0, 3)"
				:key="i"
				class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium"
			>
				{{ user.userId.charAt(0).toUpperCase() }}
			</div>
		</div>

		<!-- Date -->
		<span
			class="hidden sm:block text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap"
		>
			{{ formatDate(project.updatedAt) }}
		</span>

		<!-- Actions -->
		<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				@click.stop="emit('preview', project.id)"
				title="Preview"
			>
				<svg
					class="w-4 h-4 text-gray-600 dark:text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
			</button>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				@click.stop="emit('duplicate', project.id)"
				title="Duplicate"
			>
				<svg
					class="w-4 h-4 text-gray-600 dark:text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			</button>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				@click.stop="emit('share', project.id)"
				title="Share"
			>
				<svg
					class="w-4 h-4 text-gray-600 dark:text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
					/>
				</svg>
			</button>
			<button
				class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
				@click.stop="emit('delete', project.id)"
				title="Move to Trash"
			>
				<svg
					class="w-4 h-4 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
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
</template>
