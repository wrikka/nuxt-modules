import type { Project } from "~/shared/types/features"
import type { Task } from "~/shared/types/task"

/**
 * Composable for Portfolio Dashboard
 */
export const usePortfolio = () => {
	const { $toast } = useNuxtApp()

	const projects = useState<Project[]>("projects", () => [])
	const selectedProject = useState<Project | null>("selected-project", () => null)

	/**
	 * Fetch all projects
	 */
	const fetchProjects = async () => {
		const { data } = await useFetch<Project[]>("/api/projects")
		if (data.value) projects.value = data.value
	}

	/**
	 * Create project
	 */
	const createProject = async (projectData: Omit<Project, "id">) => {
		const { data, error } = await useFetch<Project>("/api/projects", {
			method: "POST",
			body: projectData,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create project")
			return null
		}

		projects.value.push(data.value)
		$toast.success("Project created")
		return data.value
	}

	/**
	 * Update project
	 */
	const updateProject = async (projectId: string, updates: Partial<Project>) => {
		const { data, error } = await useFetch<Project>(`/api/projects/${projectId}`, {
			method: "PATCH",
			body: updates,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to update project")
			return false
		}

		const index = projects.value.findIndex(p => p.id === projectId)
		if (index !== -1) projects.value[index] = data.value
		return true
	}

	/**
	 * Delete project
	 */
	const deleteProject = async (projectId: string) => {
		const { error } = await useFetch(`/api/projects/${projectId}`, { method: "DELETE" })

		if (error.value) {
			$toast.error("Failed to delete project")
			return false
		}

		projects.value = projects.value.filter(p => p.id !== projectId)
		$toast.success("Project deleted")
		return true
	}

	/**
	 * Get project tasks
	 */
	const getProjectTasks = (projectId: string, allTasks: Task[]): Task[] => {
		const project = projects.value.find(p => p.id === projectId)
		if (!project) return []
		return allTasks.filter(t => project.taskIds.includes(t.id))
	}

	/**
	 * Get project progress
	 */
	const getProjectProgress = (project: Project, allTasks: Task[]): number => {
		const projectTasks = getProjectTasks(project.id, allTasks)
		if (!projectTasks.length) return 0

		const completed = projectTasks.filter(t => t.status === "Done").length
		return Math.round((completed / projectTasks.length) * 100)
	}

	/**
	 * Get portfolio stats
	 */
	const getPortfolioStats = (allTasks: Task[]) => {
		const totalProjects = projects.value.length
		const activeProjects = projects.value.filter(p => p.status === "active").length
		const totalTasks = projects.value.reduce((sum, p) => sum + p.taskIds.length, 0)

		// Calculate overall progress
		let totalProgress = 0
		for (const project of projects.value) {
			totalProgress += getProjectProgress(project, allTasks)
		}
		const averageProgress = totalProjects > 0 ? totalProgress / totalProjects : 0

		return {
			totalProjects,
			activeProjects,
			totalTasks,
			averageProgress: Math.round(averageProgress),
		}
	}

	/**
	 * Get resource allocation (tasks per member)
	 */
	const getResourceAllocation = (projectId: string, allTasks: Task[]) => {
		const projectTasks = getProjectTasks(projectId, allTasks)
		const allocation: Record<string, number> = {}

		for (const task of projectTasks) {
			const assigneeId = task.assignee?.name || "Unassigned"
			allocation[assigneeId] = (allocation[assigneeId] || 0) + 1
		}

		return allocation
	}

	return {
		projects: readonly(projects),
		selectedProject,
		fetchProjects,
		createProject,
		updateProject,
		deleteProject,
		getProjectTasks,
		getProjectProgress,
		getPortfolioStats,
		getResourceAllocation,
	}
}
