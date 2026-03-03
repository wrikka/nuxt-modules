<template>
	<div ref="elementsContainer" class="stripe-elements">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useStripe, useStripeElements } from "#wpayment";

interface Props {
	elementsOptions?: Record<string, any>;
	theme?: "stripe" | "night" | "flat" | "none";
	variant?: "default" | "outlined" | "filled";
	appearance?: {
		theme?: string;
		variables?: Record<string, string>;
		rules?: Record<string, any>;
	};
}

const props = withDefaults(defineProps<Props>(), {
	elementsOptions: () => ({}),
	theme: "stripe",
	variant: "default",
});

const emit = defineEmits<{
	ready: [];
	blur: [];
	focus: [];
	change: [event: any];
	escape: [];
	click: [];
	loaderror: [error: any];
	loaderstart: [];
	loaderstart: [];
}>();

const { stripe, initialize } = useStripe();
const { elements, createElement, update, clear } = useStripeElements();

const elementsContainer = ref<HTMLElement>();
const isReady = ref(false);

// Initialize elements
const initializeElements = async () => {
	if (!stripe.value || !elementsContainer.value) return;

	await initialize();

	const elementsOptions = {
		...props.elementsOptions,
		appearance: props.appearance || {
			theme: props.theme,
			variables: {
				colorPrimary: "#0570de",
				colorBackground: "#ffffff",
				colorText: "#30313d",
				colorDanger: "#df1b41",
				fontFamily: "system-ui, sans-serif",
				spacingUnit: "4px",
				borderRadius: "6px",
			},
		},
	};

	update(elementsOptions);
	isReady.value = true;
	emit("ready");
};

// Watch for changes
watch(
	() => [props.elementsOptions, props.theme, props.appearance],
	() => {
		if (isReady.value) {
			initializeElements();
		}
	},
	{ deep: true }
);

onMounted(() => {
	initializeElements();
});

onUnmounted(() => {
	clear();
});

// Expose methods
defineExpose({
	createElement,
	update,
	clear,
	getElements: () => elements.value,
});
</script>

<style scoped>
.stripe-elements {
	width: 100%;
}
</style>
