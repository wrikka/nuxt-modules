<script setup lang="ts">
interface Props {
	type?: "button" | "submit" | "reset";
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	type: "button",
	variant: "primary",
	size: "md",
	disabled: false,
	loading: false,
});

defineEmits<{
	click: [event: MouseEvent];
}>();

const variantClasses = computed(() => {
	const variants = {
		primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
		secondary:
			"bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
		danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
		ghost:
			"bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
	};
	return variants[props.variant];
});

const sizeClasses = computed(() => {
	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};
	return sizes[props.size];
});

const disabledClasses = computed(() => {
	if (props.disabled || props.loading) {
		return "opacity-50 cursor-not-allowed";
	}
	return "";
});
</script>

<template>
	<button
		:type="type"
		:disabled="disabled || loading"
		:class="[
			'px-4 py-2 rounded-lg font-medium transition-all duration-200',
			'focus:outline-none focus:ring-2 focus:ring-offset-2',
			variantClasses,
			disabledClasses,
		]"
		@click="$emit('click', $event)"
	>
		<span v-if="loading" class="inline-block animate-spin mr-2">⟳</span>
		<slot />
	</button>
</template>
