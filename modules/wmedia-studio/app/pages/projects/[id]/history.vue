<script setup lang="ts">
const route = useRoute();
const projectId = route.params.id as string;

const {
	history,
	loading,
	error,
	fetchHistory,
	restoreHistory,
	createHistorySnapshot,
	deleteHistory,
} = useProjectHistory(projectId);

onMounted(() => {
	fetchHistory();
});

const handleRestore = async (historyId: string) => {
	await restoreHistory(historyId);
};

const handleDelete = async (historyId: string) => {
	await deleteHistory(historyId);
};

const handleCreateSnapshot = async () => {
	await createHistorySnapshot();
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
					Version History
				</h1>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<ProjectHistory
					:history="history"
					:loading="loading"
					:error="error"
					@restore="handleRestore"
					@delete="handleDelete"
					@createSnapshot="handleCreateSnapshot"
					@cancel="handleCancel"
				/>
			</div>
		</div>
	</div>
</template>
