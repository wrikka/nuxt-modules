<script setup lang="ts">
import type { CustomerSummary } from "#wpayment/types";

const props = defineProps<{
	customers: CustomerSummary[];
}>();

const emit = defineEmits<{
	select: [customer: CustomerSummary];
	edit: [customer: CustomerSummary];
	view: [customer: CustomerSummary];
}>();

const getInitials = (name: string): string => {
	return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
};
</script>

<template>
	<div class="customers-table">
		<div class="table-header">
			<span class="col-customer">Customer</span>
			<span class="col-email">Email</span>
			<span class="col-subscriptions">Subscriptions</span>
			<span class="col-spent">Total Spent</span>
			<span class="col-actions">Actions</span>
		</div>
		<div class="table-body">
			<div v-for="customer in customers" :key="customer.id" class="table-row" @click="emit('select', customer)">
				<div class="col-customer">
					<div class="customer-avatar">{{ getInitials(customer.name || customer.email) }}</div>
					<div class="customer-info">
						<span class="customer-name">{{ customer.name || 'No name' }}</span>
						<span v-if="customer.delinquent" class="delinquent-badge">Delinquent</span>
					</div>
				</div>
				<div class="col-email">{{ customer.email }}</div>
				<div class="col-subscriptions">
					<span class="subscription-count">{{ customer.subscriptionCount }}</span>
				</div>
				<div class="col-spent">{{ formatCurrency(customer.totalSpent) }}</div>
				<div class="col-actions">
					<button class="btn-icon" @click.stop="emit('edit', customer)">✏️</button>
					<button class="btn-icon" @click.stop="emit('view', customer)">👁️</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.customers-table {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
}

.table-header {
	display: grid;
	grid-template-columns: 2fr 2fr 1fr 1fr 100px;
	padding: 12px 16px;
	background: #f9fafb;
	font-size: 12px;
	font-weight: 600;
	color: #666;
}

.table-body {
	max-height: 500px;
	overflow-y: auto;
}

.table-row {
	display: grid;
	grid-template-columns: 2fr 2fr 1fr 1fr 100px;
	padding: 12px 16px;
	border-top: 1px solid #f0f0f0;
	cursor: pointer;
	align-items: center;
}

.table-row:hover {
	background: #f9fafb;
}

.col-customer {
	display: flex;
	align-items: center;
	gap: 12px;
}

.customer-avatar {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #635bff;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: 600;
}

.customer-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.customer-name {
	font-weight: 500;
}

.delinquent-badge {
	font-size: 10px;
	padding: 2px 6px;
	background: #fee2e2;
	color: #991b1b;
	border-radius: 4px;
}

.col-email {
	font-size: 14px;
	color: #666;
}

.col-subscriptions {
	text-align: center;
}

.subscription-count {
	display: inline-block;
	padding: 2px 8px;
	background: #e0e7ff;
	color: #3730a3;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
}

.col-spent {
	font-weight: 500;
}

.col-actions {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
}

.btn-icon {
	width: 28px;
	height: 28px;
	border: none;
	background: #f0f0f0;
	border-radius: 6px;
	cursor: pointer;
	font-size: 12px;
}

.btn-icon:hover {
	background: #e0e0e0;
}
</style>
