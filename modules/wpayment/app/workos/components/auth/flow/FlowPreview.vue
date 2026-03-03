<script setup lang="ts">
import type { FlowStep } from "../../../types/flow"
import WorkOSButton from "../base/WorkOSButton.vue"

const props = defineProps<{
	steps: FlowStep[]
	show: boolean
}>()

const emit = defineEmits<{
	close: []
}>()

const previewStep = ref(0)

const nextPreviewStep = () => {
	if (previewStep.value < props.steps.length) {
		previewStep.value++
	}
}

const resetPreview = () => {
	previewStep.value = 0
}

watch(() => props.show, (show) => {
	if (show) previewStep.value = 0
})
</script>

<template>
	<WorkOSModal :show="show" title="Flow Preview" large @close="emit('close')">
		<div class="preview-container">
			<div class="preview-phone">
				<div class="preview-header"><span>Login</span></div>
				<div class="preview-content">
					<div v-if="previewStep < steps.length" class="preview-step">
						<span class="preview-icon">{{ steps[previewStep]?.icon }}</span>
						<h4>{{ steps[previewStep]?.name }}</h4>
						<WorkOSButton variant="primary" @click="nextPreviewStep">Continue</WorkOSButton>
					</div>
					<div v-else class="preview-complete">
						<span class="complete-icon">✓</span>
						<h4>Login Complete!</h4>
					</div>
				</div>
			</div>
			<div class="preview-controls">
				<span>Step {{ previewStep + 1 }} of {{ steps.length }}</span>
				<WorkOSButton variant="secondary" sm @click="resetPreview">Reset</WorkOSButton>
			</div>
		</div>
	</WorkOSModal>
</template>

<style scoped>
.preview-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.preview-phone {
	width: 280px;
	background: #1f2937;
	border-radius: 24px;
	padding: 0.75rem;
}

.preview-header {
	background: #374151;
	padding: 0.75rem;
	border-radius: 16px 16px 0 0;
	text-align: center;
	color: white;
	font-weight: 500;
}

.preview-content {
	background: white;
	border-radius: 0 0 16px 16px;
	padding: 2rem;
	min-height: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}

.preview-icon {
	font-size: 3rem;
}

.preview-step h4 {
	margin: 0;
	color: #1f2937;
}

.preview-complete {
	text-align: center;
}

.complete-icon {
	display: inline-block;
	width: 48px;
	height: 48px;
	line-height: 48px;
	background: #d1fae5;
	color: #059669;
	border-radius: 50%;
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
}

.preview-controls {
	display: flex;
	align-items: center;
	gap: 1rem;
	color: #6b7280;
	font-size: 0.875rem;
}
</style>
