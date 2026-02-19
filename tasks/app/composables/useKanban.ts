/**
 * Composable for managing Kanban board logic, including task grouping and drag-and-drop handling.
 */
import type { DragEndEvent } from "~/shared/types/drag-event"
import { type Status, StatusSchema, type Task } from "~/shared/types/task"

export const useKanban = () => {
	const { filteredTasks } = useTaskFilter()
	const { updateTaskStatus } = useTaskApi()

	const statuses = StatusSchema.options

	/**
	 * Handles the drag-and-drop end event to update the task's status.
	 * ~/param event - The drag end event containing the item and new status.
	 */
	const onDragEnd = (event: DragEndEvent) => {
		const { item, newStatus } = event
		const taskId = (item as HTMLElement).id

		updateTaskStatus(taskId, newStatus)
	}

	/**
	 * Groups tasks by their status for display in the Kanban board.
	 */
	const tasksByStatus = computed(() => {
		const initial: Record<Status, Task[]> = {
			"Backlog": [],
			"Done": [],
			"In Design": [],
			"In Progress": [],
			"In Review": [],
		}

		return filteredTasks.value.reduce((acc: Record<Status, Task[]>, task: Task) => {
			if (acc[task.status]) {
				acc[task.status].push(task)
			}
			return acc
		}, initial)
	})

	return {
		tasksByStatus,
		statuses,
		onDragEnd,
	}
}
