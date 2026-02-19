<template>
	<div class="stripe-analytics">
		<div class="analytics-header">
			<h2 class="analytics-title">{{ title }}</h2>
			<div class="analytics-controls">
				<select v-model="selectedPeriod" class="period-select">
					<option value="24h">Last 24 hours</option>
					<option value="7d">Last 7 days</option>
					<option value="30d">Last 30 days</option>
					<option value="90d">Last 90 days</option>
				</select>
				<button class="refresh-btn" @click="refresh">Refresh</button>
			</div>
		</div>

		<div class="analytics-grid">
			<div class="analytics-card success-rate">
				<div class="card-header">
					<span class="card-icon">✓</span>
					<span class="card-title">Success Rate</span>
				</div>
				<div class="card-value">{{ successRate.toFixed(1) }}%</div>
				<div class="card-chart">
					<div class="mini-chart">
						<div v-for="(val, i) in successRateHistory" :key="i" class="mini-bar" :style="{ height: `${val}%` }" />
					</div>
				</div>
			</div>

			<div class="analytics-card avg-amount">
				<div class="card-header">
					<span class="card-icon">$</span>
					<span class="card-title">Avg. Transaction</span>
				</div>
				<div class="card-value">{{ formatCurrency(avgAmount) }}</div>
				<div class="card-trend" :class="avgAmountTrend >= 0 ? 'up' : 'down'">
					{{ avgAmountTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(avgAmountTrend).toFixed(1) }}%
				</div>
			</div>

			<div class="analytics-card peak-hours">
				<div class="card-header">
					<span class="card-icon">⏰</span>
					<span class="card-title">Peak Hours</span>
				</div>
				<div class="card-value">{{ peakHours.join(', ') }}</div>
				<div class="card-detail">{{ peakHoursPercentage.toFixed(0) }}% of transactions</div>
			</div>

			<div class="analytics-card payment-methods">
				<div class="card-header">
					<span class="card-icon">💳</span>
					<span class="card-title">Payment Methods</span>
				</div>
				<div class="payment-methods-list">
					<div v-for="method in paymentMethods" :key="method.type" class="method-item">
						<span class="method-name">{{ method.type }}</span>
						<div class="method-bar-container">
							<div class="method-bar" :style="{ width: `${method.percentage}%` }" />
						</div>
						<span class="method-percentage">{{ method.percentage.toFixed(0) }}%</span>
					</div>
				</div>
			</div>
		</div>

		<div class="analytics-charts">
			<div class="chart-panel">
				<h3 class="panel-title">Transaction Volume</h3>
				<div class="volume-chart">
					<div v-for="(point, i) in volumeData" :key="i" class="volume-bar" :style="{ height: getVolumeHeight(point.count) }">
						<span class="volume-tooltip">{{ point.count }} transactions</span>
					</div>
				</div>
				<div class="volume-labels">
					<span v-for="(point, i) in volumeData" :key="i">{{ point.label }}</span>
				</div>
			</div>

			<div class="chart-panel">
				<h3 class="panel-title">Revenue by Currency</h3>
				<div class="currency-breakdown">
					<div v-for="curr in currencyBreakdown" :key="curr.currency" class="currency-item">
						<span class="currency-code">{{ curr.currency }}</span>
						<span class="currency-amount">{{ formatCurrency(curr.amount, curr.currency) }}</span>
						<span class="currency-percent">{{ curr.percentage.toFixed(1) }}%</span>
					</div>
				</div>
			</div>
		</div>

		<div class="analytics-errors">
			<h3 class="errors-title">Recent Errors</h3>
			<div class="errors-list">
				<div v-for="error in recentErrors" :key="error.id" class="error-item">
					<span class="error-type">{{ error.type }}</span>
					<span class="error-message">{{ error.message }}</span>
					<span class="error-count">{{ error.count }}x</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface PaymentMethodStat {
	type: string;
	percentage: number;
	count: number;
}

interface VolumePoint {
	label: string;
	count: number;
}

interface CurrencyStat {
	currency: string;
	amount: number;
	percentage: number;
}

interface ErrorStat {
	id: string;
	type: string;
	message: string;
	count: number;
}

interface Props {
	title?: string;
	successRate?: number;
	successRateHistory?: number[];
	avgAmount?: number;
	avgAmountTrend?: number;
	peakHours?: string[];
	peakHoursPercentage?: number;
	paymentMethods?: PaymentMethodStat[];
	volumeData?: VolumePoint[];
	currencyBreakdown?: CurrencyStat[];
	recentErrors?: ErrorStat[];
}

