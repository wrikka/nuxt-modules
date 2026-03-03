<script setup lang="ts">
const props = defineProps<{
	notifications: {
		id: string;
		title: string;
		message: string;
		type: "info" | "success" | "warning" | "error";
		read: boolean;
		timestamp: string;
	}[];
}>();

const emit = defineEmits<{
	markAsRead: [id: string];
	markAllAsRead: [];
	dismiss: [id: string];
}>();

const isOpen = ref(false);
const unreadCount = computed(() =>
	props.notifications.filter(n => !n.read).length
);

const typeIcons = {
	info: "mdi:information",
	success: "mdi:check-circle",
	warning: "mdi:alert",
	error: "mdi:close-circle",
};

const typeColors = {
	info: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
	success: "text-green-500 bg-green-50 dark:bg-green-900/20",
	warning: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
	error: "text-red-500 bg-red-50 dark:bg-red-900/20",
};
</script>

<template>
	<div class="relative">
		<button
			@click="isOpen = !isOpen"
			class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
		>
			<Icon name="mdi:bell" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
			<span
				v-if="unreadCount > 0"
				class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
			>
				{{ unreadCount > 9 ? "9+" : unreadCount }}
			</span>
		</button>

		<div
			v-if="isOpen"
			class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
		>
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Notifications
				</h3>
				<button
					v-if="unreadCount > 0"
					@click="emit('markAllAsRead')"
					class="text-xs text-blue-500 hover:underline"
				>
					Mark all as read
				</button>
			</div>

			<div class="max-h-80 overflow-y-auto">
				<div
					v-if="notifications.length === 0"
					class="p-8 text-center text-gray-500"
				>
					<Icon name="mdi:bell-off" class="w-8 h-8 mx-auto mb-2 opacity-50" />
					<p class="text-sm">No notifications</p>
				</div>

				<div
					v-for="notification in notifications"
					:key="notification.id"
					:class="[
						'p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
						!notification.read && 'bg-blue-50/50 dark:bg-blue-900/10',
					]"
				>
					<div class="flex items-start gap-3">
						<div
							:class="[
								'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
								typeColors[notification.type],
							]"
						>
							<Icon :name="typeIcons[notification.type]" class="w-4 h-4" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-900 dark:text-white">
								{{ notification.title }}
							</p>
							<p class="text-xs text-gray-500 mt-0.5">
								{{ notification.message }}
							</p>
							<p class="text-xs text-gray-400 mt-1">
								{{ notification.timestamp }}
							</p>
						</div>
						<button
							v-if="!notification.read"
							@click="emit('markAsRead', notification.id)"
							class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
						>
							<Icon name="mdi:check" class="w-4 h-4 text-gray-400" />
						</button>
						<button
							@click="emit('dismiss', notification.id)"
							class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
						>
							<Icon name="mdi:close" class="w-4 h-4 text-gray-400" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
