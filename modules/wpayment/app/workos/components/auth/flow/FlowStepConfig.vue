<script setup lang="ts">
import type { FlowStep } from "../../../types/flow"

const props = defineProps<{
	step: FlowStep | null
}>()

const emit = defineEmits<{
	update: [step: FlowStep]
}>()
</script>

<template>
	<div v-if="step" class="config-form">
		<h4>{{ step.name }}</h4>

		<div v-if="step.type === 'sso'" class="form-group">
			<label>SSO Provider</label>
			<select v-model="step.config.provider">
				<option value="google">Google</option>
				<option value="microsoft">Microsoft</option>
				<option value="okta">Okta</option>
				<option value="auth0">Auth0</option>
			</select>
		</div>

		<div v-if="step.type === 'mfa'" class="form-group">
			<label>MFA Method</label>
			<select v-model="step.config.method">
				<option value="totp">TOTP (Authenticator App)</option>
				<option value="sms">SMS</option>
				<option value="email">Email</option>
			</select>
		</div>

		<div v-if="step.type === 'password'" class="form-group">
			<label>Password Requirements</label>
			<div class="checkbox-group">
				<label><input type="checkbox" v-model="step.config.requireUppercase" /> Require uppercase</label>
				<label><input type="checkbox" v-model="step.config.requireNumbers" /> Require numbers</label>
				<label><input type="checkbox" v-model="step.config.requireSpecial" /> Require special chars</label>
			</div>
		</div>

		<div v-if="step.type === 'redirect'" class="form-group">
			<label>Redirect URL</label>
			<input v-model="step.config.url" type="text" placeholder="/dashboard" />
		</div>

		<div v-if="step.type === 'condition'" class="form-group">
			<label>Condition</label>
			<select v-model="step.config.condition">
				<option value="org_member">Is Organization Member</option>
				<option value="admin">Is Admin</option>
				<option value="verified">Email Verified</option>
			</select>
		</div>

		<div class="form-group">
			<label>Step Name</label>
			<input v-model="step.name" type="text" />
		</div>

		<div class="form-group">
			<label><input type="checkbox" v-model="step.required" /> Required Step</label>
		</div>
	</div>
	<div v-else class="no-selection">
		<p>Select a step to configure</p>
	</div>
</template>

<style scoped>
.config-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.config-form h4 {
	margin: 0 0 0.5rem 0;
	color: #1f2937;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-group label {
	font-size: 0.75rem;
	color: #6b7280;
}

.form-group input,
.form-group select {
	padding: 0.5rem;
	border: 1px solid #e5e7eb;
	border-radius: 4px;
	font-size: 0.875rem;
}

.checkbox-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.checkbox-group label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	color: #374151;
}

.no-selection {
	text-align: center;
	padding: 2rem;
	color: #9ca3af;
}
</style>
