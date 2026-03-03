<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	type?: "info" | "warning" | "danger" | "success";
}>();

const emit = defineEmits<{
	close: [];
	confirm: [];
	cancel: [];
}>();

const colors = {
	info: "bg-blue-500",
	warning: "bg-yellow-500",
	danger: "bg-red-500",
	success: "bg-green-500",
};

const icons = {
	info: "mdi:information",
	warning: "mdi:alert",
	danger: "mdi:alert-circle",
	success: "mdi:check-circle",
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
			<div class="flex items-start gap-4">
				<div
					:class="[
						'w-12 h-12 rounded-full flex items-center justify-center',
						colors[type || 'info'].replace('bg-', 'bg-opacity-20 ').replace(
							'500',
							'100',
						),
					]"
					class="bg-opacity-20"
				>
					<Icon
						:name="icons[type || 'info']"
						:class="['w-6 h-6', colors[type || 'info'].replace('bg-', 'text-')]"
					/>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{{ title || "Confirm" }}
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
						{{ message || "Are you sure?" }}
					</p>
				</div>
			</div>
			<div class="flex gap-3 mt-6">
				<button
					@click='emit("cancel");
					emit("close");'
					class="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
				>
					{{ cancelText || "Cancel" }}
				</button>
				<button
					@click='emit("confirm");
					emit("close");'
					:class="[
						'flex-1 py-2.5 text-white rounded-lg font-medium',
						colors[type || 'info'],
					]"
				>
					{{ confirmText || "Confirm" }}
				</button>
			</div>
		</div>
	</div>
</template>
