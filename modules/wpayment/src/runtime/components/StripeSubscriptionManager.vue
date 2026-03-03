<template>
	<div class="stripe-subscription-manager">
		<div class="manager-header">
			<h2 class="manager-title">{{ title }}</h2>
			<div class="manager-actions">
				<button class="btn-primary" @click="showUpgradeModal = true">Upgrade Plan</button>
			</div>
		</div>

		<div class="current-plan" v-if="currentSubscription">
			<div class="plan-header">
				<span class="plan-name">{{ currentPlan?.name || 'Current Plan' }}</span>
				<span :class="['plan-status', currentSubscription.status]">{{ currentSubscription.status }}</span>
			</div>
			<div class="plan-details">
				<div class="plan-price">
					<span class="price-amount">{{ formatCurrency(currentPlan?.amount || 0) }}</span>
					<span class="price-interval">/ {{ currentPlan?.interval }}</span>
				</div>
				<div class="plan-billing">
					<span class="billing-label">Next billing:</span>
					<span class="billing-date">{{ formatDate(currentSubscription.current_period_end) }}</span>
				</div>
			</div>
		</div>

		<div class="plan-features" v-if="currentPlan">
			<h3 class="features-title">Plan Features</h3>
			<ul class="features-list">
				<li v-for="feature in currentPlan.features" :key="feature" class="feature-item">
					<span class="feature-icon">✓</span>
					<span class="feature-text">{{ feature }}</span>
				</li>
			</ul>
		</div>

		<div class="subscription-actions">
			<button class="btn-secondary" @click="showPauseModal = true" :disabled="currentSubscription?.status !== 'active'">
				Pause Subscription
			</button>
			<button class="btn-danger" @click="showCancelModal = true" :disabled="cancelDisabled">
				Cancel Subscription
			</button>
		</div>

		<div v-if="showUpgradeModal" class="modal-overlay" @click.self="showUpgradeModal = false">
			<div class="modal-content">
				<h3 class="modal-title">Choose a Plan</h3>
				<div class="plans-grid">
					<div v-for="plan in availablePlans" :key="plan.id" :class="['plan-card', { popular: plan.popular, current: plan.id === currentPlan?.id }]" @click="selectPlan(plan)">
						<span v-if="plan.popular" class="popular-badge">Popular</span>
						<span v-if="plan.id === currentPlan?.id" class="current-badge">Current</span>
						<h4 class="card-name">{{ plan.name }}</h4>
						<div class="card-price">
							<span class="price">{{ formatCurrency(plan.amount) }}</span>
							<span class="interval">/{{ plan.interval }}</span>
						</div>
						<ul class="card-features">
							<li v-for="feature in plan.features.slice(0, 3)" :key="feature">{{ feature }}</li>
						</ul>
					</div>
				</div>
				<div class="modal-actions">
					<button class="btn-secondary" @click="showUpgradeModal = false">Cancel</button>
					<button class="btn-primary" @click="confirmUpgrade" :disabled="!selectedPlan || selectedPlan?.id === currentPlan?.id">
						Confirm Change
					</button>
				</div>
			</div>
		</div>

		<div v-if="showCancelModal" class="modal-overlay" @click.self="showCancelModal = false">
			<div class="modal-content cancel-modal">
				<h3 class="modal-title">Cancel Subscription</h3>
				<p class="cancel-warning">Are you sure you want to cancel your subscription?</p>
				<div class="feedback-section">
					<label class="feedback-label">Why are you canceling?</label>
					<select v-model="cancelReason" class="feedback-select">
						<option value="too_expensive">Too expensive</option>
						<option value="missing_features">Missing features</option>
						<option value="switching_service">Switching to another service</option>
						<option value="unused">Not using it enough</option>
						<option value="other">Other</option>
					</select>
					<textarea v-model="cancelComment" class="feedback-textarea" placeholder="Additional comments (optional)" />
				</div>
				<div class="modal-actions">
					<button class="btn-secondary" @click="showCancelModal = false">Keep Subscription</button>
					<button class="btn-danger" @click="confirmCancel">Cancel Subscription</button>
				</div>
			</div>
		</div>

		<div v-if="showPauseModal" class="modal-overlay" @click.self="showPauseModal = false">
			<div class="modal-content">
				<h3 class="modal-title">Pause Subscription</h3>
				<p class="pause-info">Your subscription will be paused and you won't be charged.</p>
				<div class="modal-actions">
					<button class="btn-secondary" @click="showPauseModal = false">Cancel</button>
					<button class="btn-primary" @click="confirmPause">Pause Subscription</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { SubscriptionSummary, SubscriptionPlan, CancellationFeedback } from "#wpayment/types";

interface Props {
	title?: string;
	currentSubscription?: SubscriptionSummary | null;
	currentPlan?: SubscriptionPlan | null;
	availablePlans?: SubscriptionPlan[];
}

const props = withDefaults(defineProps<Props>(), {
	title: "Subscription Management",
	currentSubscription: null,
	currentPlan: null,
	availablePlans: () => [],
});

