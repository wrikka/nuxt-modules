<script setup lang="ts">
const router = useRouter();
const { createProject, loading } = useProject();

const handleCreateProject = async (data: any) => {
	const project = await createProject(data);
	if (project) {
		router.push(`/projects/${project.id}`);
	}
};

const handleCancel = () => {
	router.push("/projects");
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<NuxtLink
					to="/projects"
					class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<i class="i-mdi-arrow-left mr-1" />
					Back to Projects
				</NuxtLink>
				<h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
					Create New Project
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Start by choosing a project type and configuring your canvas
				</p>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<ProjectForm
					:loading="loading"
					@submit="handleCreateProject"
					@cancel="handleCancel"
				/>
			</div>
		</div>
	</div>
</template>
