import { computed, ref } from "vue";

export interface Notification {
	id: string;
	userId: string;
	type: "mention" | "comment" | "share" | "project_update" | "system" | "collaboration";
	title: string;
	message: string;
	data?: Record<string, unknown>;
	isRead: boolean;
	createdAt: Date;
}

export interface NotificationPreferences {
	mentions: boolean;
	comments: boolean;
	shares: boolean;
	projectUpdates: boolean;
	system: boolean;
	collaboration: boolean;
	emailNotifications: boolean;
	pushNotifications: boolean;
}

export function useNotifications(userId: Ref<string>) {
	const notifications = ref<Notification[]>([]);
	const preferences = ref<NotificationPreferences>({
		mentions: true,
		comments: true,
		shares: true,
		projectUpdates: true,
		system: true,
		collaboration: true,
		emailNotifications: true,
		pushNotifications: false,
	});
	const isLoading = ref(false);
	const unreadCount = ref(0);

	const unreadNotifications = computed(() => {
		return notifications.value.filter(n => !n.isRead);
	});

	const notificationsByType = computed(() => {
		const grouped = new Map<string, Notification[]>();
		notifications.value.forEach(n => {
			if (!grouped.has(n.type)) {
				grouped.set(n.type, []);
			}
			grouped.get(n.type)!.push(n);
		});
		return grouped;
	});

	const loadNotifications = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ notifications: Notification[]; unreadCount: number }>(
				`/api/users/${userId.value}/notifications`,
			);
			notifications.value = data.notifications || [];
			unreadCount.value = data.unreadCount || 0;
		} catch (error) {
			console.error("Failed to load notifications:", error);
			notifications.value = [];
			unreadCount.value = 0;
		} finally {
			isLoading.value = false;
		}
	};

	const markAsRead = async (notificationId: string) => {
		try {
			await $fetch(`/api/users/${userId.value}/notifications/${notificationId}/read`, {
				method: "POST",
			});

			const notification = notifications.value.find(n => n.id === notificationId);
			if (notification && !notification.isRead) {
				notification.isRead = true;
				unreadCount.value--;
			}
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	};

	const markAllAsRead = async () => {
		try {
			await $fetch(`/api/users/${userId.value}/notifications/read-all`, {
				method: "POST",
			});

			notifications.value.forEach(n => n.isRead = true);
			unreadCount.value = 0;
		} catch (error) {
			console.error("Failed to mark all notifications as read:", error);
		}
	};

	const deleteNotification = async (notificationId: string) => {
		try {
			await $fetch(`/api/users/${userId.value}/notifications/${notificationId}`, {
				method: "DELETE",
			});

			const notification = notifications.value.find(n => n.id === notificationId);
			if (notification && !notification.isRead) {
				unreadCount.value--;
			}

			notifications.value = notifications.value.filter(n => n.id !== notificationId);
		} catch (error) {
			console.error("Failed to delete notification:", error);
		}
	};

	const clearAllNotifications = async () => {
		try {
			await $fetch(`/api/users/${userId.value}/notifications`, {
				method: "DELETE",
			});

			notifications.value = [];
			unreadCount.value = 0;
		} catch (error) {
			console.error("Failed to clear all notifications:", error);
		}
	};

	const createNotification = async (
		type: Notification["type"],
		title: string,
		message: string,
		data?: Record<string, unknown>,
		targetUserId?: string,
	) => {
		try {
			const result = await $fetch<{ notification: Notification }>(`/api/notifications`, {
				method: "POST",
				body: {
					userId: targetUserId || userId.value,
					type,
					title,
					message,
					data,
				},
			});

			if (result.notification.userId === userId.value) {
				notifications.value.unshift(result.notification);
				if (!result.notification.isRead) {
					unreadCount.value++;
				}
			}

			return result.notification;
		} catch (error) {
			console.error("Failed to create notification:", error);
			return null;
		}
	};

	const loadPreferences = async () => {
		try {
			const data = await $fetch<{ preferences: NotificationPreferences }>(
				`/api/users/${userId.value}/notification-preferences`,
			);
			preferences.value = data.preferences;
		} catch (error) {
			console.error("Failed to load notification preferences:", error);
		}
	};

	const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
		try {
			const result = await $fetch<{ preferences: NotificationPreferences }>(
				`/api/users/${userId.value}/notification-preferences`,
				{
					method: "PATCH",
					body: updates,
				},
			);

			preferences.value = result.preferences;
			return true;
		} catch (error) {
			console.error("Failed to update notification preferences:", error);
			return false;
		}
	};

	const getNotificationsByType = (type: Notification["type"]) => {
		return notifications.value.filter(n => n.type === type);
	};

	const getRecentNotifications = (limit: number = 10) => {
		return [...notifications.value]
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, limit);
	};

	return {
		notifications,
		unreadNotifications,
		notificationsByType,
		preferences,
		isLoading,
		unreadCount,
		loadNotifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearAllNotifications,
		createNotification,
		loadPreferences,
		updatePreferences,
		getNotificationsByType,
		getRecentNotifications,
	};
}
