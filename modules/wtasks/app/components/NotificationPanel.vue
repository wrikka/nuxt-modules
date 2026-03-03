<script setup lang="ts">
const {
	notifications,
	unreadCount,
	isOpen,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	getNotificationIcon,
	getNotificationColor,
	togglePanel,
} = useNotifications()

const handleNotificationClick = (notification: typeof notifications.value[0]) => {
	if (!notification.read) {
		markAsRead(notification.id)
	}
	// Navigate to related task if applicable
	if (notification.taskId) {
		navigateTo(`/task/${notification.taskId}`)
	}
}
</script>

<template>
	<div class="relative">
		<!-- Bell Icon -->
		<button
			class="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
			@click="togglePanel"
		>
			<Icon name="mdi:bell-outline" class="w-5 h-5" />
			<span
				v-if="unreadCount > 0"
				class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
			>
				{{ unreadCount > 9 ? '9+' : unreadCount }}
			</span>
		</button>

		<!-- Notification Panel -->
		<div
			v-if="isOpen"
			class="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
		>
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Notifications
					<span v-if="unreadCount > 0" class="ml-1 text-sm text-gray-500">
						({{ unreadCount }} unread)
					</span>
				</h3>
				<div class="flex gap-2">
					<button
						v-if="unreadCount > 0"
						class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
						@click="markAllAsRead"
					>
						Mark all read
					</button>
					<button
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						@click="togglePanel"
					>
						<Icon name="mdi:close" class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Notification List -->
			<div class="max-h-96 overflow-y-auto">
				<div v-if="notifications.length === 0" class="p-8 text-center">
					<Icon name="mdi:bell-off-outline" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
					<p class="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
				</div>

				<div
					v-for="notification in notifications"
					:key="notification.id"
					class="flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
					:class="{ 'bg-blue-50/50 dark:bg-blue-900/10': !notification.read }"
					@click="handleNotificationClick(notification)"
				>
					<div :class="getNotificationColor(notification.type)">
						<Icon :name="getNotificationIcon(notification.type)" class="w-5 h-5" />
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 dark:text-white">
							{{ notification.title }}
						</p>
						<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
							{{ notification.message }}
						</p>
						<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
							{{ new Date(notification.createdAt).toLocaleDateString() }}
						</p>
					</div>
					<button
						class="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
						@click.stop="deleteNotification(notification.id)"
					>
						<Icon name="mdi:delete" class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Footer -->
			<div class="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
				<NuxtLink
					to="/notifications"
					class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
					@click="togglePanel"
				>
					View all notifications
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
