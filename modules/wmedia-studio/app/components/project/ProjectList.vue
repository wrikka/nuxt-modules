<script setup lang="ts">
import type { Project } from "#shared/types/project";

defineProps<{
	projects: Project[];
	loading?: boolean;
	error?: string | null;
}>();

defineEmits<{
	edit: [projectId: string];
	duplicate: [projectId: string];
	archive: [projectId: string];
	delete: [projectId: string];
}>();
</script>

<template>
	<div class="project-list space-y-4">
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
			v-else-if="projects.length === 0"
			class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-folder-open-outline text-6xl" />
			<p class="mt-2 text-lg">No projects found</p>
			<p class="text-sm">Create your first project to get started</p>
		</div>

		<div
			v-else
			class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			<ProjectCard
				v-for="project in projects"
				:key="project.id"
				:project="project"
				view-mode="grid"
				@edit="$emit('edit', $event)"
				@duplicate="$emit('duplicate', $event)"
				@archive="$emit('archive', $event)"
				@delete="$emit('delete', $event)"
			/>
		</div>
	</div>
</template>
