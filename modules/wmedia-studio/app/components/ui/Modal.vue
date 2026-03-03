<script setup lang="ts">
interface Props {
	show: boolean;
	size?: "sm" | "md" | "lg" | "xl";
	closable?: boolean;
	closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	size: "md",
	closable: true,
	closeOnBackdrop: true,
});

const emit = defineEmits<{
	close: [];
}>();

const sizeClasses = computed(() => {
	const sizes = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
	};
	return sizes[props.size];
});

const handleClose = () => {
	emit("close");
};

const handleBackdropClick = () => {
	if (props.closeOnBackdrop) {
		handleClose();
	}
};

onMounted(() => {
	document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleEscape);
});

const handleEscape = (e: KeyboardEvent) => {
	if (e.key === "Escape" && props.show) {
		handleClose();
	}
};
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="show"
				class="fixed inset-0 z-50 flex items-center justify-center"
				@click.self="handleBackdropClick"
			>
				<div class="absolute inset-0 bg-black bg-opacity-50"></div>
				<div
					:class="[
						'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4',
						sizeClasses,
					]"
					@click.stop
				>
					<div
						v-if="$slots.header"
						class="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
					>
						<slot name="header" />
					</div>
					<div class="px-6 py-4">
						<slot />
					</div>
					<div
						v-if="$slots.footer"
						class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2"
					>
						<slot name="footer" />
					</div>
					<button
						v-if="closable"
						class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
						@click="handleClose"
					>
						✕
					</button>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active > div > div,
.modal-leave-active > div > div {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div > div,
.modal-leave-to > div > div {
	transform: scale(0.95);
	opacity: 0;
}
</style>
