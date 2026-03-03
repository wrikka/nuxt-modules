import type { Project, ProjectType } from "#shared/types/project";

export function useProject() {
	const projects = ref<Project[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const activeProjects = computed(() => projects.value.filter((p) => p.status !== "archived"));
	const archivedProjects = computed(() => projects.value.filter((p) => p.status === "archived"));

	const fetchProjects = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ data: { projects: Project[] } }>("/api/projects");
			projects.value = response.data.projects;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch projects";
		} finally {
			loading.value = false;
		}
	};

	const fetchProject = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ data: { project: Project } }>(`/api/projects/${id}`);
			return response.data.project;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch project";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const createProject = async (data: {
		name: string;
		description?: string;
		type: ProjectType;
		width?: number;
		height?: number;
		backgroundColor?: string;
	}) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ data: { project: Project } }>("/api/projects", {
				method: "POST",
				body: data,
			});
			projects.value.push(response.data.project);
			return response.data.project;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create project";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const updateProject = async (id: string, data: Partial<Project>) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ data: { project: Project } }>(`/api/projects/${id}`, {
				method: "PUT",
				body: data,
			});
			const index = projects.value.findIndex((p) => p.id === id);
			if (index !== -1) {
				projects.value[index] = response.data.project;
			}
			return response.data.project;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to update project";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const deleteProject = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			await $fetch(`/api/projects/${id}`, {
				method: "DELETE",
			});
			projects.value = projects.value.filter((p) => p.id !== id);
			return true;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete project";
			return false;
		} finally {
			loading.value = false;
		}
	};

	const archiveProject = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ data: { project: Project } }>(`/api/projects/${id}/archive`, {
				method: "POST",
			});
			const index = projects.value.findIndex((p) => p.id === id);
			if (index !== -1) {
				projects.value[index] = response.data.project;
			}
			return response.data.project;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to archive project";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const unarchiveProject = async (id: string) => {
		return updateProject(id, { status: "active" });
	};

	const duplicateProject = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ data: { project: Project } }>(`/api/projects/${id}/duplicate`, {
				method: "POST",
			});
			projects.value.push(response.data.project);
			return response.data.project;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to duplicate project";
			return null;
		} finally {
			loading.value = false;
		}
	};

	return {
		projects,
		activeProjects,
		archivedProjects,
		loading,
		error,
		fetchProjects,
		fetchProject,
		createProject,
		updateProject,
		deleteProject,
		archiveProject,
		unarchiveProject,
		duplicateProject,
	};
}
