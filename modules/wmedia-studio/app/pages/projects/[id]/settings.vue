<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { fetchProject, updateProject, loading, error } = useProject();

const projectId = route.params.id as string;
const project = ref<Project | null>(null);
const saving = ref(false);

onMounted(async () => {
	project.value = await fetchProject(projectId);
});

const handleSaveSettings = async (settings: any) => {
	if (!project.value) return;
	saving.value = true;
	await updateProject(projectId, { settings });
	saving.value = false;
};

const handleCancel = () => {
	router.push(`/projects/${projectId}`);
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<NuxtLink
					:to="`/projects/${projectId}`"
					class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<i class="i-mdi-arrow-left mr-1" />
					Back to Project
				</NuxtLink>
				<h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
					Project Settings
				</h1>
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
				v-else-if="project"
				class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
			>
				<ProjectSettings
					:settings="project.settings"
					:loading="saving"
					@save="handleSaveSettings"
					@cancel="handleCancel"
				/>
			</div>
		</div>
	</div>
</template>
