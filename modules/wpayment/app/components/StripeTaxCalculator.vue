<template>
	<div class="stripe-tax-calculator">
		<div class="calculator-header">
			<h2 class="calculator-title">{{ title }}</h2>
		</div>

		<div class="calculator-form">
			<div class="form-row">
				<div class="form-field">
					<label class="field-label">Amount</label>
					<input v-model.number="formData.amount" type="number" class="field-input" placeholder="1000" min="0" />
				</div>
				<div class="form-field">
					<label class="field-label">Currency</label>
					<select v-model="formData.currency" class="field-select">
						<option value="usd">USD</option>
						<option value="eur">EUR</option>
						<option value="gbp">GBP</option>
						<option value="cad">CAD</option>
						<option value="aud">AUD</option>
					</select>
				</div>
			</div>

			<div class="form-section">
				<h3 class="section-title">Customer Location</h3>
				<div class="form-field">
					<label class="field-label">Country *</label>
					<select v-model="formData.customerAddress.country" class="field-select">
						<option value="US">United States</option>
						<option value="GB">United Kingdom</option>
						<option value="DE">Germany</option>
						<option value="FR">France</option>
						<option value="CA">Canada</option>
						<option value="AU">Australia</option>
						<option value="JP">Japan</option>
					</select>
				</div>
				<div class="form-row" v-if="formData.customerAddress.country === 'US'">
					<div class="form-field">
						<label class="field-label">State</label>
						<select v-model="formData.customerAddress.state" class="field-select">
							<option value="CA">California</option>
							<option value="NY">New York</option>
							<option value="TX">Texas</option>
							<option value="FL">Florida</option>
							<option value="WA">Washington</option>
						</select>
					</div>
					<div class="form-field">
						<label class="field-label">Postal Code</label>
						<input v-model="formData.customerAddress.postal_code" type="text" class="field-input" placeholder="90210" />
					</div>
				</div>
			</div>

			<div class="form-section">
				<h3 class="section-title">Product Details</h3>
				<div class="form-field">
					<label class="field-label">Product Type</label>
					<select v-model="formData.productType" class="field-select">
						<option value="physical">Physical Goods</option>
						<option value="digital">Digital Products</option>
						<option value="service">Services</option>
						<option value="subscription">Subscription</option>
					</select>
				</div>
				<div class="form-field">
					<label class="field-label">Tax Code (Optional)</label>
					<select v-model="formData.productTaxCode" class="field-select">
						<option value="">Default</option>
						<option value="txcd_10000000">General - Tangible goods</option>
						<option value="txcd_20030000">General - Services</option>
						<option value="txcd_10103000">Software as a service (SaaS)</option>
						<option value="txcd_10010000">Digital products</option>
					</select>
				</div>
			</div>

			<div class="form-row">
				<div class="form-field">
					<label class="field-label">Shipping Amount</label>
					<input v-model.number="formData.shippingAmount" type="number" class="field-input" placeholder="0" min="0" />
				</div>
				<div class="form-field">
					<label class="field-label">Discount Amount</label>
					<input v-model.number="formData.discountAmount" type="number" class="field-input" placeholder="0" min="0" />
				</div>
			</div>

			<button class="btn-primary calculate-btn" @click="calculateTax">Calculate Tax</button>
		</div>

		<div class="tax-result" v-if="result">
			<h3 class="result-title">Tax Calculation Result</h3>
			<div class="result-summary">
				<div class="summary-row">
					<span class="summary-label">Subtotal</span>
					<span class="summary-value">{{ formatCurrency(result.subtotal, result.currency) }}</span>
				</div>
				<div class="summary-row tax-row">
					<span class="summary-label">Tax ({{ result.taxRate }}% - {{ result.taxName }})</span>
					<span class="summary-value">{{ formatCurrency(result.taxAmount, result.currency) }}</span>
				</div>
				<div class="summary-row total-row">
					<span class="summary-label">Total</span>
					<span class="summary-value">{{ formatCurrency(result.total, result.currency) }}</span>
				</div>
			</div>

			<div class="tax-breakdown" v-if="result.breakdown.length > 0">
				<h4 class="breakdown-title">Tax Breakdown</h4>
				<div class="breakdown-list">
					<div v-for="item in result.breakdown" :key="item.name" class="breakdown-item">
						<div class="breakdown-info">
							<span class="breakdown-name">{{ item.name }}</span>
							<span class="breakdown-location" v-if="item.state || item.country">{{ item.state || item.country }}</span>
						</div>
						<div class="breakdown-details">
							<span class="breakdown-rate">{{ item.rate }}%</span>
							<span class="breakdown-amount">{{ formatCurrency(item.amount, result.currency) }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="tax-rates-section">
			<h3 class="section-title">Configured Tax Rates</h3>
			<div class="tax-rates-list">
				<div v-for="rate in taxRates" :key="rate.id" class="tax-rate-item">
					<div class="rate-info">
						<span class="rate-name">{{ rate.display_name }}</span>
						<span class="rate-jurisdiction">{{ rate.jurisdiction || rate.country || 'Global' }}</span>
					</div>
					<div class="rate-details">
						<span :class="['rate-type', rate.inclusive ? 'inclusive' : 'exclusive']">
							{{ rate.inclusive ? 'Incl.' : 'Excl.' }}
						</span>
						<span class="rate-percentage">{{ rate.percentage }}%</span>
						<span :class="['rate-status', rate.active ? 'active' : 'inactive']">
							{{ rate.active ? 'Active' : 'Inactive' }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TaxCalculationInput, TaxCalculationResult, TaxRate } from "#wpayment/types";

interface Props {
	title?: string;
	taxRates?: TaxRate[];
}

const props = withDefaults(defineProps<Props>(), {
	title: "Tax Calculator",
	taxRates: () => [],
});

const emit = defineEmits<{
	calculate: [input: TaxCalculationInput];
}>();

const formData = ref<TaxCalculationInput>({
	amount: 1000,
	currency: "usd",
	customerAddress: {
		country: "US",
		state: "",
		postal_code: "",
	},
	productType: "digital",
	productTaxCode: "",
	shippingAmount: 0,
	discountAmount: 0,
});

const result = ref<TaxCalculationResult | null>(null);

const calculateTax = () => {
	emit("calculate", formData.value);

	const subtotal = formData.value.amount + (formData.value.shippingAmount || 0) - (formData.value.discountAmount || 0);

	let taxRate = 0;
	let taxName = "Sales Tax";

	if (formData.value.customerAddress.country === "US") {
		if (formData.value.customerAddress.state === "CA") {
			taxRate = 7.25;
			taxName = "California Sales Tax";
		} else if (formData.value.customerAddress.state === "NY") {
			taxRate = 8;
			taxName = "NYC Sales Tax";
		} else if (formData.value.customerAddress.state === "TX") {
			taxRate = 6.25;
			taxName = "Texas Sales Tax";
		} else {
			taxRate = 0;
			taxName = "No Tax";
		}
	} else if (formData.value.customerAddress.country === "GB") {
		taxRate = 20;
		taxName = "VAT";
	} else if (formData.value.customerAddress.country === "DE") {
		taxRate = 19;
		taxName = "MwSt";
	} else if (formData.value.customerAddress.country === "FR") {
		taxRate = 20;
		taxName = "TVA";
	} else if (formData.value.customerAddress.country === "CA") {
		taxRate = 5;
		taxName = "GST";
	} else if (formData.value.customerAddress.country === "AU") {
		taxRate = 10;
		taxName = "GST";
	} else if (formData.value.customerAddress.country === "JP") {
		taxRate = 10;
		taxName = "JCT";
	}

	const taxAmount = Math.round(subtotal * (taxRate / 100));

	result.value = {
		subtotal,
		taxAmount,
		taxRate,
		taxName,
		total: subtotal + taxAmount,
		currency: formData.value.currency,
		breakdown: taxRate > 0 ? [{ name: taxName, rate: taxRate, amount: taxAmount, country: formData.value.customerAddress.country, state: formData.value.customerAddress.state }] : [],
	};
};

const formatCurrency = (amount: number, currency = "usd"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};
</script>

<style scoped>
.stripe-tax-calculator {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	max-width: 600px;
}

.calculator-header {
	margin-bottom: 24px;
}

.calculator-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.calculator-form {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 24px;
}

.form-section {
	margin-bottom: 20px;
	padding-top: 16px;
	border-top: 1px solid #f0f0f0;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 12px 0;
	color: #666;
}

.form-row {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin-bottom: 16px;
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
.field-select {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.calculate-btn {
	width: 100%;
	margin-top: 16px;
}

.tax-result {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 24px;
}

.result-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.result-summary {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.summary-row {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
}

.summary-row.tax-row {
	color: #635bff;
}

.summary-row.total-row {
	border-top: 2px solid #e0e0e0;
	padding-top: 12px;
	margin-top: 12px;
	font-weight: 600;
	font-size: 18px;
}

.tax-breakdown {
	margin-top: 20px;
	padding-top: 16px;
	border-top: 1px solid #f0f0f0;
}

.breakdown-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 12px 0;
	color: #666;
}

.breakdown-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.breakdown-item {
	display: flex;
	justify-content: space-between;
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.breakdown-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.breakdown-name {
	font-weight: 500;
}

.breakdown-location {
	font-size: 12px;
	color: #666;
}

.breakdown-details {
	display: flex;
	gap: 12px;
	align-items: center;
}

.breakdown-rate {
	font-size: 12px;
	color: #666;
}

.breakdown-amount {
	font-weight: 500;
}

.tax-rates-section {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.tax-rates-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.tax-rate-item {
	display: flex;
	justify-content: space-between;
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.rate-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.rate-name {
	font-weight: 500;
}

.rate-jurisdiction {
	font-size: 12px;
	color: #666;
}

.rate-details {
	display: flex;
	gap: 12px;
	align-items: center;
}

.rate-type {
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 4px;
}

.rate-type.inclusive {
	background: #d1fae5;
	color: #065f46;
}

.rate-type.exclusive {
	background: #e0e7ff;
	color: #3730a3;
}

.rate-percentage {
	font-weight: 600;
}

.rate-status {
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 4px;
}

.rate-status.active {
	background: #d1fae5;
	color: #065f46;
}

.rate-status.inactive {
	background: #fee2e2;
	color: #991b1b;
}

.btn-primary {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	background: #635bff;
	color: white;
	border: none;
}

.btn-primary:hover {
	background: #4a4bd9;
}
</style>
