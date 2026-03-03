<script setup lang="ts">
import { useFlowBuilder } from "../../../composables/useFlowBuilder"
import WorkOSButton from "./base/WorkOSButton.vue"
import FlowStepConfig from "./flow/FlowStepConfig.vue"
import FlowPreview from "./flow/FlowPreview.vue"

const {
	flowSteps,
	selectedStep,
	availableSteps,
	dragStart,
	dropStep,
	selectStep,
	removeStep,
	loadTemplate,
} = useFlowBuilder()

const showPreview = ref(false)
const previewFlow = () => showPreview.value = true
const saveFlow = () => console.log("Saving flow:", flowSteps.value)
</script>

<template>
	<div class="login-flow-builder">
		<div class="builder-header">
			<h2>Login Flow Builder</h2>
			<div class="header-actions">
				<WorkOSButton variant="secondary" @click="previewFlow">Preview</WorkOSButton>
				<WorkOSButton variant="primary" @click="saveFlow">Save Flow</WorkOSButton>
			</div>
		</div>

		<div class="builder-container">
			<!-- Available Steps Panel -->
			<div class="steps-panel">
				<h3>Available Steps</h3>
				<div class="steps-list">
					<div
						v-for="step in availableSteps"
						:key="step.type"
						class="step-item"
						draggable="true"
						@dragstart="dragStart($event, step)"
					>
						<span class="step-icon">{{ step.icon }}</span>
						<div class="step-info">
							<h4>{{ step.name }}</h4>
							<p>{{ step.description }}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Flow Canvas -->
			<div class="flow-canvas" @dragover.prevent @drop="dropStep">
				<div class="canvas-header">
					<span>Login Flow</span>
					<span class="step-count">{{ flowSteps.length }} steps</span>
				</div>
				<div class="flow-steps">
					<div class="flow-start">
						<div class="start-node"><span>▶</span><span>Start</span></div>
					</div>
					<div v-for="(step, index) in flowSteps" :key="step.id" class="flow-step-wrapper">
						<div class="flow-connector"></div>
						<div :class="['flow-step', step.type]" @click="selectStep(index)">
							<div class="step-header">
								<span class="step-icon">{{ step.icon }}</span>
								<span class="step-title">{{ step.name }}</span>
								<button class="remove-btn" @click.stop="removeStep(index)">✕</button>
							</div>
							<div v-if="step.config" class="step-config">
								<div v-for="(value, key) in step.config" :key="key" class="config-item">
									<span class="config-key">{{ key }}:</span>
									<span class="config-value">{{ value }}</span>
								</div>
							</div>
						</div>
					</div>
					<div v-if="flowSteps.length === 0" class="empty-canvas">
						<p>Drag steps here to build your login flow</p>
					</div>
					<div class="flow-end">
						<div class="flow-connector"></div>
						<div class="end-node"><span>✓</span><span>Complete</span></div>
					</div>
				</div>
			</div>

			<!-- Config Panel -->
			<div class="config-panel">
				<h3>Step Configuration</h3>
				<FlowStepConfig :step="selectedStep" />
			</div>
		</div>

		<!-- Templates -->
		<div class="flow-templates">
			<h3>Templates</h3>
			<div class="templates-list">
				<button class="template-btn" @click="loadTemplate('simple')">Simple Login</button>
				<button class="template-btn" @click="loadTemplate('sso')">SSO Only</button>
				<button class="template-btn" @click="loadTemplate('mfa')">MFA Required</button>
				<button class="template-btn" @click="loadTemplate('enterprise')">Enterprise</button>
			</div>
		</div>

		<FlowPreview :steps="flowSteps" :show="showPreview" @close="showPreview = false" />
	</div>
</template>

<style scoped>
.login-flow-builder {
	max-width: 1400px;
	margin: 0 auto;
	padding: 2rem;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.builder-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.builder-header h2 {
	margin: 0;
	color: #1f2937;
}

.header-actions {
	display: flex;
	gap: 0.75rem;
}

.builder-container {
	display: grid;
	grid-template-columns: 250px 1fr 280px;
	gap: 1.5rem;
	min-height: 500px;
}

.steps-panel,
.config-panel {
	background: #f9fafb;
	border-radius: 8px;
	padding: 1rem;
}

.steps-panel h3,
.config-panel h3 {
	margin: 0 0 1rem 0;
	color: #1f2937;
	font-size: 0.875rem;
}

.steps-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.step-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	background: white;
	border-radius: 6px;
	cursor: grab;
	transition: all 0.2s;
}

.step-item:hover {
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-item .step-icon {
	font-size: 1.25rem;
}

.step-item .step-info h4 {
	margin: 0;
	color: #1f2937;
	font-size: 0.875rem;
}

.step-item .step-info p {
	margin: 0.125rem 0 0 0;
	color: #6b7280;
	font-size: 0.75rem;
}

.flow-canvas {
	background: #f9fafb;
	border-radius: 8px;
	padding: 1.5rem;
	border: 2px dashed #e5e7eb;
}

.canvas-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
	font-weight: 600;
	color: #374151;
}

.step-count {
	color: #6b7280;
	font-weight: 400;
}

.flow-steps {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.flow-start,
.flow-end {
	display: flex;
	justify-content: center;
}

.start-node,
.end-node {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: #10b981;
	color: white;
	border-radius: 9999px;
	font-size: 0.875rem;
}

.end-node {
	background: #2563eb;
}

.flow-connector {
	width: 2px;
	height: 24px;
	background: #d1d5db;
}

.flow-step-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.flow-step {
	background: white;
	border: 2px solid #e5e7eb;
	border-radius: 8px;
	padding: 1rem;
	min-width: 250px;
	cursor: pointer;
	transition: all 0.2s;
}

.flow-step:hover {
	border-color: #2563eb;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flow-step.sso { border-left: 4px solid #10b981; }
.flow-step.password { border-left: 4px solid #f59e0b; }
.flow-step.mfa { border-left: 4px solid #8b5cf6; }
.flow-step.condition { border-left: 4px solid #ec4899; }
.flow-step.redirect { border-left: 4px solid #3b82f6; }
.flow-step.email { border-left: 4px solid #06b6d4; }
.flow-step.consent { border-left: 4px solid #6366f1; }

.step-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.step-header .step-icon {
	font-size: 1.25rem;
}

.step-title {
	flex: 1;
	font-weight: 500;
	color: #1f2937;
}

.remove-btn {
	width: 20px;
	height: 20px;
	border: none;
	background: #fee2e2;
	color: #dc2626;
	border-radius: 50%;
	cursor: pointer;
	font-size: 0.75rem;
}

.step-config {
	margin-top: 0.75rem;
	padding-top: 0.75rem;
	border-top: 1px solid #f3f4f6;
}

.config-item {
	display: flex;
	gap: 0.5rem;
	font-size: 0.75rem;
	margin-bottom: 0.25rem;
}

.config-key {
	color: #6b7280;
}

.config-value {
	color: #374151;
	font-weight: 500;
}

.empty-canvas {
	padding: 3rem;
	text-align: center;
	color: #9ca3af;
}

.flow-templates {
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px solid #e5e7eb;
}

.flow-templates h3 {
	margin: 0 0 1rem 0;
	color: #1f2937;
	font-size: 0.875rem;
}

.templates-list {
	display: flex;
	gap: 0.75rem;
}

.template-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #e5e7eb;
	background: white;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s;
}

.template-btn:hover {
	background: #f9fafb;
	border-color: #2563eb;
}
</style>
