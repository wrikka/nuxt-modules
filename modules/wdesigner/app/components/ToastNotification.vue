<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	type: "success" | "error" | "warning" | "info";
	message: string;
	duration?: number;
}>();

const emit = defineEmits<{
	close: [];
}>();

const visible = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

watch(() => props.show, (newVal) => {
	if (newVal) {
		visible.value = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			visible.value = false;
			emit("close");
		}, props.duration || 3000);
	} else {
		visible.value = false;
	}
}, { immediate: true });

const icons = {
	success: "M5 13l4 4L19 7",
	error: "M6 18L18 6M6 6l12 12",
	warning:
		"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
	info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const colors = {
	success:
		"bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200",
	error:
		"bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200",
	warning:
		"bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200",
	info:
		"bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200",
};
</script>

<template>
	<Transition
		enter-active-class="transform ease-out duration-300 transition"
		enter-from-class="translate-y-2 opacity-0"
		enter-to-class="translate-y-0 opacity-100"
		leave-active-class="transition ease-in duration-200"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div
			v-if="visible"
			class="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 max-w-md"
			:class="colors[type]"
			role="alert"
		>
			<svg
				class="w-5 h-5 shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					:d="icons[type]"
				/>
			</svg>
			<span class="text-sm font-medium">{{ message }}</span>
			<button @click="$emit('close')" class="ml-2 hover:opacity-70">
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</Transition>
</template>
