<template>
	<div ref="cardElement" class="stripe-card">
		<div v-if="loading" class="loading">Loading payment form...</div>
		<div v-if="error" class="error">{{ error }}</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useStripe, useStripeElements } from "#wpayment";

interface Props {
	options?: {
		hidePostalCode?: boolean;
		disabled?: boolean;
		style?: Record<string, any>;
	};
	theme?: "stripe" | "night" | "flat" | "none";
	variant?: "default" | "outlined" | "filled";
}

const props = withDefaults(defineProps<Props>(), {
	options: () => ({}),
	theme: "stripe",
	variant: "default",
});

const emit = defineEmits<{
	ready: [];
	focus: [];
	blur: [];
	change: [event: any];
	escape: [];
	click: [];
	loaderror: [error: any];
}>();

const { stripe, initialize, loading, error } = useStripe();
const { createElement, getElement, destroy } = useStripeElements();

const cardElement = ref<HTMLElement>();
let cardElementInstance: any = null;

// Initialize card element
const initializeCard = async () => {
	if (!stripe.value || !cardElement.value) return;

	await initialize();

	const options = {
		hidePostalCode: false,
		disabled: false,
		style: {
			base: {
				fontSize: "16px",
				color: "#424770",
				"::placeholder": {
					color: "#aab7c4",
				},
			},
		},
		...props.options,
	};

	cardElementInstance = createElement("card", options);
	if (cardElementInstance) {
		cardElementInstance.mount(cardElement.value);

		// Event listeners
		cardElementInstance.on("ready", () => emit("ready"));
		cardElementInstance.on("focus", () => emit("focus"));
		cardElementInstance.on("blur", () => emit("blur"));
		cardElementInstance.on("change", (event: any) => emit("change", event));
		cardElementInstance.on("escape", () => emit("escape"));
		cardElementInstance.on("click", () => emit("click"));
		cardElementInstance.on("loaderror", (error: any) => emit("loaderror", error));
	}
};

// Watch for changes
watch(
	() => [props.options, props.theme, props.variant],
	() => {
		if (cardElementInstance) {
			cardElementInstance.update(props.options);
		}
	},
	{ deep: true }
);

onMounted(() => {
	initializeCard();
});

onUnmounted(() => {
	if (cardElementInstance) {
		cardElementInstance.destroy();
		cardElementInstance = null;
	}
});

// Expose methods
defineExpose({
	getElement: () => cardElementInstance,
	focus: () => cardElementInstance?.focus(),
	blur: () => cardElementInstance?.blur(),
	clear: () => cardElementInstance?.clear(),
});
</script>

<style scoped>
.stripe-card {
	width: 100%;
}

.loading {
	padding: 12px;
	text-align: center;
	color: #666;
}

.error {
	padding: 12px;
	background-color: #fee;
	border: 1px solid #fcc;
	border-radius: 4px;
	color: #c33;
	font-size: 14px;
}
</style>
