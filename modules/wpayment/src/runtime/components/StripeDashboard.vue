<template>
	<div class="stripe-dashboard">
		<div class="dashboard-header">
			<h2 class="dashboard-title">{{ title }}</h2>
			<div class="dashboard-filters">
				<select v-model="selectedDateRange" class="date-select">
					<option value="7d">Last 7 days</option>
					<option value="30d">Last 30 days</option>
					<option value="90d">Last 90 days</option>
					<option value="1y">Last year</option>
				</select>
			</div>
		</div>

		<div class="metrics-grid">
			<div class="metric-card">
				<div class="metric-label">Total Revenue</div>
				<div class="metric-value">{{ formatCurrency(metrics.totalRevenue) }}</div>
				<div :class="['metric-change', metrics.revenueChange >= 0 ? 'positive' : 'negative']">
					{{ formatChange(metrics.revenueChange) }}
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-label">Transactions</div>
				<div class="metric-value">{{ formatNumber(metrics.totalTransactions) }}</div>
				<div :class="['metric-change', metrics.transactionsChange >= 0 ? 'positive' : 'negative']">
					{{ formatChange(metrics.transactionsChange) }}
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-label">Active Subscriptions</div>
				<div class="metric-value">{{ formatNumber(metrics.activeSubscriptions) }}</div>
				<div :class="['metric-change', metrics.subscriptionsChange >= 0 ? 'positive' : 'negative']">
					{{ formatChange(metrics.subscriptionsChange) }}
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-label">Failed Payments</div>
				<div class="metric-value">{{ formatNumber(metrics.failedPayments) }}</div>
				<div :class="['metric-change', metrics.failedPaymentsChange <= 0 ? 'positive' : 'negative']">
					{{ formatChange(metrics.failedPaymentsChange) }}
				</div>
			</div>
		</div>

		<div class="dashboard-content">
			<div class="chart-section">
				<h3 class="section-title">Revenue Overview</h3>
				<div class="chart-container">
					<div class="chart-placeholder">
						<div v-for="(point, index) in revenueData" :key="index" class="chart-bar" :style="{ height: getBarHeight(point.revenue) }">
							<span class="chart-label">{{ point.date }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="transactions-section">
				<h3 class="section-title">Recent Transactions</h3>
				<div class="transactions-list">
					<div v-for="tx in transactions" :key="tx.id" class="transaction-item">
						<div class="tx-info">
							<span class="tx-email">{{ tx.customerEmail || 'Guest' }}</span>
							<span class="tx-date">{{ formatDate(tx.createdAt) }}</span>
						</div>
						<div class="tx-details">
							<span :class="['tx-status', tx.status]">{{ tx.status }}</span>
							<span class="tx-amount">{{ formatCurrency(tx.amount, tx.currency) }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="subscriptions-section">
			<h3 class="section-title">Active Subscriptions</h3>
			<div class="subscriptions-list">
				<div v-for="sub in subscriptions" :key="sub.id" class="subscription-item">
					<div class="sub-info">
						<span class="sub-email">{{ sub.customerEmail || 'Guest' }}</span>
						<span class="sub-plan">{{ sub.planName }}</span>
					</div>
					<div class="sub-details">
						<span :class="['sub-status', sub.status]">{{ sub.status }}</span>
						<span class="sub-amount">{{ formatCurrency(sub.amount, sub.currency) }}/{{ sub.interval }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { DashboardMetrics, RevenueData, TransactionSummary, SubscriptionSummary, DashboardFilter } from "#wpayment/types";

interface Props {
	title?: string;
	initialMetrics?: DashboardMetrics;
	initialRevenueData?: RevenueData[];
	initialTransactions?: TransactionSummary[];
	initialSubscriptions?: SubscriptionSummary[];
}

const props = withDefaults(defineProps<Props>(), {
	title: "Stripe Dashboard",
	initialMetrics: () => ({
		totalRevenue: 0,
		revenueChange: 0,
		totalTransactions: 0,
		transactionsChange: 0,
		activeSubscriptions: 0,
		subscriptionsChange: 0,
		failedPayments: 0,
		failedPaymentsChange: 0,
	}),
	initialRevenueData: () => [],
	initialTransactions: () => [],
	initialSubscriptions: () => [],
});

const emit = defineEmits<{
	filterChange: [filter: DashboardFilter];
}>();

const selectedDateRange = ref<DashboardFilter["dateRange"]>("30d");

const metrics = computed(() => props.initialMetrics);
const revenueData = computed(() => props.initialRevenueData);
const transactions = computed(() => props.initialTransactions);
const subscriptions = computed(() => props.initialSubscriptions);

watch(selectedDateRange, (value) => {
	emit("filterChange", { dateRange: value });
});

const formatCurrency = (amount: number, currency = "USD"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};

const formatNumber = (num: number): string => {
	return new Intl.NumberFormat("en-US").format(num);
};

const formatChange = (change: number): string => {
	const sign = change >= 0 ? "+" : "";
	return `${sign}${change.toFixed(1)}%`;
};

const formatDate = (timestamp: number): string => {
	return new Date(timestamp * 1000).toLocaleDateString();
};

const getBarHeight = (value: number): string => {
	const max = Math.max(...revenueData.value.map((d) => d.revenue), 1);
	const height = (value / max) * 100;
	return `${Math.max(height, 5)}%`;
};
</script>

<style scoped>
.stripe-dashboard {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.dashboard-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.date-select {
	padding: 8px 12px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	background: white;
}

.metrics-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-bottom: 24px;
}

.metric-card {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.metric-label {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
}

.metric-value {
	font-size: 28px;
	font-weight: 600;
	margin-bottom: 4px;
}

.metric-change {
	font-size: 14px;
}

.metric-change.positive {
	color: #10b981;
}

.metric-change.negative {
	color: #ef4444;
}

.dashboard-content {
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 24px;
	margin-bottom: 24px;
}

.section-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.chart-section {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.chart-container {
	height: 200px;
}

.chart-placeholder {
	display: flex;
	align-items: flex-end;
	gap: 8px;
	height: 100%;
}

.chart-bar {
	flex: 1;
	background: linear-gradient(180deg, #635bff 0%, #4a4bd9 100%);
	border-radius: 4px 4px 0 0;
	position: relative;
	min-height: 10px;
}

.chart-label {
	position: absolute;
	bottom: -20px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 10px;
	color: #666;
	white-space: nowrap;
}

.transactions-section {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.transactions-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-height: 300px;
	overflow-y: auto;
}

.transaction-item {
	display: flex;
	justify-content: space-between;
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.tx-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.tx-email {
	font-size: 14px;
	font-weight: 500;
}

.tx-date {
	font-size: 12px;
	color: #666;
}

.tx-details {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4px;
}

.tx-status {
	font-size: 12px;
	padding: 2px 8px;
	border-radius: 4px;
	text-transform: capitalize;
}

.tx-status.succeeded {
	background: #d1fae5;
	color: #065f46;
}

.tx-status.pending {
	background: #fef3c7;
	color: #92400e;
}

.tx-status.failed {
	background: #fee2e2;
	color: #991b1b;
}

.tx-amount {
	font-size: 14px;
	font-weight: 600;
}

.subscriptions-section {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.subscriptions-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.subscription-item {
	display: flex;
	justify-content: space-between;
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.sub-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.sub-email {
	font-size: 14px;
	font-weight: 500;
}

.sub-plan {
	font-size: 12px;
	color: #666;
}

.sub-details {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4px;
}

.sub-status {
	font-size: 12px;
	padding: 2px 8px;
	border-radius: 4px;
	text-transform: capitalize;
}

.sub-status.active {
	background: #d1fae5;
	color: #065f46;
}

.sub-status.canceled {
	background: #fee2e2;
	color: #991b1b;
}

.sub-status.past_due {
	background: #fef3c7;
	color: #92400e;
}

.sub-amount {
	font-size: 14px;
	font-weight: 600;
}
</style>
