import type { ProjectHistory } from "#shared/types/project";

export function useProjectHistory(projectId: string) {
	const history = ref<ProjectHistory[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchHistory = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ history: ProjectHistory[] }>(`/api/projects/${projectId}/history`);
			history.value = response.history;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch history";
		} finally {
			loading.value = false;
		}
	};

	const restoreHistory = async (historyId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ project: any }>(`/api/projects/${projectId}/history/${historyId}/restore`, {
				method: "POST",
			});
			await fetchHistory();
			return response.project;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to restore history";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const createHistorySnapshot = async (description?: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ history: ProjectHistory }>(`/api/projects/${projectId}/history`, {
				method: "POST",
				body: { description },
			});
			history.value.unshift(response.history);
			return response.history;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create history snapshot";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const deleteHistory = async (historyId: string) => {
		loading.value = true;
		error.value = null;
		try {
			await $fetch(`/api/projects/${projectId}/history/${historyId}`, {
				method: "DELETE",
			});
			history.value = history.value.filter((h) => h.id !== historyId);
			return true;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete history";
			return false;
		} finally {
			loading.value = false;
		}
	};

	return {
		history,
		loading,
		error,
		fetchHistory,
		restoreHistory,
		createHistorySnapshot,
		deleteHistory,
	};
}
