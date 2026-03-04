<script setup lang="ts">
import { useReferralRetargeting } from "../composables/useReferralRetargeting"

const props = defineProps<{
	userId: string
}>()

const {
	userFunnels,
	activeCampaigns,
	fetchUserFunnels,
	fetchActiveCampaigns,
	createRetargetingCampaign,
	getAbandonedFunnels,
	getFunnelConversionRate,
	pauseCampaign,
	resumeCampaign,
} = useReferralRetargeting()

const loading = ref(false)
const showCreateModal = ref(false)

const newCampaign = ref({
	name: "",
	targetStage: "signup_started",
	trigger: {
		type: "time_delay" as "time_delay" | "stage_abandoned" | "behavior_based",
		delay: 24,
	},
	channels: ["email"] as ("email" | "push" | "sms" | "in_app")[],
	message: {
		subject: "",
		body: "",
		ctaText: "ดำเนินการต่อ",
		ctaLink: "",
	},
})

onMounted(async () => {
	loading.value = true
	await Promise.all([fetchUserFunnels(props.userId), fetchActiveCampaigns()])
	loading.value = false
})

const funnels = computed(() => userFunnels.value[props.userId] || [])
const abandonedFunnels = computed(() => getAbandonedFunnels(props.userId, 24))

const funnelStats = computed(() => {
	const total = funnels.value.length
	const completed = funnels.value.filter((f) => f.status === "completed").length
	const converted = funnels.value.filter((f) => f.status === "converted").length
	const abandoned = funnels.value.filter((f) => f.status === "abandoned").length
	const inProgress = funnels.value.filter((f) => f.status === "in_progress").length

	return { total, completed, converted, abandoned, inProgress }
})

const conversionRate = computed(() => {
	if (funnels.value.length === 0) return 0
	const codes = [...new Set(funnels.value.map((f) => f.referralCode))]
	return codes.length > 0 ? getFunnelConversionRate(codes[0]) : 0
})

async function handleCreateCampaign() {
	try {
		await createRetargetingCampaign(newCampaign.value)
		showCreateModal.value = false
		newCampaign.value = {
			name: "",
			targetStage: "signup_started",
			trigger: { type: "time_delay", delay: 24 },
			channels: ["email"],
			message: { subject: "", body: "", ctaText: "ดำเนินการต่อ", ctaLink: "" },
		}
	}
	catch (err) {
		console.error("Failed to create campaign:", err)
	}
}

async function handlePause(campaignId: string) {
	try {
		await pauseCampaign(campaignId)
	}
	catch (err) {
		console.error("Failed to pause campaign:", err)
	}
}

async function handleResume(campaignId: string) {
	try {
		await resumeCampaign(campaignId)
	}
	catch (err) {
		console.error("Failed to resume campaign:", err)
	}
}

function getStageName(stage: string): string {
	const names: Record<string, string> = {
		link_clicked: "คลิกลิงก์",
		landing_viewed: "ดูหน้า Landing",
		signup_started: "เริ่มสมัคร",
		signup_completed: "สมัครเสร็จ",
		purchase_made: "ซื้อสินค้า",
	}
	return names[stage] || stage
}

function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		active: "text-green-600 bg-green-100",
		paused: "text-yellow-600 bg-yellow-100",
		ended: "text-gray-600 bg-gray-100",
	}
	return colors[status] || "text-gray-600 bg-gray-100"
}

function getStageProgress(funnel: { stages: { completed: boolean }[] }): number {
	const completed = funnel.stages.filter((s) => s.completed).length
	return Math.round((completed / funnel.stages.length) * 100)
}
</script>