const emit = defineEmits<{
	upgrade: [planId: string];
	downgrade: [planId: string];
	cancel: [feedback: CancellationFeedback];
	pause: [];
	resume: [];
}>();

const showUpgradeModal = ref(false);
const showCancelModal = ref(false);
const showPauseModal = ref(false);
const selectedPlan = ref<SubscriptionPlan | null>(null);
const cancelReason = ref<CancellationFeedback["category"]>("other");
const cancelComment = ref("");

const cancelDisabled = computed(() => {
	return !props.currentSubscription || props.currentSubscription.status === "canceled";
});

const selectPlan = (plan: SubscriptionPlan) => {
	selectedPlan.value = plan;
};

const confirmUpgrade = () => {
	if (!selectedPlan.value || selectedPlan.value.id === props.currentPlan?.id) return;

	const isUpgrade = (selectedPlan.value.amount || 0) > (props.currentPlan?.amount || 0);

	if (isUpgrade) {
		emit("upgrade", selectedPlan.value.id);
	} else {
		emit("downgrade", selectedPlan.value.id);
	}

	showUpgradeModal.value = false;
};

const confirmCancel = () => {
	emit("cancel", {
		category: cancelReason.value,
		comment: cancelComment.value || undefined,
	});
	showCancelModal.value = false;
};

const confirmPause = () => {
	emit("pause");
	showPauseModal.value = false;
};

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount / 100);
};

const formatDate = (timestamp: number): string => {
	return new Date(timestamp * 1000).toLocaleDateString();
};
</script>

<style scoped>
.stripe-subscription-manager {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	max-width: 600px;
}

.manager-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.manager-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.current-plan {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 16px;
}

.plan-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.plan-name {
	font-size: 20px;
	font-weight: 600;
}

.plan-status {
	font-size: 12px;
	padding: 4px 8px;
	border-radius: 4px;
	text-transform: capitalize;
}

.plan-status.active {
	background: #d1fae5;
	color: #065f46;
}

.plan-status.canceled {
	background: #fee2e2;
	color: #991b1b;
}

.plan-status.past_due {
	background: #fef3c7;
	color: #92400e;
}

.plan-status.paused {
	background: #e0e7ff;
	color: #3730a3;
}

.plan-details {
	display: flex;
	justify-content: space-between;
}

.plan-price {
	display: flex;
	align-items: baseline;
	gap: 4px;
}

.price-amount {
	font-size: 28px;
	font-weight: 600;
}

.price-interval {
	font-size: 14px;
	color: #666;
}

.plan-billing {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.billing-label {
	font-size: 12px;
	color: #666;
}

.billing-date {
	font-size: 14px;
	font-weight: 500;
}

.plan-features {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 16px;
}

.features-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 12px 0;
}

.features-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.feature-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 0;
}

.feature-icon {
	color: #10b981;
}

.feature-text {
	font-size: 14px;
}

.subscription-actions {
	display: flex;
	gap: 12px;
}

.btn-primary,
.btn-secondary,
.btn-danger {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
}

.btn-primary {
	background: #635bff;
	color: white;
	border: none;
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

.btn-secondary:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-danger {
	background: #ef4444;
	color: white;
	border: none;
}

.btn-danger:hover {
	background: #dc2626;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 600px;
	max-height: 80vh;
	overflow-y: auto;
}

.modal-title {
	font-size: 20px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.plans-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	margin-bottom: 16px;
}

.plan-card {
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
	cursor: pointer;
	position: relative;
	transition: border-color 0.2s;
}

.plan-card:hover {
	border-color: #635bff;
}

.plan-card.selected {
	border-color: #635bff;
}

.plan-card.current {
	border-color: #10b981;
	cursor: default;
}

.popular-badge,
.current-badge {
	position: absolute;
	top: -8px;
	right: 12px;
	font-size: 10px;
	padding: 2px 8px;
	border-radius: 4px;
}

.popular-badge {
	background: #635bff;
	color: white;
}

.current-badge {
	background: #10b981;
	color: white;
}

.card-name {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 8px 0;
}

.card-price {
	display: flex;
	align-items: baseline;
	gap: 4px;
	margin-bottom: 12px;
}

.card-price .price {
	font-size: 24px;
	font-weight: 600;
}

.card-price .interval {
	font-size: 12px;
	color: #666;
}

.card-features {
	list-style: none;
	padding: 0;
	margin: 0;
	font-size: 12px;
	color: #666;
}

.card-features li {
	padding: 4px 0;
}

.cancel-modal .cancel-warning {
	font-size: 14px;
	color: #666;
	margin: 0 0 16px 0;
}

.feedback-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 16px;
}

.feedback-label {
	font-size: 14px;
	font-weight: 500;
}

.feedback-select {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.feedback-textarea {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	min-height: 80px;
	resize: vertical;
}

.pause-info {
	font-size: 14px;
	color: #666;
	margin: 0 0 16px 0;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
}
</style>
