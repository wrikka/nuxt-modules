<template>
	<div class="stripe-invoice-generator">
		<div class="generator-header">
			<h2 class="generator-title">{{ title }}</h2>
			<div class="generator-actions">
				<button class="btn-secondary" @click="showPreview = true">Preview</button>
				<button class="btn-primary" @click="createInvoice" :disabled="!isValid">Create Invoice</button>
			</div>
		</div>

		<div class="generator-form">
			<div class="form-section">
				<h3 class="section-title">Customer Information</h3>
				<div class="form-row">
					<div class="form-field">
						<label class="field-label">Email *</label>
						<input v-model="formData.customerEmail" type="email" class="field-input" placeholder="customer@example.com" />
					</div>
					<div class="form-field">
						<label class="field-label">Name</label>
						<input v-model="formData.customerName" type="text" class="field-input" placeholder="Customer Name" />
					</div>
				</div>
			</div>

			<div class="form-section">
				<h3 class="section-title">Invoice Items</h3>
				<div class="items-list">
					<div v-for="(item, index) in formData.items" :key="item.id" class="item-row">
						<div class="item-description">
							<input v-model="item.description" type="text" class="field-input" placeholder="Description" />
						</div>
						<div class="item-quantity">
							<input v-model.number="item.quantity" type="number" min="1" class="field-input" />
						</div>
						<div class="item-amount">
							<input v-model.number="item.unitAmount" type="number" min="0" class="field-input" placeholder="Amount (cents)" />
						</div>
						<div class="item-currency">
							<select v-model="item.currency" class="field-select">
								<option value="usd">USD</option>
								<option value="eur">EUR</option>
								<option value="gbp">GBP</option>
							</select>
						</div>
						<button class="item-remove" @click="removeItem(index)">×</button>
					</div>
				</div>
				<button class="btn-add-item" @click="addItem">+ Add Item</button>
			</div>

			<div class="form-section">
				<h3 class="section-title">Payment Settings</h3>
				<div class="form-row">
					<div class="form-field">
						<label class="field-label">Payment Terms</label>
						<select v-model="formData.paymentTerms" class="field-select">
							<option value="due_on_receipt">Due on Receipt</option>
							<option value="net_7">Net 7</option>
							<option value="net_15">Net 15</option>
							<option value="net_30">Net 30</option>
							<option value="net_60">Net 60</option>
						</select>
					</div>
					<div class="form-field">
						<label class="field-label">Custom Due Date</label>
						<input v-model="formData.dueDate" type="date" class="field-input" />
					</div>
				</div>
			</div>

			<div class="form-section">
				<h3 class="section-title">Additional Notes</h3>
				<textarea v-model="formData.notes" class="field-textarea" placeholder="Notes visible to customer..." />
			</div>
		</div>

		<div class="invoice-summary">
			<div class="summary-row">
				<span class="summary-label">Subtotal</span>
				<span class="summary-value">{{ formatCurrency(preview.subtotal) }}</span>
			</div>
			<div class="summary-row">
				<span class="summary-label">Tax</span>
				<span class="summary-value">{{ formatCurrency(preview.tax) }}</span>
			</div>
			<div class="summary-row" v-if="preview.discount > 0">
				<span class="summary-label">Discount</span>
				<span class="summary-value">-{{ formatCurrency(preview.discount) }}</span>
			</div>
			<div class="summary-row total">
				<span class="summary-label">Total</span>
				<span class="summary-value">{{ formatCurrency(preview.total) }}</span>
			</div>
		</div>

		<div v-if="showPreview" class="modal-overlay" @click.self="showPreview = false">
			<div class="modal-content preview-modal">
				<div class="preview-header">
					<h3 class="preview-title">Invoice Preview</h3>
					<button class="close-btn" @click="showPreview = false">×</button>
				</div>
				<div class="preview-document">
					<div class="document-header">
						<div class="company-info">
							<h4 class="company-name">Your Company</h4>
							<p class="company-address">123 Business St, City, Country</p>
						</div>
						<div class="invoice-info">
							<span class="invoice-number">INV-001</span>
							<span class="invoice-date">{{ new Date().toLocaleDateString() }}</span>
						</div>
					</div>
					<div class="document-customer">
						<span class="bill-to">Bill To:</span>
						<span class="customer-name">{{ formData.customerName || formData.customerEmail }}</span>
						<span class="customer-email">{{ formData.customerEmail }}</span>
					</div>
					<table class="document-items">
						<thead>
							<tr>
								<th>Description</th>
								<th>Qty</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in formData.items" :key="item.id">
								<td>{{ item.description }}</td>
								<td>{{ item.quantity }}</td>
								<td>{{ formatCurrency(item.unitAmount, item.currency) }}</td>
							</tr>
						</tbody>
					</table>
					<div class="document-totals">
						<div class="total-line">
							<span>Subtotal</span>
							<span>{{ formatCurrency(preview.subtotal) }}</span>
						</div>
						<div class="total-line grand-total">
							<span>Total</span>
							<span>{{ formatCurrency(preview.total) }}</span>
						</div>
					</div>
					<div class="document-notes" v-if="formData.notes">
						<p>{{ formData.notes }}</p>
					</div>
				</div>
				<div class="modal-actions">
					<button class="btn-secondary" @click="downloadPDF">Download PDF</button>
					<button class="btn-primary" @click="sendInvoice">Send Invoice</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { InvoiceFormData, InvoiceFormItem, InvoicePreview } from "#wpayment/types";

