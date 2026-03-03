<script setup lang="ts">
import type { CustomerStats } from "#wpayment/types";

const props = defineProps<{
	stats: CustomerStats;
}>();

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
};
</script>

<template>
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{{ stats.totalCustomers }}</span>
			<span class="stat-label">Total Customers</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{{ stats.activeSubscribers }}</span>
			<span class="stat-label">Subscribers</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{{ formatCurrency(stats.averageLifetimeValue) }}</span>
			<span class="stat-label">Avg LTV</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{{ stats.newCustomersThisMonth }}</span>
			<span class="stat-label">New This Month</span>
		</div>
	</div>
</template>

<style scoped>
.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-bottom: 24px;
}

.stat-card {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
	text-align: center;
}

.stat-value {
	display: block;
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 12px;
	color: #666;
}
</style>
