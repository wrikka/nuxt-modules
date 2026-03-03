<script setup lang="ts">
import type { NotificationType } from "../../types";

const typeIcons: Record<NotificationType, string> = {
	info: "i-heroicons-information-circle",
	success: "i-heroicons-check-circle",
	warning: "i-heroicons-exclamation-triangle",
	error: "i-heroicons-x-circle",
	system: "i-heroicons-cog",
	message: "i-heroicons-chat-bubble-left",
};

const props = defineProps<{
	notification: import("../../types").Notification
	selected: boolean
	showCheckbox: boolean
}>()

const emit = defineEmits<{
	click: []
	toggle: []
	dismiss: []
}>()

const typeClass = computed(() => {
	switch (props.notification.type) {
		case "error": return "bg-red-100 text-red-600 dark:bg-red-900/30";
		case "success": return "bg-green-100 text-green-600 dark:bg-green-900/30";
		case "warning": return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30";
		case "info": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30";
		case "system": return "bg-gray-100 text-gray-600 dark:bg-gray-800";
		case "message": return "bg-purple-100 text-purple-600 dark:bg-purple-900/30";
		default: return "";
	}
});
</script>

<template>
	<div
		class="group cursor-pointer border-b p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
		:class="{ 'bg-blue-50/50 dark:bg-blue-900/10': !notification.read }"
		@click="emit('click')"
	>
		<div class="flex gap-3">
			<div v-if="showCheckbox" class="flex h-10 w-10 flex-shrink-0 items-center justify-center" @click.stop>
				<input type="checkbox" :checked="selected" class="rounded border-gray-300" @change.stop="emit('toggle')" />
			</div>
			<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" :class="typeClass">
				<div :class="typeIcons[notification.type]" class="h-5 w-5" />
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-start justify-between gap-2">
					<p class="truncate font-medium" :class="{ 'font-bold': !notification.read }">{{ notification.title }}</p>
					<span class="flex-shrink-0 text-xs text-gray-400">{{ new Date(notification.createdAt).toLocaleDateString() }}</span>
				</div>
				<p class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{{ notification.message }}</p>
				<div class="mt-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<button class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" @click.stop="emit('dismiss')">Dismiss</button>
					<button v-if="notification.url" class="rounded px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">View details</button>
				</div>
			</div>
			<div v-if="!notification.read" class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
		</div>
	</div>
</template>
