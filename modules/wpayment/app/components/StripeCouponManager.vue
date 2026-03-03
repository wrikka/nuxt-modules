<template>
	<div class="stripe-coupon-manager">
		<div class="manager-header">
			<h2 class="manager-title">{{ title }}</h2>
			<button class="btn-primary" @click="showCreateModal = true">Create Coupon</button>
		</div>

		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{{ stats.totalCoupons }}</span>
				<span class="stat-label">Total Coupons</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{{ stats.activeCoupons }}</span>
				<span class="stat-label">Active</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{{ stats.totalRedemptions }}</span>
				<span class="stat-label">Redemptions</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{{ formatCurrency(stats.totalDiscount) }}</span>
				<span class="stat-label">Total Discount</span>
			</div>
		</div>

		<div class="filters-bar">
			<input v-model="searchQuery" type="text" class="search-input" placeholder="Search coupons..." />
			<select v-model="filterActive" class="filter-select">
				<option value="">All Status</option>
				<option value="true">Active</option>
				<option value="false">Inactive</option>
			</select>
		</div>

		<div class="coupons-list">
			<div v-for="coupon in filteredCoupons" :key="coupon.id" class="coupon-card">
				<div class="coupon-header">
					<span class="coupon-name">{{ coupon.name || coupon.id }}</span>
					<span :class="['coupon-status', coupon.valid ? 'active' : 'inactive']">
						{{ coupon.valid ? 'Active' : 'Inactive' }}
					</span>
				</div>
				<div class="coupon-details">
					<div class="coupon-discount">
						<span v-if="coupon.percentOff" class="discount-value">{{ coupon.percentOff }}% off</span>
						<span v-else-if="coupon.amountOff" class="discount-value">{{ formatCurrency(coupon.amountOff, coupon.currency) }} off</span>
					</div>
					<div class="coupon-duration">
						<span class="duration-label">Duration:</span>
						<span class="duration-value">{{ formatDuration(coupon.duration, coupon.durationInMonths) }}</span>
					</div>
					<div class="coupon-redemptions">
						<span class="redemptions-label">Redemptions:</span>
						<span class="redemptions-value">{{ coupon.timesRedeemed }}/{{ coupon.maxRedemptions || '∞' }}</span>
					</div>
				</div>
				<div class="coupon-actions">
					<button class="btn-icon" @click="editCoupon(coupon)">✏️</button>
					<button class="btn-icon" @click="toggleCouponStatus(coupon)">{{ coupon.valid ? '⏸️' : '▶️' }}</button>
					<button class="btn-icon danger" @click="deleteCoupon(coupon)">🗑️</button>
				</div>
			</div>
		</div>

		<div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
			<div class="modal-content">
				<h3 class="modal-title">{{ editingCoupon ? 'Edit Coupon' : 'Create Coupon' }}</h3>
				<div class="modal-form">
					<div class="form-field">
						<label class="field-label">Name</label>
						<input v-model="couponForm.name" type="text" class="field-input" placeholder="Summer Sale 2024" />
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Discount Type</label>
							<select v-model="discountType" class="field-select">
								<option value="percent">Percentage</option>
								<option value="amount">Fixed Amount</option>
							</select>
						</div>
						<div class="form-field">
							<label class="field-label">{{ discountType === 'percent' ? 'Percentage' : 'Amount (cents)' }}</label>
							<input v-model.number="discountValue" type="number" class="field-input" :min="discountType === 'percent' ? 1 : 1" :max="discountType === 'percent' ? 100 : undefined" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Duration</label>
							<select v-model="couponForm.duration" class="field-select">
								<option value="once">Once</option>
								<option value="repeating">Multiple Months</option>
								<option value="forever">Forever</option>
							</select>
						</div>
						<div class="form-field" v-if="couponForm.duration === 'repeating'">
							<label class="field-label">Months</label>
							<input v-model.number="couponForm.durationInMonths" type="number" class="field-input" min="1" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Max Redemptions</label>
							<input v-model.number="couponForm.maxRedemptions" type="number" class="field-input" min="1" placeholder="Unlimited" />
						</div>
						<div class="form-field">
							<label class="field-label">Expire Date</label>
							<input v-model="couponForm.redeemBy" type="date" class="field-input" />
						</div>
					</div>
				</div>
				<div class="modal-actions">
					<button class="btn-secondary" @click="closeModal">Cancel</button>
					<button class="btn-primary" @click="saveCoupon">{{ editingCoupon ? 'Update' : 'Create' }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { CouponSummary, CouponFormData, CouponStats } from "#wpayment/types";

interface Props {
	title?: string;
	coupons?: CouponSummary[];
	stats?: CouponStats;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Coupon Manager",
	coupons: () => [],
	stats: () => ({
		totalCoupons: 0,
		activeCoupons: 0,
		totalRedemptions: 0,
		totalDiscount: 0,
		averageDiscount: 0,
	}),
});