interface Props {
	title?: string;
	initialData?: Partial<InvoiceFormData>;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Create Invoice",
});

const emit = defineEmits<{
	create: [data: InvoiceFormData];
	send: [data: InvoiceFormData];
	download: [data: InvoiceFormData];
}>();

const showPreview = ref(false);

const formData = ref<InvoiceFormData>({
	customerEmail: props.initialData?.customerEmail || "",
	customerName: props.initialData?.customerName || "",
	customerPhone: props.initialData?.customerPhone || "",
	items: props.initialData?.items || [createNewItem()],
	dueDate: props.initialData?.dueDate || "",
	paymentTerms: props.initialData?.paymentTerms || "net_30",
	notes: props.initialData?.notes || "",
	metadata: props.initialData?.metadata || {},
});

function createNewItem(): InvoiceFormItem {
	return {
		id: crypto.randomUUID(),
		description: "",
		quantity: 1,
		unitAmount: 0,
		currency: "usd",
	};
}

const isValid = computed(() => {
	return formData.value.customerEmail && formData.value.items.some((item) => item.description && item.unitAmount > 0);
});

const preview = computed<InvoicePreview>(() => {
	const subtotal = formData.value.items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
	return {
		subtotal,
		tax: 0,
		discount: 0,
		total: subtotal,
		currency: "usd",
	};
});

const addItem = () => {
	formData.value.items.push(createNewItem());
};

const removeItem = (index: number) => {
	if (formData.value.items.length > 1) {
		formData.value.items.splice(index, 1);
	}
};

const createInvoice = () => {
	emit("create", formData.value);
};

const sendInvoice = () => {
	emit("send", formData.value);
	showPreview.value = false;
};

const downloadPDF = () => {
	emit("download", formData.value);
};

const formatCurrency = (amount: number, currency = "usd"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};
</script>

<style scoped>
.stripe-invoice-generator {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	max-width: 800px;
}

.generator-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.generator-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.generator-actions {
	display: flex;
	gap: 12px;
}

.generator-form {
	display: flex;
	flex-direction: column;
	gap: 24px;
	margin-bottom: 24px;
}

.form-section {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.form-row {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
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

.items-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 12px;
}

.item-row {
	display: grid;
	grid-template-columns: 2fr 80px 120px 80px 40px;
	gap: 8px;
	align-items: center;
}

.item-description {
	flex: 1;
}

.item-remove {
	width: 32px;
	height: 32px;
	border: none;
	background: #fee2e2;
	color: #991b1b;
	border-radius: 6px;
	cursor: pointer;
	font-size: 18px;
}

.btn-add-item {
	padding: 10px;
	border: 1px dashed #e0e0e0;
	border-radius: 6px;
	background: transparent;
	color: #666;
	cursor: pointer;
}

.btn-add-item:hover {
	border-color: #635bff;
	color: #635bff;
}

.invoice-summary {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.summary-row {
	display: flex;
	justify-content: space-between;
	padding: 8px 0;
}

.summary-row.total {
	border-top: 2px solid #e0e0e0;
	margin-top: 8px;
	padding-top: 16px;
	font-weight: 600;
	font-size: 18px;
}

.summary-label {
	color: #666;
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

.preview-modal {
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 700px;
	max-height: 90vh;
	overflow-y: auto;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.preview-title {
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

.preview-document {
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 24px;
	margin-bottom: 16px;
}

.document-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 24px;
}

.company-name {
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 4px 0;
}

.company-address {
	font-size: 12px;
	color: #666;
	margin: 0;
}

.invoice-info {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.invoice-number {
	font-size: 16px;
	font-weight: 600;
}

.invoice-date {
	font-size: 12px;
	color: #666;
}

.document-customer {
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-bottom: 24px;
}

.bill-to {
	font-size: 12px;
	color: #666;
}

.customer-name {
	font-weight: 500;
}

.customer-email {
	font-size: 12px;
	color: #666;
}

.document-items {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 24px;
}

.document-items th,
.document-items td {
	padding: 12px;
	text-align: left;
	border-bottom: 1px solid #e0e0e0;
}

.document-items th {
	font-size: 12px;
	color: #666;
	font-weight: 500;
}

.document-totals {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8px;
}

.total-line {
	display: flex;
	gap: 24px;
}

.total-line.grand-total {
	font-weight: 600;
	font-size: 18px;
	border-top: 2px solid #e0e0e0;
	padding-top: 12px;
	margin-top: 12px;
}

.document-notes {
	margin-top: 24px;
	padding-top: 24px;
	border-top: 1px solid #e0e0e0;
	font-size: 12px;
	color: #666;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
}
</style>
