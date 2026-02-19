import type { Task } from "../../shared/types/task"
import { computed, readonly, ref } from "vue"

export interface InboxItem {
	task: Task
	reason: "unassigned" | "no_due_date" | "overdue" | "needs_review"
	priority: number
}

export function useInboxZero() {
	const inboxItems = ref<InboxItem[]>([])
	const isLoading = ref(false)
	const currentIndex = ref(0)

	function processTasks(tasks: Task[]): InboxItem[] {
		const items: InboxItem[] = []
		const now = new Date()

		for (const task of tasks) {
			let reason: InboxItem["reason"] | null = null
			let priority = 0

			if (!task.assignee) {
				reason = "unassigned"
				priority = 3
			}
			else if (!task.date) {
				reason = "no_due_date"
				priority = 2
			}
			else if (new Date(task.date) < now) {
				reason = "overdue"
				priority = 4
			}
			else if (task.status === "In Review") {
				reason = "needs_review"
				priority = 1
			}

			if (reason) {
				items.push({ task, reason, priority })
			}
		}

		return items.sort((a, b) => b.priority - a.priority)
	}

	function nextItem() {
		if (currentIndex.value < inboxItems.value.length - 1) {
			currentIndex.value++
		}
	}

	function prevItem() {
		if (currentIndex.value > 0) {
			currentIndex.value--
		}
	}

	function markAsProcessed(taskId: string) {
		inboxItems.value = inboxItems.value.filter(item => item.task.id !== taskId)
		if (currentIndex.value >= inboxItems.value.length) {
			currentIndex.value = Math.max(0, inboxItems.value.length - 1)
		}
	}

	function skipItem(taskId: string) {
		// Move to end of queue
		const item = inboxItems.value.find(i => i.task.id === taskId)
		if (item) {
			inboxItems.value = inboxItems.value.filter(i => i.task.id !== taskId)
			inboxItems.value.push(item)
		}
	}

	const currentItem = computed(() => inboxItems.value[currentIndex.value])
	const progress = computed(() => ({
		total: inboxItems.value.length,
		current: currentIndex.value + 1,
		percentage: inboxItems.value.length > 0
			? Math.round(((currentIndex.value + 1) / inboxItems.value.length) * 100)
			: 0,
	}))

	const stats = computed(() => ({
		unassigned: inboxItems.value.filter(i => i.reason === "unassigned").length,
		noDueDate: inboxItems.value.filter(i => i.reason === "no_due_date").length,
		overdue: inboxItems.value.filter(i => i.reason === "overdue").length,
		needsReview: inboxItems.value.filter(i => i.reason === "needs_review").length,
	}))

	return {
		inboxItems: readonly(inboxItems),
		currentItem,
		currentIndex: readonly(currentIndex),
		progress,
		stats,
		isLoading: readonly(isLoading),
		processTasks,
		nextItem,
		prevItem,
		markAsProcessed,
		skipItem,
	}
}
