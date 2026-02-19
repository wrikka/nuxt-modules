import type { Task } from "../../shared/types/task"
import { computed, readonly, ref } from "vue"

export interface BulkEditField {
	field: keyof Task
	value: unknown
}

export function useBulkEditV2() {
	const selectedTasks = ref<Set<string>>(new Set())
	const isEditing = ref(false)
	const editField = ref<keyof Task | null>(null)
	const editValue = ref<unknown>(null)

	function selectTask(taskId: string): void {
		selectedTasks.value.add(taskId)
	}

	function deselectTask(taskId: string): void {
		selectedTasks.value.delete(taskId)
	}

	function toggleSelection(taskId: string): void {
		if (selectedTasks.value.has(taskId)) {
			deselectTask(taskId)
		}
		else {
			selectTask(taskId)
		}
	}

	function selectAll(taskIds: string[]): void {
		taskIds.forEach(id => selectedTasks.value.add(id))
	}

	function clearSelection(): void {
		selectedTasks.value.clear()
	}

	async function applyBulkEdit(field: keyof Task, value: unknown): Promise<void> {
		if (selectedTasks.value.size === 0) return

		const updates = Array.from(selectedTasks.value).map(id => ({
			id,
			[field]: value,
		}))

		await $fetch("/api/tasks/bulk-update", {
			method: "POST",
			body: { updates },
		})

		clearSelection()
	}

	async function deleteSelected(): Promise<void> {
		if (selectedTasks.value.size === 0) return

		await $fetch("/api/tasks/bulk-delete", {
			method: "POST",
			body: { ids: Array.from(selectedTasks.value) },
		})

		clearSelection()
	}

	async function assignTo(userId: string): Promise<void> {
		await applyBulkEdit("assignee", { name: userId, avatarUrl: "" })
	}

	async function setStatus(status: string): Promise<void> {
		await applyBulkEdit("status", status)
	}

	async function setPriority(priority: string): Promise<void> {
		await applyBulkEdit("priority", priority)
	}

	async function moveToList(listId: string): Promise<void> {
		await applyBulkEdit("list", listId)
	}

	const selectedCount = computed(() => selectedTasks.value.size)
	const hasSelection = computed(() => selectedTasks.value.size > 0)

	return {
		selectedTasks: readonly(selectedTasks),
		isEditing: readonly(isEditing),
		editField: readonly(editField),
		editValue: readonly(editValue),
		selectedCount,
		hasSelection,
		selectTask,
		deselectTask,
		toggleSelection,
		selectAll,
		clearSelection,
		applyBulkEdit,
		deleteSelected,
		assignTo,
		setStatus,
		setPriority,
		moveToList,
	}
}
