<script setup lang="ts">
import { useAffiliateCoupons } from "../composables/useAffiliateCoupons"

const props = defineProps<{
	affiliateId: string
}>()

const {
	affiliateCoupons,
	couponUsages,
	createAffiliateCoupon,
	createStripeLinkedCoupon,
	getAffiliateCoupons,
	pauseAffiliateCoupon,
	activateAffiliateCoupon,
	deleteAffiliateCoupon,
	getCouponUsages,
	getCouponStats,
	calculateAffiliateCommission,
} = useAffiliateCoupons()

const loading = ref(false)
const showCreateModal = ref(false)

const newCoupon = ref({
	discountType: "percentage" as "percentage" | "fixed_amount",
	discountValue: 10,
	code: "",
	appliesTo: "all" as "all" | "specific_products" | "categories",
	maxUses: 100,
	expiresAt: "",
})

onMounted(async () => {
	loading.value = true
	await getAffiliateCoupons(props.affiliateId)
	loading.value = false
})

const coupons = computed(() => affiliateCoupons.value[props.affiliateId] || [])

const activeCoupons = computed(() => coupons.value.filter((c) => c.status === "active"))
const pausedCoupons = computed(() => coupons.value.filter((c) => c.status === "paused"))
const expiredCoupons = computed(() => coupons.value.filter((c) => c.status === "expired" || c.status === "depleted"))

const totalRevenue = computed(() => coupons.value.reduce((sum, c) => sum + c.revenueGenerated, 0))
const totalConversions = computed(() => coupons.value.reduce((sum, c) => sum + c.conversionsCount, 0))

async function handleCreateCoupon() {
	try {
		await createAffiliateCoupon({
			affiliateId: props.affiliateId,
			...newCoupon.value,
			expiresAt: newCoupon.value.expiresAt ? new Date(newCoupon.value.expiresAt) : undefined,
		})
		showCreateModal.value = false
		newCoupon.value = {
			discountType: "percentage",
			discountValue: 10,
			code: "",
			appliesTo: "all",
			maxUses: 100,
			expiresAt: "",
		}
	}
	catch (err) {
		console.error("Failed to create coupon:", err)
	}
}

async function handlePause(couponId: string) {
	try {
		await pauseAffiliateCoupon(couponId)
	}
	catch (err) {
		console.error("Failed to pause coupon:", err)
	}
}

async function handleActivate(couponId: string) {
	try {
		await activateAffiliateCoupon(couponId)
	}
	catch (err) {
		console.error("Failed to activate coupon:", err)
	}
}

async function handleDelete(couponId: string) {
	if (!confirm("ต้องการลบ coupon นี้?")) return
	try {
		await deleteAffiliateCoupon(couponId)
	}
	catch (err) {
		console.error("Failed to delete coupon:", err)
	}
}

async function viewUsages(couponId: string) {
	try {
		await getCouponUsages(couponId)
	}
	catch (err) {
		console.error("Failed to get usages:", err)
	}
}

function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		active: "text-green-600 bg-green-100",
		paused: "text-yellow-600 bg-yellow-100",
		expired: "text-red-600 bg-red-100",
		depleted: "text-gray-600 bg-gray-100",
	}
	return colors[status] || "text-gray-600 bg-gray-100"
}

function copyToClipboard(code: string) {
	navigator.clipboard.writeText(code)
}
</script>

