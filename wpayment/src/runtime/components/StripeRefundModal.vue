<template>
	<div class="stripe-refund-modal">
		<div class="modal-header">
			<h2 class="modal-title">Request Refund</h2>
			<button class="close-btn" @click="emit('close')">×</button>
		</div>

		<div class="modal-body">
			<div class="payment-info" v-if="payment">
				<div class="info-row">
					<span class="info-label">Payment ID</span>
					<span class="info-value">{{ payment.id }}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Amount</span>
					<span class="info-value amount">{{ formatCurrency(payment.amount, payment.currency) }}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Customer</span>
					<span class="info-value">{{ payment.customerEmail || 'Guest' }}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Date</span>
					<span class="info-value">{{ formatDate(payment.created) }}</span>
				</div>
			</div>

			<div class="refund-form">
				<div class="form-section">
					<h3 class="section-title">Refund Amount</h3>
					<div class="amount-options">
						<label class="amount-option">
							<input type="radio" v-model="refundType" value="full" />
							<span class="option-label">
								<span class="option-title">Full Refund</span>
								<span class="option-desc">{{ formatCurrency(payment?.amount || 0, payment?.currency) }}</span>
							</span>
						</label>
						<label class="amount-option">
							<input type="radio" v-model="refundType" value="partial" />
							<span class="option-label">
								<span class="option-title">Partial Refund</span>
								<span class="option-desc">Custom amount</span>
							</span>
						</label>
					</div>
					<div v-if="refundType === 'partial'" class="partial-input">
						<label class="field-label">Amount (cents)</label>
						<input v-model.number="refundAmount" type="number" :max="payment?.amount" min="1" class="field-input" />
					</div>
				</div>

				<div class="form-section">
					<h3 class="section-title">Refund Reason</h3>
					<select v-model="refundReason" class="field-select">
						<option value="requested_by_customer">Requested by customer</option>
						<option value="duplicate">Duplicate charge</option>
						<option value="fraudulent">Fraudulent</option>
						<option value="expired_uncaptured_charge">Expired uncaptured charge</option>
						<option value="other">Other</option>
					</select>
					<textarea v-model="reasonDescription" class="field-textarea" placeholder="Additional details (optional)" />
				</div>

				<div class="form-section" v-if="policy">
					<h3 class="section-title">Refund Policy</h3>
					<div class="policy-info">
						<span class="policy-item">Max refund days: {{ policy.maxRefundDays }}</span>
						<span class="policy-item">Partial refunds: {{ policy.allowPartialRefunds ? 'Allowed' : 'Not allowed' }}</span>
						<span v-if="policy.requireApproval" class="policy-item approval">Requires approval for amounts over {{ formatCurrency(policy.approvalThreshold || 0) }}</span>
					</div>
				</div>
			</div>

			<div class="refund-preview">
				<h3 class="preview-title">Refund Preview</h3>
				<div class="preview-details">
					<div class="preview-row">
						<span>Original Amount</span>
						<span>{{ formatCurrency(payment?.amount || 0, payment?.currency) }}</span>
					</div>
					<div class="preview-row refund-amount">
						<span>Refund Amount</span>
						<span>-{{ formatCurrency(preview.refundAmount, payment?.currency) }}</span>
					</div>
					<div class="preview-row" v-if="preview.applicationFeeRefund">
						<span>Application Fee Refund</span>
						<span>-{{ formatCurrency(preview.applicationFeeRefund, payment?.currency) }}</span>
					</div>
					<div class="preview-row total">
						<span>Net Refund</span>
						<span>{{ formatCurrency(preview.netRefund, payment?.currency) }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="modal-footer">
			<button class="btn-secondary" @click="emit('close')">Cancel</button>
			<button class="btn-danger" @click="submitRefund" :disabled="!isValid || processing">
				{{ processing ? 'Processing...' : 'Process Refund' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { RefundFormData, RefundPreview, RefundPolicy, RefundReason, PaymentIntent } from "#wpayment/types";

interface Props {
	payment?: PaymentIntent | null;
	policy?: RefundPolicy | null;
	processing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	payment: null,
	policy: null,
	processing: false,
});

const emit = defineEmits<{
	close: [];
	submit: [data: RefundFormData];
}>();

const refundType = ref<"full" | "partial">("full");
const refundAmount = ref(0);
const refundReason = ref<RefundReason>("requested_by_customer");
const reasonDescription = ref("");

const isValid = computed(() => {
	if (refundType.value === "partial" && refundAmount.value <= 0) return false;
	if (refundType.value === "partial" && refundAmount.value > (props.payment?.amount || 0)) return false;
	return true;
});

const preview = computed<RefundPreview>(() => {
	const amount = refundType.value === "full" ? props.payment?.amount || 0 : refundAmount.value;
	return {
		originalAmount: props.payment?.amount || 0,
		refundAmount: amount,
		currency: props.payment?.currency || "usd",
		netRefund: amount,
	};
});

const submitRefund = () => {
	emit("submit", {
		paymentIntentId: props.payment?.id || "",
		amount: refundType.value === "full" ? undefined : refundAmount.value,
		reason: refundReason.value,
		reasonDescription: reasonDescription.value || undefined,
		metadata: {},
	});
};

const formatCurrency = (amount: number, currency = "usd"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};

const formatDate = (timestamp: number): string => {
	return new Date(timestamp * 1000).toLocaleDateString();
};
</script>

<style scoped>
.stripe-refund-modal {
	background: white;
	border-radius: 8px;
	width: 500px;
	max-height: 90vh;
	overflow-y: auto;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	border-bottom: 1px solid #e0e0e0;
}

.modal-title {
	font-size: 20px;
	font-weight: 600;
	margin: 0;
}

.close-btn {
	width: 32px;
	height: 32px;
	border: none;
	background: #f0f0f0;
	border-radius: 50%;
	font-size: 20px;
	cursor: pointer;
}

.modal-body {
	padding: 20px;
}

.payment-info {
	background: #f9fafb;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 20px;
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 8px 0;
}

.info-label {
	color: #666;
	font-size: 14px;
}

.info-value {
	font-weight: 500;
	font-size: 14px;
}

.info-value.amount {
	color: #635bff;
	font-size: 18px;
}

.refund-form {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.form-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0;
}

.amount-options {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.amount-option {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	cursor: pointer;
}

.amount-option:has(input:checked) {
	border-color: #635bff;
	background: #f5f3ff;
}

.option-label {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.option-title {
	font-weight: 500;
}

.option-desc {
	font-size: 12px;
	color: #666;
}

.partial-input {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.field-label {
	font-size: 14px;
	font-weight: 500;
}

.field-input,
.field-select,
.field-textarea {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.field-textarea {
	min-height: 80px;
	resize: vertical;
}

.policy-info {
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: 12px;
	color: #666;
}

.policy-item {
	padding: 4px 8px;
	background: #f0f0f0;
	border-radius: 4px;
}

.policy-item.approval {
	background: #fef3c7;
	color: #92400e;
}

.refund-preview {
	background: #f9fafb;
	border-radius: 8px;
	padding: 16px;
	margin-top: 20px;
}

.preview-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 12px 0;
}

.preview-details {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.preview-row {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
}

.preview-row.refund-amount {
	color: #ef4444;
}

.preview-row.total {
	border-top: 1px solid #e0e0e0;
	padding-top: 8px;
	margin-top: 8px;
	font-weight: 600;
}

.modal-footer {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	padding: 20px;
	border-top: 1px solid #e0e0e0;
}

.btn-secondary,
.btn-danger {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
}

.btn-secondary {
	background: white;
	color: #333;
	border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
	background: #f5f5f5;
}

.btn-danger {
	background: #ef4444;
	color: white;
	border: none;
}

.btn-danger:hover:not(:disabled) {
	background: #dc2626;
}

.btn-danger:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>
