import { computed, onMounted, readonly, ref } from "vue"

export function useWatchTask() {
	const watchedTasks = ref<Set<string>>(new Set())
	const notifications = ref<Array<{ taskId: string, message: string, timestamp: number }>>([])

	const STORAGE_KEY = "tasks-watched"

	function loadWatched(): void {
		if (typeof localStorage !== "undefined") {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				watchedTasks.value = new Set(JSON.parse(stored))
			}
		}
	}

	function saveWatched(): void {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify([...watchedTasks.value]))
		}
	}

	function watch(taskId: string): void {
		watchedTasks.value.add(taskId)
		saveWatched()
	}

	function unwatch(taskId: string): void {
		watchedTasks.value.delete(taskId)
		saveWatched()
	}

	function isWatching(taskId: string): boolean {
		return watchedTasks.value.has(taskId)
	}

	function toggle(taskId: string): void {
		if (isWatching(taskId)) {
			unwatch(taskId)
		}
		else {
			watch(taskId)
		}
	}

	function onTaskUpdate(taskId: string, update: { field: string, value: unknown }): void {
		if (!watchedTasks.value.has(taskId)) return

		const message = `Task ${taskId}: ${update.field} changed to ${update.value}`
		notifications.value.unshift({
			taskId,
			message,
			timestamp: Date.now(),
		})

		// Keep only last 50 notifications
		if (notifications.value.length > 50) {
			notifications.value = notifications.value.slice(0, 50)
		}
	}

	function clearNotifications(): void {
		notifications.value = []
	}

	const watchedCount = computed(() => watchedTasks.value.size)

	onMounted(() => {
		loadWatched()
	})

	return {
		watchedTasks: readonly(watchedTasks),
		notifications: readonly(notifications),
		watchedCount,
		watch,
		unwatch,
		isWatching,
		toggle,
		onTaskUpdate,
		clearNotifications,
	}
}
