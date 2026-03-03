<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const projectId = route.params.id as string;

const loading = ref(false);
const recentExports = ref<ProjectExport[]>([]);

onMounted(async () => {
	try {
		const response = await $fetch<{ exports: ProjectExport[] }>(
			`/api/projects/${projectId}/exports`,
		);
		recentExports.value = response.exports;
	} catch (err) {
		console.error("Failed to fetch exports:", err);
	}
});

const handleExport = async (options: any) => {
	loading.value = true;
	try {
		const response = await $fetch<{ export: ProjectExport }>(
			`/api/projects/${projectId}/export`,
			{
				method: "POST",
				body: options,
			},
		);
		recentExports.value.unshift(response.export);
	} catch (err) {
		console.error("Failed to export project:", err);
		alert("Failed to export project. Please try again.");
	} finally {
		loading.value = false;
	}
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
					Export Project
				</h1>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<ProjectExport
					:project-id="projectId"
					:loading="loading"
					:recent-exports="recentExports"
					@export="handleExport"
					@cancel="handleCancel"
				/>
			</div>
		</div>
	</div>
</template>
