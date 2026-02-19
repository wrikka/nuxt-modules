import type { Notification, NotificationPreference, NotificationType, NotificationChannel } from "~/shared/types/features"

/**
 * Composable for Smart Notifications
 */
export const useNotifications = () => {
	const { $toast } = useNuxtApp()

	const notifications = useState<Notification[]>("notifications", () => [])
	const preferences = useState<NotificationPreference | null>("notification-preferences", () => null)
	const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
	const isOpen = useState<boolean>("notification-panel-open", () => false)

	/**
	 * Fetch notifications
	 */
	const fetchNotifications = async () => {
		const { data } = await useFetch<Notification[]>("/api/notifications")
		if (data.value) notifications.value = data.value
	}

	/**
	 * Mark notification as read
	 */
	const markAsRead = async (notificationId: string) => {
		const { error } = await useFetch(`/api/notifications/${notificationId}/read`, { method: "POST" })
		if (!error.value) {
			const notif = notifications.value.find(n => n.id === notificationId)
			if (notif) notif.read = true
		}
	}

	/**
	 * Mark all as read
	 */
	const markAllAsRead = async () => {
		const { error } = await useFetch("/api/notifications/read-all", { method: "POST" })
		if (!error.value) {
			notifications.value.forEach(n => n.read = true)
		}
	}

	/**
	 * Delete notification
	 */
	const deleteNotification = async (notificationId: string) => {
		const { error } = await useFetch(`/api/notifications/${notificationId}`, { method: "DELETE" })
		if (!error.value) {
			notifications.value = notifications.value.filter(n => n.id !== notificationId)
		}
	}

	/**
	 * Update preferences
	 */
	const updatePreferences = async (prefs: Partial<NotificationPreference>) => {
		const { data, error } = await useFetch<NotificationPreference>("/api/notifications/preferences", {
			method: "PATCH",
			body: prefs,
		})
		if (!error.value && data.value) {
			preferences.value = data.value
			$toast.success("Preferences saved")
		}
	}

	/**
	 * Toggle notification panel
	 */
	const togglePanel = () => {
		isOpen.value = !isOpen.value
		if (isOpen.value) fetchNotifications()
	}

	/**
	 * Get notification icon
	 */
	const getNotificationIcon = (type: NotificationType): string => {
		const icons: Record<NotificationType, string> = {
			due_soon: "mdi:clock-alert-outline",
			overdue: "mdi:alert-circle",
			assigned: "mdi:account-plus",
			mentioned: "mdi:at",
			status_change: "mdi:swap-horizontal",
			comment: "mdi:comment-outline",
			blocked: "mdi:block-helper",
			dependency_completed: "mdi:check-circle-outline",
		}
		return icons[type]
	}

	/**
	 * Get notification color
	 */
	const getNotificationColor = (type: NotificationType): string => {
		const colors: Record<NotificationType, string> = {
			due_soon: "text-yellow-600",
			overdue: "text-red-600",
			assigned: "text-blue-600",
			mentioned: "text-purple-600",
			status_change: "text-gray-600",
			comment: "text-green-600",
			blocked: "text-red-600",
			dependency_completed: "text-green-600",
		}
		return colors[type]
	}

	return {
		notifications: readonly(notifications),
		preferences: readonly(preferences),
		unreadCount,
		isOpen,
		fetchNotifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		updatePreferences,
		togglePanel,
		getNotificationIcon,
		getNotificationColor,
	}
}
