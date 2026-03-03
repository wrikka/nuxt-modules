<template>
	<button
		:disabled="disabled || processing"
		:class="buttonClass"
		@click="handlePayment"
		type="submit"
	>
		<span v-if="processing" class="spinner"></span>
		<span v-if="!processing">{{ text }}</span>
		<span v-else>{{ processingText }}</span>
	</button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStripe } from "#wpayment";

interface Props {
	clientSecret: string;
	text?: string;
	processingText?: string;
	disabled?: boolean;
	elements?: any;
	confirmParams?: Record<string, any>;
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
	text: "Pay",
	processingText: "Processing...",
	disabled: false,
	variant: "default",
	size: "md",
});

const emit = defineEmits<{
	success: [result: any];
	error: [error: any];
	processing: [isProcessing: boolean];
}>();

const { stripe, confirmPayment } = useStripe();

const processing = ref(false);

const buttonClass = computed(() => {
	const base = "stripe-payment-button";
	const classes = [base];

	// Variant
	classes.push(`${base}--${props.variant}`);

	// Size
	classes.push(`${base}--${props.size}`);

	// State
	if (processing.value) classes.push(`${base}--processing`);
	if (props.disabled) classes.push(`${base}--disabled`);

	return classes.join(" ");
});

const handlePayment = async () => {
	if (!stripe.value || processing.value || props.disabled) return;

	processing.value = true;
	emit("processing", true);

	try {
		const result = await confirmPayment(
			props.clientSecret,
			props.elements,
			props.confirmParams
		);

		if (result.error) {
			emit("error", result.error);
		} else {
			emit("success", result);
		}
	} catch (error) {
		emit("error", error);
	} finally {
		processing.value = false;
		emit("processing", false);
	}
};
</script>

<style scoped>
.stripe-payment-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 24px;
	border: none;
	border-radius: 6px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
}

/* Variants */
.stripe-payment-button--default {
	background-color: #0570de;
	color: white;
}

.stripe-payment-button--default:hover:not(:disabled) {
	background-color: #0460c7;
}

.stripe-payment-button--outline {
	background-color: transparent;
	color: #0570de;
	border: 2px solid #0570de;
}

.stripe-payment-button--outline:hover:not(:disabled) {
	background-color: #0570de;
	color: white;
}

.stripe-payment-button--ghost {
	background-color: transparent;
	color: #0570de;
}

.stripe-payment-button--ghost:hover:not(:disabled) {
	background-color: #f0f7ff;
}

/* Sizes */
.stripe-payment-button--sm {
	padding: 8px 16px;
	font-size: 14px;
}

.stripe-payment-button--md {
	padding: 12px 24px;
	font-size: 16px;
}

.stripe-payment-button--lg {
	padding: 16px 32px;
	font-size: 18px;
}

/* States */
.stripe-payment-button--processing {
	opacity: 0.7;
	cursor: not-allowed;
}

.stripe-payment-button--disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.stripe-payment-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* Spinner */
.spinner {
	width: 16px;
	height: 16px;
	border: 2px solid transparent;
	border-top: 2px solid currentColor;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>
