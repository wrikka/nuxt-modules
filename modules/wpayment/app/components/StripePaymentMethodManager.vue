<template>
	<div class="stripe-payment-method-manager">
		<div class="manager-header">
			<h2 class="manager-title">{{ title }}</h2>
			<button class="btn-primary" @click="showAddModal = true">Add Payment Method</button>
		</div>

		<div class="methods-list">
			<div v-for="method in paymentMethods" :key="method.id" :class="['method-card', { default: method.isDefault }]">
				<div class="method-icon">
					<span v-if="method.type === 'card'">{{ getCardIcon(method.card?.brand) }}</span>
					<span v-else-if="method.type === 'sepa_debit'">🏦</span>
					<span v-else>💳</span>
				</div>
				<div class="method-details">
					<div class="method-type">
						<span class="type-name">{{ formatMethodType(method.type) }}</span>
						<span v-if="method.isDefault" class="default-badge">Default</span>
					</div>
					<div class="method-info" v-if="method.card">
						<span class="card-brand">{{ method.card.brand }}</span>
						<span class="card-last4">•••• {{ method.card.last4 }}</span>
						<span class="card-expiry">{{ method.card.expMonth }}/{{ method.card.expYear }}</span>
					</div>
					<div class="method-info" v-else-if="method.sepaDebit">
						<span class="bank-name">{{ method.sepaDebit.bank }}</span>
						<span class="bank-last4">•••• {{ method.sepaDebit.last4 }}</span>
					</div>
					<div class="method-info" v-else-if="method.usBankAccount">
						<span class="bank-name">{{ method.usBankAccount.bankName }}</span>
						<span class="bank-last4">•••• {{ method.usBankAccount.last4 }}</span>
					</div>
				</div>
				<div class="method-actions">
					<button v-if="!method.isDefault" class="btn-icon" @click="setDefault(method)" title="Set as default">⭐</button>
					<button class="btn-icon" @click="editMethod(method)" title="Edit">✏️</button>
					<button class="btn-icon danger" @click="removeMethod(method)" title="Remove">🗑️</button>
				</div>
			</div>

			<div v-if="paymentMethods.length === 0" class="empty-state">
				<span class="empty-icon">💳</span>
				<p class="empty-text">No payment methods added</p>
				<button class="btn-primary" @click="showAddModal = true">Add Payment Method</button>
			</div>
		</div>

		<div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
			<div class="modal-content">
				<h3 class="modal-title">Add Payment Method</h3>
				<div class="method-type-selector">
					<button v-for="type in availableTypes" :key="type.value" :class="['type-btn', { active: selectedType === type.value }]" @click="selectedType = type.value">
						<span class="type-icon">{{ type.icon }}</span>
						<span class="type-label">{{ type.label }}</span>
					</button>
				</div>

				<div class="form-section" v-if="selectedType === 'card'">
					<div class="form-field">
						<label class="field-label">Card Number</label>
						<input v-model="cardForm.number" type="text" class="field-input" placeholder="4242 4242 4242 4242" />
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Expiry</label>
							<input v-model="cardForm.expiry" type="text" class="field-input" placeholder="MM/YY" />
						</div>
						<div class="form-field">
							<label class="field-label">CVC</label>
							<input v-model="cardForm.cvc" type="text" class="field-input" placeholder="123" />
						</div>
					</div>
				</div>

				<div class="form-section" v-if="selectedType === 'sepa_debit'">
					<div class="form-field">
						<label class="field-label">IBAN</label>
						<input v-model="sepaForm.iban" type="text" class="field-input" placeholder="DE89 3704 0044 0532 0130 00" />
					</div>
					<div class="form-field">
						<label class="field-label">Account Holder Name</label>
						<input v-model="sepaForm.accountHolderName" type="text" class="field-input" placeholder="John Doe" />
					</div>
				</div>

				<div class="form-section billing-section">
					<h4 class="section-title">Billing Details (Optional)</h4>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Name</label>
							<input v-model="billingForm.name" type="text" class="field-input" placeholder="John Doe" />
						</div>
						<div class="form-field">
							<label class="field-label">Email</label>
							<input v-model="billingForm.email" type="email" class="field-input" placeholder="john@example.com" />
						</div>
					</div>
					<div class="form-field">
						<label class="field-label">Address</label>
						<input v-model="billingForm.address.line1" type="text" class="field-input" placeholder="123 Main St" />
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">City</label>
							<input v-model="billingForm.address.city" type="text" class="field-input" />
						</div>
						<div class="form-field">
							<label class="field-label">Postal Code</label>
							<input v-model="billingForm.address.postal_code" type="text" class="field-input" />
						</div>
					</div>
				</div>

				<div class="modal-actions">
					<button class="btn-secondary" @click="showAddModal = false">Cancel</button>
					<button class="btn-primary" @click="addMethod" :disabled="!isFormValid">Add</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { PaymentMethodSummary, PaymentMethodTypeOption } from "#wpayment/types";

interface Props {
	title?: string;
	paymentMethods?: PaymentMethodSummary[];
}

const props = withDefaults(defineProps<Props>(), {
	title: "Payment Methods",
	paymentMethods: () => [],
});

const emit = defineEmits<{
	add: [type: PaymentMethodTypeOption, data: Record<string, any>];
	remove: [id: string];
	setDefault: [id: string];
	update: [id: string, data: Record<string, any>];
}>();