const props = withDefaults(defineProps<Props>(), {
	title: "Payment Analytics",
	successRate: 95,
	successRateHistory: () => [92, 94, 96, 93, 95, 97, 95],
	avgAmount: 4500,
	avgAmountTrend: 5.2,
	peakHours: () => ["2PM", "3PM"],
	peakHoursPercentage: 35,
	paymentMethods: () => [
		{ type: "Card", percentage: 65, count: 650 },
		{ type: "Apple Pay", percentage: 20, count: 200 },
		{ type: "Google Pay", percentage: 10, count: 100 },
		{ type: "Other", percentage: 5, count: 50 },
	],
	volumeData: () => [
		{ label: "Mon", count: 120 },
		{ label: "Tue", count: 150 },
		{ label: "Wed", count: 180 },
		{ label: "Thu", count: 140 },
		{ label: "Fri", count: 200 },
		{ label: "Sat", count: 90 },
		{ label: "Sun", count: 70 },
	],
	currencyBreakdown: () => [
		{ currency: "USD", amount: 500000, percentage: 70 },
		{ currency: "EUR", amount: 150000, percentage: 20 },
		{ currency: "GBP", amount: 75000, percentage: 10 },
	],
	recentErrors: () => [],
});

const emit = defineEmits<{
	refresh: [];
	periodChange: [period: string];
}>();

const selectedPeriod = ref("7d");

const refresh = () => {
	emit("refresh");
};

const formatCurrency = (amount: number, currency = "USD"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};

const getVolumeHeight = (count: number): string => {
	const max = Math.max(...props.volumeData.map((v) => v.count), 1);
	return `${(count / max) * 100}%`;
};
</script>

<style scoped>
.stripe-analytics {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.analytics-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.analytics-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.analytics-controls {
	display: flex;
	gap: 12px;
}

.period-select,
.refresh-btn {
	padding: 8px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.refresh-btn {
	background: #635bff;
	color: white;
	border-color: #635bff;
	cursor: pointer;
}

.refresh-btn:hover {
	background: #4a4bd9;
}

.analytics-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-bottom: 24px;
}

.analytics-card {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.card-header {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
}

.card-icon {
	font-size: 20px;
}

.card-title {
	font-size: 14px;
	color: #666;
}

.card-value {
	font-size: 28px;
	font-weight: 600;
	margin-bottom: 8px;
}

.card-trend {
	font-size: 14px;
}

.card-trend.up {
	color: #10b981;
}

.card-trend.down {
	color: #ef4444;
}

.card-detail {
	font-size: 12px;
	color: #666;
}

.mini-chart {
	display: flex;
	align-items: flex-end;
	gap: 3px;
	height: 40px;
}

.mini-bar {
	flex: 1;
	background: #635bff;
	border-radius: 2px;
	min-height: 4px;
}

.payment-methods-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.method-item {
	display: flex;
	align-items: center;
	gap: 8px;
}

.method-name {
	font-size: 12px;
	width: 70px;
}

.method-bar-container {
	flex: 1;
	height: 8px;
	background: #f0f0f0;
	border-radius: 4px;
}

.method-bar {
	height: 100%;
	background: #635bff;
	border-radius: 4px;
}

.method-percentage {
	font-size: 12px;
	width: 35px;
	text-align: right;
}

.analytics-charts {
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 16px;
	margin-bottom: 24px;
}

.chart-panel {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.panel-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.volume-chart {
	display: flex;
	align-items: flex-end;
	gap: 8px;
	height: 150px;
	margin-bottom: 8px;
}

.volume-bar {
	flex: 1;
	background: linear-gradient(180deg, #635bff 0%, #4a4bd9 100%);
	border-radius: 4px 4px 0 0;
	position: relative;
	min-height: 10px;
}

.volume-tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background: #333;
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 10px;
	white-space: nowrap;
	opacity: 0;
	transition: opacity 0.2s;
}

.volume-bar:hover .volume-tooltip {
	opacity: 1;
}

.volume-labels {
	display: flex;
	gap: 8px;
}

.volume-labels span {
	flex: 1;
	text-align: center;
	font-size: 10px;
	color: #666;
}

.currency-breakdown {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.currency-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.currency-code {
	font-weight: 600;
	width: 40px;
}

.currency-amount {
	flex: 1;
	font-size: 14px;
}

.currency-percent {
	font-size: 14px;
	color: #666;
}

.analytics-errors {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
}

.errors-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.errors-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.error-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: #fee2e2;
	border-radius: 6px;
}

.error-type {
	font-weight: 600;
	color: #991b1b;
}

.error-message {
	flex: 1;
	font-size: 14px;
}

.error-count {
	font-size: 12px;
	color: #666;
}
</style>
