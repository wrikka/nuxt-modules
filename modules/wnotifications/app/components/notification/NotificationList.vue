<script setup lang="ts">
import type { Notification } from "../../types";
import NotificationItem from "./NotificationItem.vue";

const props = defineProps<{
	notifications: Notification[]
	groupedNotifications: Record<string, Notification[]>
	selectedIds: Set<string>
	isBulkSelectMode: boolean
	maxHeight: string
}>()

const emit = defineEmits<{
	click: [notification: Notification]
	toggle: [id: string]
	dismiss: [id: string]
}>()
</script>

<template>
	<div class="overflow-y-auto" :style="{ maxHeight }">
		<div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-500">
			<div class="i-heroicons-bell-slash mb-3 h-12 w-12" />
			<p>No notifications</p>
		</div>
		<template v-else>
			<div v-for="priority in ['urgent', 'high', 'normal', 'low']" :key="priority">
				<div v-if="groupedNotifications[priority].length > 0" class="border-b px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:border-gray-700">
					{{ priority }}
				</div>
				<NotificationItem
					v-for="notification in groupedNotifications[priority]"
					:key="notification.id"
					:notification="notification"
					:selected="selectedIds.has(notification.id)"
					:show-checkbox="isBulkSelectMode"
					@click="emit('click', notification)"
					@toggle="emit('toggle', notification.id)"
					@dismiss="emit('dismiss', notification.id)"
				/>
			</div>
		</template>
	</div>
</template>
