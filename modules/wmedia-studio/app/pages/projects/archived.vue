<script setup lang="ts">
import type { Project } from "#shared/types/project";

const router = useRouter();
const {
	fetchProjects,
	archivedProjects,
	loading,
	error,
	unarchiveProject,
	duplicateProject,
	deleteProject,
} = useProject();

onMounted(() => {
	fetchProjects();
});

const handleEdit = (projectId: string) => {
	router.push(`/projects/${projectId}`);
};

const handleDuplicate = async (projectId: string) => {
	const newProject = await duplicateProject(projectId);
	if (newProject) {
		router.push(`/projects/${newProject.id}`);
	}
};

const handleUnarchive = async (projectId: string) => {
	await unarchiveProject(projectId);
};

const handleDelete = async (projectId: string) => {
	const project = archivedProjects.value.find(p => p.id === projectId);
	if (
		project && confirm(`Are you sure you want to delete "${project.name}"?`)
	) {
		await deleteProject(projectId);
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<NuxtLink
					to="/projects"
					class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<i class="i-mdi-arrow-left mr-1" />
					Back to Projects
				</NuxtLink>
				<h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
					Archived Projects
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Manage your archived projects
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
				v-else-if="archivedProjects.length === 0"
				class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-archive text-6xl" />
				<p class="mt-2 text-lg">No archived projects</p>
				<p class="text-sm">Projects you archive will appear here</p>
			</div>

			<div v-else>
				<ProjectList
					:projects="archivedProjects"
					@edit="handleEdit"
					@duplicate="handleDuplicate"
					@archive="handleUnarchive"
					@delete="handleDelete"
				/>
			</div>
		</div>
	</div>
</template>
