import { defineStore } from "pinia"
import { computed, readonly, ref } from "vue"

export const useAppStore = defineStore("app", () => {
	// State
	const isLoading = ref(false)
	const notifications = ref<
		Array<{
			id: string
			type: "success" | "error" | "warning" | "info"
			message: string
			duration?: number
		}>
	>([])

	// Actions
	const setLoading = (loading: boolean): void => {
		isLoading.value = loading
	}

	const addNotification = (notification: Omit<typeof notifications.value[0], "id">): string => {
		const id = Date.now().toString()
		notifications.value.push({
			...notification,
			id,
		})

		// Auto remove after duration
		if (notification.duration !== 0) {
			setTimeout(() => {
				removeNotification(id)
			}, notification.duration || 5000)
		}

		return id
	}

	const removeNotification = (id: string): void => {
		const index = notifications.value.findIndex((n: { id: string }) => n.id === id)
		if (index > -1) {
			notifications.value.splice(index, 1)
		}
	}

	const clearNotifications = (): void => {
		notifications.value = []
	}

	// Getters
	const hasNotifications = computed(() => notifications.value.length > 0)

	return {
		// State
		isLoading: readonly(isLoading),
		notifications: readonly(notifications),

		// Getters
		hasNotifications,

		// Actions
		setLoading,
		addNotification,
		removeNotification,
		clearNotifications,
	}
})
