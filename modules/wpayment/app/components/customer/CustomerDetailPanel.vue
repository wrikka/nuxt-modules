<script setup lang="ts">
import type { CustomerSummary } from "#wpayment/types";

const props = defineProps<{
	customer: CustomerSummary;
}>();

const emit = defineEmits<{
	close: [];
}>();

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
};
</script>

<template>
	<div class="detail-panel">
		<div class="detail-header">
			<h3 class="detail-title">Customer Details</h3>
			<button class="close-btn" @click="emit('close')">×</button>
		</div>
		<div class="detail-content">
			<div class="detail-section">
				<h4 class="section-title">Contact</h4>
				<div class="detail-row"><span class="label">Email:</span><span class="value">{{ customer.email }}</span></div>
				<div class="detail-row"><span class="label">Name:</span><span class="value">{{ customer.name || 'N/A' }}</span></div>
				<div class="detail-row"><span class="label">Phone:</span><span class="value">{{ customer.phone || 'N/A' }}</span></div>
			</div>
			<div class="detail-section">
				<h4 class="section-title">Stats</h4>
				<div class="detail-row"><span class="label">Balance:</span><span class="value">{{ formatCurrency(customer.balance) }}</span></div>
				<div class="detail-row"><span class="label">Total Spent:</span><span class="value">{{ formatCurrency(customer.totalSpent) }}</span></div>
				<div class="detail-row"><span class="label">Subscriptions:</span><span class="value">{{ customer.subscriptionCount }}</span></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.detail-panel {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	position: sticky;
	top: 0;
	max-height: 600px;
	overflow-y: auto;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.detail-title {
	font-size: 18px;
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

.detail-section {
	margin-bottom: 16px;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 8px 0;
	color: #666;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	padding: 6px 0;
	font-size: 14px;
}

.detail-row .label {
	color: #666;
}
</style>
