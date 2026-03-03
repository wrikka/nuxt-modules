<template>
	<div class="stripe-payment-wizard">
		<div class="wizard-progress" v-if="showProgress">
			<div class="progress-bar">
				<div class="progress-fill" :style="{ width: progressPercentage }" />
			</div>
			<div class="progress-steps">
				<div v-for="(step, index) in steps" :key="step.id" :class="['progress-step', getStepClass(step, index)]">
					<span class="step-number">{{ index + 1 }}</span>
					<span class="step-label">{{ step.title }}</span>
				</div>
			</div>
		</div>

		<div class="wizard-content">
			<div v-if="currentStepData" class="step-content">
				<h2 class="step-title">{{ currentStepData.title }}</h2>
				<p class="step-description" v-if="currentStepData.description">{{ currentStepData.description }}</p>

				<slot :name="currentStepData.id" :data="stepData" :update="updateStepData">
					<div class="default-content">
						<p>Configure this step in the slot: {{ currentStepData.id }}</p>
					</div>
				</slot>
			</div>
		</div>

		<div class="wizard-actions">
			<button v-if="canGoBack" class="btn-back" @click="goBack">
				← Back
			</button>
			<div class="actions-spacer" />
			<button v-if="canSkip && currentStepData?.optional" class="btn-skip" @click="skipStep">
				Skip
			</button>
			<button class="btn-next" @click="goNext" :disabled="!isCurrentStepValid">
				{{ isLastStep ? 'Complete' : 'Next →' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { WizardStep, WizardState } from "#wpayment/types";

interface Props {
	steps: WizardStep[];
	showProgress?: boolean;
	allowSkip?: boolean;
	initialData?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
	showProgress: true,
	allowSkip: true,
	initialData: () => ({}),
});

const emit = defineEmits<{
	complete: [data: Record<string, any>];
	cancel: [];
	stepChange: [stepIndex: number];
}>();

const currentStepIndex = ref(0);
const stepData = ref<Record<string, any>>({ ...props.initialData });
const stepErrors = ref<Record<string, string[]>>({});

const currentStepData = computed(() => {
	return props.steps[currentStepIndex.value] || null;
});

const isLastStep = computed(() => {
	return currentStepIndex.value === props.steps.length - 1;
});

const canGoBack = computed(() => {
	return currentStepIndex.value > 0;
});

const canSkip = computed(() => {
	return props.allowSkip;
});

const progressPercentage = computed(() => {
	return `${((currentStepIndex.value + 1) / props.steps.length) * 100}%`;
});

const isCurrentStepValid = computed(() => {
	const step = currentStepData.value;
	if (!step) return false;
	return step.status !== "error" && !stepErrors.value[step.id]?.length;
});

const getStepClass = (step: WizardStep, index: number): string => {
	if (index < currentStepIndex.value) return "completed";
	if (index === currentStepIndex.value) return "active";
	if (step.status === "error") return "error";
	return "";
};

const updateStepData = (data: Record<string, any>) => {
	stepData.value = {
		...stepData.value,
		...data,
	};
};

const goBack = () => {
	if (currentStepIndex.value > 0) {
		currentStepIndex.value--;
		emit("stepChange", currentStepIndex.value);
	}
};

const goNext = () => {
	if (!isCurrentStepValid.value) return;

	if (isLastStep.value) {
		emit("complete", stepData.value);
	} else {
		currentStepIndex.value++;
		emit("stepChange", currentStepIndex.value);
	}
};

const skipStep = () => {
	if (isLastStep.value) {
		emit("complete", stepData.value);
	} else {
		currentStepIndex.value++;
		emit("stepChange", currentStepIndex.value);
	}
};

defineExpose({
	currentStepIndex,
	stepData,
	goBack,
	goNext,
	skipStep,
	updateStepData,
});
</script>

<style scoped>
.stripe-payment-wizard {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	max-width: 600px;
	margin: 0 auto;
}

.wizard-progress {
	margin-bottom: 32px;
}

.progress-bar {
	height: 4px;
	background: #e0e0e0;
	border-radius: 2px;
	margin-bottom: 16px;
}

.progress-fill {
	height: 100%;
	background: #635bff;
	border-radius: 2px;
	transition: width 0.3s ease;
}

.progress-steps {
	display: flex;
	justify-content: space-between;
}

.progress-step {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.step-number {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #e0e0e0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-weight: 600;
	color: #666;
}

.progress-step.completed .step-number {
	background: #10b981;
	color: white;
}

.progress-step.active .step-number {
	background: #635bff;
	color: white;
}

.progress-step.error .step-number {
	background: #ef4444;
	color: white;
}

.step-label {
	font-size: 12px;
	color: #666;
	text-align: center;
}

.progress-step.completed .step-label,
.progress-step.active .step-label {
	color: #333;
}

.wizard-content {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 32px;
	margin-bottom: 24px;
	min-height: 300px;
}

.step-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0 0 8px 0;
}

.step-description {
	font-size: 14px;
	color: #666;
	margin: 0 0 24px 0;
}

.default-content {
	padding: 40px;
	text-align: center;
	color: #666;
}

.wizard-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.actions-spacer {
	flex: 1;
}

.btn-back,
.btn-skip,
.btn-next {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
}

.btn-back {
	background: white;
	border: 1px solid #e0e0e0;
	color: #333;
}

.btn-back:hover {
	background: #f5f5f5;
}

.btn-skip {
	background: transparent;
	border: none;
	color: #666;
}

.btn-skip:hover {
	color: #333;
}

.btn-next {
	background: #635bff;
	color: white;
	border: none;
}

.btn-next:hover:not(:disabled) {
	background: #4a4bd9;
}

.btn-next:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>
