<template>
	<div class="stripe-connect-onboarding">
		<div class="onboarding-header">
			<h2 class="onboarding-title">{{ title }}</h2>
			<p class="onboarding-description">{{ description }}</p>
		</div>

		<div class="account-status" v-if="account">
			<div class="status-indicator" :class="accountStatus">
				<span class="status-dot" />
				<span class="status-text">{{ statusLabel }}</span>
			</div>

			<div class="account-info">
				<div class="info-row">
					<span class="info-label">Account ID</span>
					<span class="info-value">{{ account.id }}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Business Type</span>
					<span class="info-value">{{ account.business_type || 'Not set' }}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Country</span>
					<span class="info-value">{{ account.country }}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Charges</span>
					<span :class="['info-value', account.charges_enabled ? 'enabled' : 'disabled']">
						{{ account.charges_enabled ? 'Enabled' : 'Disabled' }}
					</span>
				</div>
				<div class="info-row">
					<span class="info-label">Payouts</span>
					<span :class="['info-value', account.payouts_enabled ? 'enabled' : 'disabled']">
						{{ account.payouts_enabled ? 'Enabled' : 'Disabled' }}
					</span>
				</div>
			</div>
		</div>

		<div class="requirements-section" v-if="requirements && requirements.length > 0">
			<h3 class="section-title">Requirements</h3>
			<div class="requirements-list">
				<div v-for="req in requirements" :key="req" class="requirement-item">
					<span class="requirement-icon">!</span>
					<span class="requirement-text">{{ formatRequirement(req) }}</span>
				</div>
			</div>
		</div>

		<div class="capabilities-section" v-if="capabilities">
			<h3 class="section-title">Capabilities</h3>
			<div class="capabilities-grid">
				<div v-for="(status, cap) in capabilities" :key="cap" class="capability-item">
					<span class="capability-name">{{ formatCapability(cap) }}</span>
					<span :class="['capability-status', status]">{{ status }}</span>
				</div>
			</div>
		</div>

		<div class="onboarding-actions">
			<button v-if="showOnboardingButton" class="btn-primary" @click="startOnboarding" :disabled="loading">
				{{ loading ? 'Loading...' : onboardingButtonText }}
			</button>
			<button v-if="showDashboardButton && account" class="btn-secondary" @click="openDashboard" :disabled="loading">
				Open Dashboard
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ConnectAccount, ConnectCapabilities, ConnectRequirements } from "#wpayment/types";

interface Props {
	title?: string;
	description?: string;
	account?: ConnectAccount | null;
	onboardingUrl?: string;
	dashboardUrl?: string;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Stripe Connect",
	description: "Set up your Stripe Connect account to start accepting payments",
	account: null,
	loading: false,
});

const emit = defineEmits<{
	startOnboarding: [];
	openDashboard: [];
}>();

const loading = ref(false);

const accountStatus = computed(() => {
	if (!props.account) return "pending";
	if (props.account.charges_enabled && props.account.payouts_enabled) return "active";
	if (props.account.requirements?.currently_due?.length) return "restricted";
	return "pending";
});

const statusLabel = computed(() => {
	const labels: Record<string, string> = {
		active: "Active",
		pending: "Pending",
		restricted: "Restricted",
	};
	return labels[accountStatus.value] || "Unknown";
});

const requirements = computed(() => {
	return props.account?.requirements?.currently_due || [];
});

const capabilities = computed(() => {
	return props.account?.capabilities || null;
});

const showOnboardingButton = computed(() => {
	return !props.account || !props.account.details_submitted;
});

const showDashboardButton = computed(() => {
	return props.account && props.account.details_submitted;
});

const onboardingButtonText = computed(() => {
	return props.account ? "Complete Onboarding" : "Start Onboarding";
});

const startOnboarding = () => {
	emit("startOnboarding");
};

const openDashboard = () => {
	emit("openDashboard");
};

const formatRequirement = (req: string): string => {
	const labels: Record<string, string> = {
		"individual.first_name": "Individual first name",
		"individual.last_name": "Individual last name",
		"individual.dob.day": "Date of birth (day)",
		"individual.dob.month": "Date of birth (month)",
		"individual.dob.year": "Date of birth (year)",
		"individual.address.city": "Address city",
		"individual.address.line1": "Address line 1",
		"individual.address.postal_code": "Postal code",
		"individual.ssn_last_4": "SSN last 4 digits",
		"tos_acceptance.date": "Terms of Service acceptance",
		"tos_acceptance.ip": "Terms of Service IP",
	};
	return labels[req] || req;
};

const formatCapability = (cap: string): string => {
	const labels: Record<string, string> = {
		card_payments: "Card Payments",
		transfers: "Transfers",
		legacy_payments: "Legacy Payments",
	};
	return labels[cap] || cap;
};
</script>

<style scoped>
.stripe-connect-onboarding {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	max-width: 600px;
}

.onboarding-header {
	margin-bottom: 24px;
}

.onboarding-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0 0 8px 0;
}

.onboarding-description {
	font-size: 14px;
	color: #666;
	margin: 0;
}

.account-status {
	margin-bottom: 24px;
}

.status-indicator {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 16px;
	border-radius: 8px;
	margin-bottom: 16px;
}

.status-indicator.active {
	background: #d1fae5;
}

.status-indicator.pending {
	background: #fef3c7;
}

.status-indicator.restricted {
	background: #fee2e2;
}

.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.status-indicator.active .status-dot {
	background: #10b981;
}

.status-indicator.pending .status-dot {
	background: #f59e0b;
}

.status-indicator.restricted .status-dot {
	background: #ef4444;
}

.status-text {
	font-weight: 500;
}

.account-info {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 8px 0;
	border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	color: #666;
	font-size: 14px;
}

.info-value {
	font-weight: 500;
	font-size: 14px;
}

.info-value.enabled {
	color: #10b981;
}

.info-value.disabled {
	color: #ef4444;
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 12px 0;
}

.requirements-section {
	margin-bottom: 24px;
}

.requirements-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.requirement-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px;
	background: #fef3c7;
	border-radius: 6px;
}

.requirement-icon {
	width: 20px;
	height: 20px;
	background: #f59e0b;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: 600;
}

.requirement-text {
	font-size: 14px;
}

.capabilities-section {
	margin-bottom: 24px;
}

.capabilities-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.capability-item {
	display: flex;
	justify-content: space-between;
	padding: 12px;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
}

.capability-name {
	font-weight: 500;
}

.capability-status {
	font-size: 12px;
	padding: 4px 8px;
	border-radius: 4px;
	text-transform: capitalize;
}

.capability-status.active {
	background: #d1fae5;
	color: #065f46;
}

.capability-status.pending {
	background: #fef3c7;
	color: #92400e;
}

.capability-status.inactive {
	background: #fee2e2;
	color: #991b1b;
}

.onboarding-actions {
	display: flex;
	gap: 12px;
}

.btn-primary,
.btn-secondary {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	border: none;
}

.btn-primary {
	background: #635bff;
	color: white;
}

.btn-primary:hover:not(:disabled) {
	background: #4a4bd9;
}

.btn-primary:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-secondary {
	background: white;
	color: #333;
	border: 1px solid #e0e0e0;
}

.btn-secondary:hover:not(:disabled) {
	background: #f5f5f5;
}
</style>