<template>
	<div class="referral-retargeting">
		<div class="retargeting-header">
			<h3>Referral Retargeting</h3>
			<button class="create-btn" @click="showCreateModal = true">
				+ สร้าง Campaign
			</button>
		</div>

		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-label">Funnels ทั้งหมด</span>
				<span class="stat-value">{{ funnelStats.total }}</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">กำลังดำเนินการ</span>
				<span class="stat-value">{{ funnelStats.inProgress }}</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">สำเร็จ</span>
				<span class="stat-value">{{ funnelStats.completed }}</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">Converted</span>
				<span class="stat-value">{{ funnelStats.converted }}</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">Abandoned</span>
				<span class="stat-value">{{ funnelStats.abandoned }}</span>
			</div>
			<div class="stat-card">
				<span class="stat-label">Conversion Rate</span>
				<span class="stat-value">{{ conversionRate }}%</span>
			</div>
		</div>

		<div v-if="abandonedFunnels.length > 0" class="abandoned-section">
			<h4>รอ Retargeting ({{ abandonedFunnels.length }})</h4>
			<div class="funnels-list">
				<div
					v-for="funnel in abandonedFunnels.slice(0, 5)"
					:key="funnel.id"
					class="funnel-card"
				>
					<div class="funnel-header">
						<code class="referral-code">{{ funnel.referralCode }}</code>
						<span class="abandoned-time">
							{{ Math.floor((Date.now() - new Date(funnel.lastActivityAt).getTime()) / (1000 * 60 * 60)) }} ชม. ที่แล้ว
						</span>
					</div>
					<div class="funnel-progress">
						<div class="progress-bar">
							<div
								class="progress-fill"
								:style="{ width: `${getStageProgress(funnel)}%` }"
							/>
						</div>
						<span class="progress-text">{{ getStageProgress(funnel) }}%</span>
					</div>
					<div class="funnel-stages">
						<div
							v-for="stage in funnel.stages"
							:key="stage.stage"
							class="stage-dot"
							:class="{ completed: stage.completed, abandoned: stage.abandonedAt }"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="campaigns-section">
			<h4>Campaigns ที่ใช้งานอยู่</h4>
			<div v-if="activeCampaigns.length === 0" class="empty-campaigns">
				<p>ยังไม่มี Campaign</p>
			</div>
			<div v-else class="campaigns-list">
				<div
					v-for="campaign in activeCampaigns"
					:key="campaign.id"
					class="campaign-card"
				>
					<div class="campaign-header">
						<div class="campaign-info">
							<h5>{{ campaign.name }}</h5>
							<span class="target-stage">
								เป้าหมาย: {{ getStageName(campaign.targetStage) }}
							</span>
						</div>
						<span
							class="campaign-status"
							:class="getStatusColor(campaign.status)"
						>
							{{ campaign.status }}
						</span>
					</div>

					<div class="campaign-channels">
						<span
							v-for="channel in campaign.channels"
							:key="channel"
							class="channel-tag"
						>
							{{ channel }}
						</span>
					</div>

					<div class="campaign-metrics">
						<div class="metric">
							<span class="metric-value">{{ campaign.metrics.sent }}</span>
							<span class="metric-label">ส่งแล้ว</span>
						</div>
						<div class="metric">
							<span class="metric-value">{{ campaign.metrics.opened }}</span>
							<span class="metric-label">เปิดอ่าน</span>
						</div>
						<div class="metric">
							<span class="metric-value">{{ campaign.metrics.clicked }}</span>
							<span class="metric-label">คลิก</span>
						</div>
						<div class="metric">
							<span class="metric-value">{{ campaign.metrics.converted }}</span>
							<span class="metric-label">สำเร็จ</span>
						</div>
					</div>

					<div class="campaign-actions">
						<button
							v-if="campaign.status === 'active'"
							class="action-btn pause"
							@click="handlePause(campaign.id)"
						>
							หยุดชั่วคราว
						</button>
						<button
							v-else
							class="action-btn resume"
							@click="handleResume(campaign.id)"
						>
							เปิดใช้งาน
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
			<div class="modal" @click.stop>
				<h4>สร้าง Retargeting Campaign</h4>

				<div class="form-group">
					<label>ชื่อ Campaign</label>
					<input v-model="newCampaign.name" type="text" placeholder="เช่น สมัครไม่เสร็จ - 24 ชม.">
				</div>

				<div class="form-group">
					<label>เป้าหมาย Stage</label>
					<select v-model="newCampaign.targetStage">
						<option value="link_clicked">คลิกลิงก์</option>
						<option value="landing_viewed">ดูหน้า Landing</option>
						<option value="signup_started">เริ่มสมัคร</option>
						<option value="signup_completed">สมัครเสร็จ</option>
					</select>
				</div>

				<div class="form-group">
					<label>Trigger</label>
					<select v-model="newCampaign.trigger.type">
						<option value="time_delay">หลังจากเวลาที่กำหนด</option>
						<option value="stage_abandoned">เมื่อออกจาก Stage</option>
					</select>
				</div>

				<div v-if="newCampaign.trigger.type === 'time_delay'" class="form-group">
					<label>ดีเลย์ (ชั่วโมง)</label>
					<input v-model.number="newCampaign.trigger.delay" type="number" min="1">
				</div>

				<div class="form-group">
					<label>Channels</label>
					<div class="checkbox-group">
						<label v-for="channel in ['email', 'push', 'sms', 'in_app']" :key="channel" class="checkbox-label">
							<input
								v-model="newCampaign.channels"
								type="checkbox"
								:value="channel"
							>
							{{ channel }}
						</label>
					</div>
				</div>

				<div class="form-group">
					<label>หัวข้อ Email</label>
					<input v-model="newCampaign.message.subject" type="text">
				</div>

				<div class="form-group">
					<label>เนื้อหา</label>
					<textarea v-model="newCampaign.message.body" rows="3" />
				</div>

				<div class="form-group">
					<label>ข้อความ CTA</label>
					<input v-model="newCampaign.message.ctaText" type="text">
				</div>

				<div class="modal-actions">
					<button class="cancel-btn" @click="showCreateModal = false">
						ยกเลิก
					</button>
					<button class="save-btn" @click="handleCreateCampaign">
						สร้าง
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.referral-retargeting {
	@apply p-6 bg-white rounded-lg shadow-md;
}