<template>
	<div class="affiliate-coupons">
		<div class="coupons-header">
			<h3>Affiliate Coupon Codes</h3>
			<button class="create-btn" @click="showCreateModal = true">
				+ สร้าง Coupon
			</button>
		</div>

		<div class="stats-row">
			<div class="stat-card">
				<span class="stat-label">Coupons ทั้งหมด</span>
				<span class="stat-value">{{ coupons.length }}</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">รายได้รวม</span>
				<span class="stat-value">{{ totalRevenue.toLocaleString() }}฿</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">Conversions</span>
				<span class="stat-value">{{ totalConversions }}</span>
			</div>
		</div>

		<div v-if="loading" class="loading">
			<div class="spinner" />
		</div>

		<div v-else class="coupons-sections">
			<div v-if="activeCoupons.length > 0" class="coupon-section">
				<h4>กำลังใช้งาน ({{ activeCoupons.length }})</h4>
				<div class="coupons-list">
					<div
						v-for="coupon in activeCoupons"
						:key="coupon.id"
						class="coupon-card"
					>
						<div class="coupon-main">
							<div class="coupon-code-section">
								<code class="coupon-code">{{ coupon.code }}</code>
								<button
									class="copy-btn"
									@click="copyToClipboard(coupon.code)"
								>
									คัดลอก
								</button>
							</div>
							<span
								class="coupon-status"
								:class="getStatusColor(coupon.status)"
							>
								{{ coupon.status }}
							</span>
						</div>

						<div class="coupon-details">
							<div class="discount-info">
								<span class="discount-type">{{ coupon.discountType }}</span>
								<span class="discount-value">{{ coupon.discountValue }}{{ coupon.discountType === 'percentage' ? '%' : '฿' }}</span>
							</div>
							<div class="usage-info">
								<span>ใช้แล้ว: {{ coupon.currentUses }}/{{ coupon.maxUses || '∞' }}</span>
							</div>
						</div>

						<div class="coupon-metrics">
							<div class="metric">
								<span class="metric-label">รายได้</span>
								<span class="metric-value">{{ coupon.revenueGenerated.toLocaleString() }}฿</span>
							</div>
							<div class="metric">
								<span class="metric-label">Conversions</span>
								<span class="metric-value">{{ coupon.conversionsCount }}</span>
							</div>
						</div>

						<div class="coupon-actions">
							<button
								class="action-btn pause"
								@click="handlePause(coupon.id)"
							>
								หยุดใช้งาน
							</button>
							<button
								class="action-btn usages"
								@click="viewUsages(coupon.id)"
							>
								ดูรายละเอียด
							</button>
							<button
								class="action-btn delete"
								@click="handleDelete(coupon.id)"
							>
								ลบ
							</button>
						</div>
					</div>
				</div>
			</div>

			<div v-if="pausedCoupons.length > 0" class="coupon-section">
				<h4>หยุดใช้งาน ({{ pausedCoupons.length }})</h4>
				<div class="coupons-list">
					<div
						v-for="coupon in pausedCoupons"
						:key="coupon.id"
						class="coupon-card paused"
					>
						<div class="coupon-main">
							<code class="coupon-code">{{ coupon.code }}</code>
							<span
								class="coupon-status"
								:class="getStatusColor(coupon.status)"
							>
								{{ coupon.status }}
							</span>
						</div>
						<div class="coupon-actions">
							<button
								class="action-btn activate"
								@click="handleActivate(coupon.id)"
							>
								เปิดใช้งาน
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
			<div class="modal" @click.stop>
				<h4>สร้าง Coupon ใหม่</h4>

				<div class="form-group">
					<label>ประเภทส่วนลด</label>
					<select v-model="newCoupon.discountType">
						<option value="percentage">เปอร์เซ็นต์ (%)</option>
						<option value="fixed_amount">จำนวนเงิน (฿)</option>
					</select>
				</div>

				<div class="form-group">
					<label>มูลค่าส่วนลด</label>
					<input
						v-model.number="newCoupon.discountValue"
						type="number"
						:max="newCoupon.discountType === 'percentage' ? 100 : undefined"
						min="0"
					>
				</div>

				<div class="form-group">
					<label>รหัส Coupon (เว้นว่างให้สร้างอัตโนมัติ)</label>
					<input v-model="newCoupon.code" type="text" placeholder="AFF10">
				</div>

				<div class="form-group">
					<label>ใช้ได้สูงสุด (ครั้ง)</label>
					<input v-model.number="newCoupon.maxUses" type="number" min="1">
				</div>

				<div class="form-group">
					<label>วันหมดอายุ</label>
					<input v-model="newCoupon.expiresAt" type="date">
				</div>

				<div class="modal-actions">
					<button class="cancel-btn" @click="showCreateModal = false">
						ยกเลิก
					</button>
					<button class="save-btn" @click="handleCreateCoupon">
						สร้าง
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.affiliate-coupons {
	@apply p-6 bg-white rounded-lg shadow-md;
}

.coupons-header {
	@apply flex items-center justify-between mb-6;
}

.coupons-header h3 {
	@apply text-xl font-bold text-gray-800;
}

.create-btn {
	@apply px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors;
}

.stats-row {
	@apply grid grid-cols-3 gap-4 mb-6;
}

.stat-card {
	@apply p-4 bg-gray-50 rounded-lg text-center;
}

.stat-label {
	@apply block text-xs text-gray-600 mb-1;
}

.stat-value {
	@apply block text-xl font-bold text-gray-800;
}

.loading {
	@apply flex justify-center py-8;
}

.spinner {
	@apply w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin;
}

.coupons-sections {
	@apply space-y-6;
}

.coupon-section h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.coupons-list {
	@apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.coupon-card {
	@apply p-4 border border-gray-200 rounded-lg;
}

.coupon-card.paused {
	@apply opacity-60;
}

.coupon-main {
	@apply flex items-center justify-between mb-3;
}

.coupon-code-section {
	@apply flex items-center gap-2;
}

.coupon-code {
	@apply px-3 py-1.5 bg-gray-100 rounded text-sm font-mono font-semibold text-gray-800;
}

.copy-btn {
	@apply text-xs text-blue-500 hover:text-blue-600;
}

.coupon-status {
	@apply px-2 py-1 rounded-full text-xs font-medium capitalize;
}

.coupon-details {
	@apply flex items-center justify-between mb-3 text-sm;
}

.discount-info {
	@apply flex items-center gap-2;
}

.discount-type {
	@apply text-xs text-gray-500 uppercase;
}

.discount-value {
	@apply font-semibold text-gray-800;
}

.usage-info {
	@apply text-xs text-gray-500;
}

.coupon-metrics {
	@apply flex gap-4 mb-3 pb-3 border-b border-gray-200;
}

.metric {
	@apply flex flex-col;
}

.metric-label {
	@apply text-xs text-gray-500;
}

.metric-value {
	@apply text-sm font-semibold text-gray-800;
}

.coupon-actions {
	@apply flex gap-2;
}

.action-btn {
	@apply px-3 py-1.5 text-xs font-medium rounded transition-colors;
}

.action-btn.pause {
	@apply bg-yellow-100 text-yellow-700 hover:bg-yellow-200;
}

.action-btn.activate {
	@apply bg-green-100 text-green-700 hover:bg-green-200;
}

.action-btn.usages {
	@apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

.action-btn.delete {
	@apply bg-red-100 text-red-700 hover:bg-red-200;
}

.modal-overlay {
	@apply fixed inset-0 bg-black/50 flex items-center justify-center z-50;
}

.modal {
	@apply bg-white rounded-lg p-6 w-full max-w-md;
}

.modal h4 {
	@apply text-lg font-semibold text-gray-800 mb-4;
}

.form-group {
	@apply mb-4;
}

.form-group label {
	@apply block text-sm text-gray-600 mb-1;
}

.form-group input,
.form-group select {
	@apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.modal-actions {
	@apply flex gap-3 justify-end;
}

.cancel-btn {
	@apply px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.save-btn {
	@apply px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors;
}
</style>