const showAddModal = ref(false);
const selectedType = ref<PaymentMethodTypeOption>("card");
const editingMethod = ref<PaymentMethodSummary | null>(null);

const cardForm = ref({
	number: "",
	expiry: "",
	cvc: "",
});

const sepaForm = ref({
	iban: "",
	accountHolderName: "",
});

const billingForm = ref({
	name: "",
	email: "",
	address: {
		line1: "",
		city: "",
		postal_code: "",
		country: "",
	},
});

const availableTypes = [
	{ value: "card", label: "Card", icon: "💳" },
	{ value: "sepa_debit", label: "SEPA", icon: "🏦" },
	{ value: "us_bank_account", label: "Bank Account", icon: "🏛️" },
];

const isFormValid = computed(() => {
	if (selectedType.value === "card") {
		return cardForm.value.number.length >= 15 && cardForm.value.expiry && cardForm.value.cvc;
	}
	if (selectedType.value === "sepa_debit") {
		return sepaForm.value.iban.length >= 15;
	}
	return false;
});

const setDefault = (method: PaymentMethodSummary) => {
	emit("setDefault", method.id);
};

const editMethod = (method: PaymentMethodSummary) => {
	editingMethod.value = method;
};

const removeMethod = (method: PaymentMethodSummary) => {
	emit("remove", method.id);
};

const addMethod = () => {
	let data: Record<string, any> = {};

	if (selectedType.value === "card") {
		const [expMonth, expYear] = cardForm.value.expiry.split("/");
		data = {
			card: {
				number: cardForm.value.number.replace(/\s/g, ""),
				expMonth: Number.parseInt(expMonth),
				expYear: Number.parseInt("20" + expYear),
				cvc: cardForm.value.cvc,
			},
		};
	} else if (selectedType.value === "sepa_debit") {
		data = {
			sepa_debit: {
				iban: sepaForm.value.iban.replace(/\s/g, ""),
				accountHolderName: sepaForm.value.accountHolderName,
			},
		};
	}

	data.billingDetails = billingForm.value;

	emit("add", selectedType.value, data);
	showAddModal.value = false;
	resetForms();
};

const resetForms = () => {
	cardForm.value = { number: "", expiry: "", cvc: "" };
	sepaForm.value = { iban: "", accountHolderName: "" };
	billingForm.value = { name: "", email: "", address: { line1: "", city: "", postal_code: "", country: "" } };
};

const formatMethodType = (type: string): string => {
	const labels: Record<string, string> = {
		card: "Credit/Debit Card",
		sepa_debit: "SEPA Direct Debit",
		us_bank_account: "US Bank Account",
		ideal: "iDEAL",
		bancontact: "Bancontact",
		sofort: "Sofort",
	};
	return labels[type] || type;
};

const getCardIcon = (brand?: string): string => {
	const icons: Record<string, string> = {
		visa: "💳",
		mastercard: "💳",
		amex: "💳",
		discover: "💳",
	};
	return icons[brand || ""] || "💳";
};
</script>

<style scoped>
.stripe-payment-method-manager {
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

.methods-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.method-card {
	display: flex;
	align-items: center;
	gap: 16px;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
}

.method-card.default {
	border-color: #635bff;
	background: #f5f3ff;
}

.method-icon {
	font-size: 32px;
}

.method-details {
	flex: 1;
}

.method-type {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
}

.type-name {
	font-weight: 600;
}

.default-badge {
	font-size: 10px;
	padding: 2px 6px;
	background: #635bff;
	color: white;
	border-radius: 4px;
}

.method-info {
	display: flex;
	gap: 12px;
	font-size: 14px;
	color: #666;
}

.card-brand {
	text-transform: capitalize;
}

.method-actions {
	display: flex;
	gap: 8px;
}

.btn-icon {
	width: 32px;
	height: 32px;
	border: none;
	background: #f0f0f0;
	border-radius: 6px;
	cursor: pointer;
}

.btn-icon:hover {
	background: #e0e0e0;
}

.btn-icon.danger:hover {
	background: #fee2e2;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	background: #f9fafb;
	border: 1px dashed #e0e0e0;
	border-radius: 8px;
}

.empty-icon {
	font-size: 48px;
	margin-bottom: 16px;
}

.empty-text {
	color: #666;
	margin: 0 0 16px 0;
}

.btn-primary,
.btn-secondary {
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

.btn-secondary:hover {
	background: #f5f5f5;
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
	z-index: 1000;
}

.modal-content {
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 500px;
	max-height: 90vh;
	overflow-y: auto;
}

.modal-title {
	font-size: 20px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.method-type-selector {
	display: flex;
	gap: 8px;
	margin-bottom: 20px;
}

.type-btn {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 12px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	background: white;
	cursor: pointer;
}

.type-btn.active {
	border-color: #635bff;
	background: #f5f3ff;
}

.type-icon {
	font-size: 24px;
}

.type-label {
	font-size: 12px;
}

.form-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 16px;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0;
}

.form-row {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
}

.form-field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.field-label {
	font-size: 14px;
	font-weight: 500;
}

.field-input {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.billing-section {
	padding-top: 16px;
	border-top: 1px solid #e0e0e0;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 20px;
}
</style>
