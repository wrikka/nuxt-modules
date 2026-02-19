export interface NotificationConfig {
	enableNotifications: boolean;
	enableEmail: boolean;
	enablePush: boolean;
	enableInApp: boolean;
}

export interface Notification {
	id: string;
	type: "content_update" | "comment" | "suggestion" | "scheduled_publish";
	title: string;
	message: string;
	contentId?: string;
	userId?: string;
	read: boolean;
	createdAt: string;
}

export class ContentNotifications {
	private config: NotificationConfig;
	private notifications: Map<string, Notification[]> = new Map();

	constructor(config?: NotificationConfig) {
		this.config = config || {
			enableNotifications: true,
			enableEmail: false,
			enablePush: false,
			enableInApp: true,
		};
	}

	notify(
		type: "content_update" | "comment" | "suggestion" | "scheduled_publish",
		title: string,
		message: string,
		contentId?: string,
		userId?: string,
	): Notification {
		if (!this.config.enableNotifications) {
			throw new Error("Notifications are not enabled");
		}

		const notification: Notification = {
			id: crypto.randomUUID(),
			type,
			title,
			message,
			contentId,
			userId,
			read: false,
			createdAt: new Date().toISOString(),
		};

		if (userId) {
			if (!this.notifications.has(userId)) {
				this.notifications.set(userId, []);
			}
			this.notifications.get(userId)!.push(notification);
		}

		return notification;
	}

	notifyContentUpdate(contentId: string, title: string): Notification {
		return this.notify(
			"content_update",
			"Content Updated",
			`The content "${title}" has been updated`,
			contentId,
		);
	}

	notifyComment(contentId: string, author: string): Notification {
		return this.notify(
			"comment",
			"New Comment",
			`${author} commented on your content`,
			contentId,
		);
	}

	notifySuggestion(contentId: string, author: string): Notification {
		return this.notify(
			"suggestion",
			"New Suggestion",
			`${author} suggested changes to your content`,
			contentId,
		);
	}

	notifyScheduledPublish(contentId: string, title: string): Notification {
		return this.notify(
			"scheduled_publish",
			"Scheduled Publish",
			`"${title}" has been published according to schedule`,
			contentId,
		);
	}

	getNotifications(userId: string, unreadOnly: boolean = false): Notification[] {
		const userNotifications = this.notifications.get(userId) || [];

		if (unreadOnly) {
			return userNotifications.filter((n) => !n.read);
		}

		return userNotifications;
	}

	getUnreadCount(userId: string): number {
		const userNotifications = this.notifications.get(userId) || [];
		return userNotifications.filter((n) => !n.read).length;
	}

	markAsRead(notificationId: string, userId: string): boolean {
		const userNotifications = this.notifications.get(userId);
		if (!userNotifications) return false;

		const notification = userNotifications.find((n) => n.id === notificationId);
		if (notification) {
			notification.read = true;
			return true;
		}

		return false;
	}

	markAllAsRead(userId: string): void {
		const userNotifications = this.notifications.get(userId);
		if (userNotifications) {
			userNotifications.forEach((n) => {
				n.read = true;
			});
		}
	}

	deleteNotification(notificationId: string, userId: string): boolean {
		const userNotifications = this.notifications.get(userId);
		if (!userNotifications) return false;

		const index = userNotifications.findIndex((n) => n.id === notificationId);
		if (index !== -1) {
			userNotifications.splice(index, 1);
			return true;
		}

		return false;
	}

	clearNotifications(userId: string): void {
		this.notifications.delete(userId);
	}

	getAllNotifications(): Map<string, Notification[]> {
		return new Map(this.notifications);
	}

	getConfig(): NotificationConfig {
		return this.config;
	}
}

// Singleton instance
let notificationsInstance: ContentNotifications | null = null;

export function useContentNotifications(config?: NotificationConfig): ContentNotifications {
	if (!notificationsInstance) {
		notificationsInstance = new ContentNotifications(config);
	}
	return notificationsInstance;
}

// Helper composable for notifications
export function useNotifications(userId: string) {
	const notifications = useContentNotifications();

	return {
		notify: (
			type: "content_update" | "comment" | "suggestion" | "scheduled_publish",
			title: string,
			message: string,
			contentId?: string,
		) => notifications.notify(type, title, message, contentId, userId),
		notifyContentUpdate: (contentId: string, title: string) => notifications.notifyContentUpdate(contentId, title),
		notifyComment: (contentId: string, author: string) => notifications.notifyComment(contentId, author),
		notifySuggestion: (contentId: string, author: string) => notifications.notifySuggestion(contentId, author),
		notifyScheduledPublish: (contentId: string, title: string) =>
			notifications.notifyScheduledPublish(contentId, title),
		getNotifications: (unreadOnly?: boolean) => notifications.getNotifications(userId, unreadOnly),
		getUnreadCount: () => notifications.getUnreadCount(userId),
		markAsRead: (notificationId: string) => notifications.markAsRead(notificationId, userId),
		markAllAsRead: () => notifications.markAllAsRead(userId),
		deleteNotification: (notificationId: string) => notifications.deleteNotification(notificationId, userId),
		clearNotifications: () => notifications.clearNotifications(userId),
	};
}