const emit = defineEmits<{
	create: [data: CouponFormData];
	update: [id: string, data: CouponFormData];
	delete: [id: string];
	toggle: [id: string];
}>();

const showCreateModal = ref(false);
const editingCoupon = ref<CouponSummary | null>(null);
const searchQuery = ref("");
const filterActive = ref("");
const discountType = ref<"percent" | "amount">("percent");
const discountValue = ref(10);

const couponForm = ref<CouponFormData>({
	name: "",
	duration: "once",
	durationInMonths: undefined,
	percentOff: 10,
	amountOff: undefined,
	currency: "usd",
	maxRedemptions: undefined,
	redeemBy: undefined,
	active: true,
});

const filteredCoupons = computed(() => {
	let result = props.coupons;

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter((c) => c.name?.toLowerCase().includes(query) || c.id.toLowerCase().includes(query));
	}

	if (filterActive.value) {
		const isActive = filterActive.value === "true";
		result = result.filter((c) => c.valid === isActive);
	}

	return result;
});

const editCoupon = (coupon: CouponSummary) => {
	editingCoupon.value = coupon;
	couponForm.value = {
		name: coupon.name || "",
		duration: coupon.duration,
		durationInMonths: coupon.durationInMonths,
		percentOff: coupon.percentOff,
		amountOff: coupon.amountOff,
		currency: coupon.currency,
		maxRedemptions: coupon.maxRedemptions,
		redeemBy: coupon.redeemBy,
		active: coupon.valid,
	};
	discountType.value = coupon.percentOff ? "percent" : "amount";
	discountValue.value = coupon.percentOff || coupon.amountOff || 0;
	showCreateModal.value = true;
};

const toggleCouponStatus = (coupon: CouponSummary) => {
	emit("toggle", coupon.id);
};

const deleteCoupon = (coupon: CouponSummary) => {
	emit("delete", coupon.id);
};

const saveCoupon = () => {
	const form = { ...couponForm.value };
	if (discountType.value === "percent") {
		form.percentOff = discountValue.value;
		form.amountOff = undefined;
	} else {
		form.amountOff = discountValue.value;
		form.percentOff = undefined;
	}

	if (editingCoupon.value) {
		emit("update", editingCoupon.value.id, form);
	} else {
		emit("create", form);
	}

	closeModal();
};

const closeModal = () => {
	showCreateModal.value = false;
	editingCoupon.value = null;
	couponForm.value = {
		name: "",
		duration: "once",
		durationInMonths: undefined,
		percentOff: 10,
		amountOff: undefined,
		currency: "usd",
		maxRedemptions: undefined,
		redeemBy: undefined,
		active: true,
	};
};

const formatCurrency = (amount: number, currency = "usd"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
};

const formatDuration = (duration: string, months?: number): string => {
	const labels: Record<string, string> = {
		once: "Once",
		repeating: `${months || 1} months`,
		forever: "Forever",
	};
	return labels[duration] || duration;
};
</script>

<style scoped>
.stripe-coupon-manager {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.filters-bar {
	display: flex;
	gap: 12px;
	margin-bottom: 24px;
}

.search-input {
	flex: 1;
	padding: 10px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.filter-select {
	padding: 10px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	background: white;
}

.coupons-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
}

.coupon-card {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
}

.coupon-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.coupon-name {
	font-weight: 600;
}

.coupon-status {
	font-size: 12px;
	padding: 4px 8px;
	border-radius: 4px;
}

.coupon-status.active {
	background: #d1fae5;
	color: #065f46;
}

.coupon-status.inactive {
	background: #fee2e2;
	color: #991b1b;
}

.coupon-details {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 12px;
	font-size: 14px;
}

.discount-value {
	font-weight: 600;
	color: #635bff;
}

.coupon-actions {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
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

.btn-primary:hover {
	background: #4a4bd9;
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
}

.modal-content {
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 500px;
}

.modal-title {
	font-size: 20px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.modal-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 16px;
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
.field-select {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
}
</style>