.retargeting-header {
	@apply flex items-center justify-between mb-6;
}

.retargeting-header h3 {
	@apply text-xl font-bold text-gray-800;
}

.create-btn {
	@apply px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors;
}

.stats-grid {
	@apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6;
}

.stat-card {
	@apply p-3 bg-gray-50 rounded-lg text-center;
}

.stat-label {
	@apply block text-xs text-gray-600 mb-1;
}

.stat-value {
	@apply block text-lg font-bold text-gray-800;
}

.abandoned-section {
	@apply mb-6;
}

.abandoned-section h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.funnels-list {
	@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.funnel-card {
	@apply p-4 border border-gray-200 rounded-lg;
}

.funnel-header {
	@apply flex items-center justify-between mb-3;
}

.referral-code {
	@apply px-2 py-1 bg-gray-100 rounded text-xs font-mono;
}

.abandoned-time {
	@apply text-xs text-red-500;
}

.funnel-progress {
	@apply flex items-center gap-2 mb-3;
}

.progress-bar {
	@apply flex-1 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
	@apply h-full bg-blue-500 rounded-full transition-all;
}

.progress-text {
	@apply text-xs text-gray-600 w-10 text-right;
}

.funnel-stages {
	@apply flex gap-1;
}

.stage-dot {
	@apply w-3 h-3 rounded-full bg-gray-300;
}

.stage-dot.completed {
	@apply bg-green-500;
}

.stage-dot.abandoned {
	@apply bg-red-500;
}

.campaigns-section {
	@apply mt-6;
}

.campaigns-section h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.empty-campaigns {
	@apply p-8 text-center text-gray-500 bg-gray-50 rounded-lg;
}

.campaigns-list {
	@apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.campaign-card {
	@apply p-4 border border-gray-200 rounded-lg;
}

.campaign-header {
	@apply flex items-start justify-between mb-3;
}

.campaign-info h5 {
	@apply font-semibold text-gray-800;
}

.target-stage {
	@apply text-xs text-gray-500;
}

.campaign-status {
	@apply px-2 py-1 rounded-full text-xs font-medium capitalize;
}

.campaign-channels {
	@apply flex flex-wrap gap-2 mb-3;
}

.channel-tag {
	@apply px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full;
}

.campaign-metrics {
	@apply grid grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg;
}

.metric {
	@apply text-center;
}

.metric-value {
	@apply block text-lg font-bold text-gray-800;
}

.metric-label {
	@apply block text-xs text-gray-500;
}

.campaign-actions {
	@apply flex gap-2;
}

.action-btn {
	@apply flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors;
}

.action-btn.pause {
	@apply bg-yellow-100 text-yellow-700 hover:bg-yellow-200;
}

.action-btn.resume {
	@apply bg-green-100 text-green-700 hover:bg-green-200;
}

.modal-overlay {
	@apply fixed inset-0 bg-black/50 flex items-center justify-center z-50;
}

.modal {
	@apply bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto;
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
.form-group select,
.form-group textarea {
	@apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.checkbox-group {
	@apply flex flex-wrap gap-4;
}

.checkbox-label {
	@apply flex items-center gap-2 text-sm;
}

.modal-actions {
	@apply flex gap-3 justify-end mt-6;
}

.cancel-btn {
	@apply px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.save-btn {
	@apply px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors;
}
</style>
