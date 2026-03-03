<script setup lang="ts">
const emit = defineEmits<{ close: []; markRead: [id: string]; clearAll: [] }>();
const notifications = ref([{
	id: "1",
	title: "Export Complete",
	message: "Your video has been exported successfully",
	type: "success",
	time: "2 min ago",
	read: false,
}, {
	id: "2",
	title: "New Comment",
	message: "John commented on your project",
	type: "info",
	time: "1 hour ago",
	read: false,
}, {
	id: "3",
	title: "Storage Warning",
	message: "You are running low on storage space",
	type: "warning",
	time: "3 hours ago",
	read: true,
}]);
const filter = ref("all");
const filteredNotifications = computed(() =>
	notifications.value.filter(n =>
		filter.value === "all" || (filter.value === "unread" && !n.read)
	)
);
const unreadCount = computed(() =>
	notifications.value.filter(n => !n.read).length
);
const markRead = (id: string) => {
	const n = notifications.value.find(x => x.id === id);
	if (n) n.read = true;
	emit("markRead", id);
};
const clearAll = () => {
	notifications.value = [];
	emit("clearAll");
};
const getIcon = (
	type: string,
) => ({
	success: "i-ph-check-circle",
	info: "i-ph-info",
	warning: "i-ph-warning",
	error: "i-ph-x-circle",
}[type] || "i-ph-bell");
const getColor = (
	type: string,
) => ({
	success: "text-green-400",
	info: "text-blue-400",
	warning: "text-yellow-400",
	error: "text-red-400",
}[type] || "text-gray-400");
</script>
<template>
	<div class="notification-center bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:bell" class="w-5 h-5 text-blue-500" />
				Notifications
				<span
					v-if="unreadCount > 0"
					class="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium"
				>{{ unreadCount }}</span>
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-3">
			<button
				v-for='f in ["all", "unread"]'
				:key="f"
				class="px-3 py-1 rounded-full text-xs capitalize transition-all"
				:class="filter === f
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="filter = f"
			>
				{{ f }}
			</button>
			<button
				v-if="notifications.length > 0"
				class="ml-auto px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs transition-colors"
				@click="clearAll"
			>
				Clear All
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-2">
			<div
				v-for="n in filteredNotifications"
				:key="n.id"
				class="p-3 rounded-lg cursor-pointer transition-colors"
				:class="n.read
				? 'bg-gray-50 dark:bg-gray-700/30'
				: 'bg-blue-50 dark:bg-blue-900/20'"
				@click="markRead(n.id)"
			>
				<div class="flex gap-3">
					<span
						:class="[getIcon(n.type), getColor(n.type), 'w-5 h-5 mt-0.5']"
					/>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="text-gray-900 dark:text-white text-sm font-medium">{{
								n.title
							}}</span>
							<span v-if="!n.read" class="w-2 h-2 bg-blue-500 rounded-full" />
						</div>
						<p class="text-gray-600 dark:text-gray-400 text-sm">
							{{ n.message }}
						</p>
						<p class="text-gray-500 dark:text-gray-500 text-xs mt-1">
							{{ n.time }}
						</p>
					</div>
				</div>
			</div>
			<div
				v-if="filteredNotifications.length === 0"
				class="text-center text-gray-500 dark:text-gray-400 py-8 text-sm"
			>
				No notifications
			</div>
		</div>
	</div>
</template>
