<script setup lang="ts">
import { useSmartReferralMatching } from "../composables/useSmartReferralMatching"

const props = defineProps<{
	userId: string
}>()

const {
	potentialMatches,
	userPotential,
	calculateUserPotential,
	findPotentialMatches,
	contactPotentialReferee,
	markMatchConverted,
	getHighPotentialUsers,
	analyzeMatchFactors,
} = useSmartReferralMatching()

const loading = ref(false)
const selectedMatch = ref<string | null>(null)

onMounted(async () => {
	loading.value = true
	await Promise.all([calculateUserPotential(props.userId), findPotentialMatches(props.userId)])
	loading.value = false
})

const highPotentialMatches = computed(() => getHighPotentialUsers(70))

async function handleContact(matchId: string) {
	try {
		await contactPotentialReferee(matchId)
		selectedMatch.value = null
	}
	catch (err) {
		console.error("Failed to contact:", err)
	}
}

async function handleMarkConverted(matchId: string) {
	try {
		await markMatchConverted(matchId)
	}
	catch (err) {
		console.error("Failed to mark converted:", err)
	}
}

function getScoreColor(score: number): string {
	if (score >= 90) return "text-green-600"
	if (score >= 70) return "text-blue-600"
	if (score >= 50) return "text-yellow-600"
	return "text-gray-600"
}

function getMatchIcon(reasonType: string): string {
	const icons: Record<string, string> = {
		network_overlap: "👥",
		interest_match: "💡",
		behavior_similarity: "📊",
		demographic_fit: "🎯",
		engagement_score: "⚡",
	}
	return icons[reasonType] || "🔗"
}
</script>

<template>
	<div class="smart-referral-matching">
		<div class="matching-header">
			<h3>Smart Referral Matching</h3>
			<p class="subtitle">AI แนะนำผู้ที่มีแนวโน้มสูงสำหรับการ Referral</p>
		</div>

		<div v-if="userPotential" class="user-potential-card">
			<h4>ศักยภาพการ Referral ของคุณ</h4>
			<div class="potential-score">
				<span class="score-label">คะแนนศักยภาพ</span>
				<span class="score-value" :class="getScoreColor(userPotential.score)">
					{{ userPotential.score }}%
				</span>
			</div>
			<div class="potential-factors">
				<div
					v-for="(value, factor) in userPotential.factors"
					:key="factor"
					class="factor-bar"
				>
					<span class="factor-name">{{ factor }}</span>
					<div class="factor-progress">
						<div
							class="factor-fill"
							:style="{ width: `${Math.round(value * 100)}%` }"
						/>
					</div>
					<span class="factor-value">{{ Math.round(value * 100) }}%</span>
				</div>
			</div>
		</div>

		<div v-if="loading" class="loading-state">
			<div class="spinner" />
			<p>กำลังวิเคราะห์...</p>
		</div>

		<div v-else-if="potentialMatches.length > 0" class="potential-matches">
			<h4>
				ผู้มีแนวโน้มสูง
				<span class="count">({{ highPotentialMatches.length }})</span>
			</h4>

			<div class="matches-grid">
				<div
					v-for="match in highPotentialMatches.slice(0, 6)"
					:key="match.id"
					class="match-card"
					:class="{ selected: selectedMatch === match.id }"
					@click="selectedMatch = selectedMatch === match.id ? null : match.id"
				>
					<div class="match-header">
						<div class="match-avatar">{{ match.potentialRefereeId[0] }}</div>
						<div class="match-info">
							<span class="match-id">{{ match.potentialRefereeId }}</span>
							<span
								class="match-score"
								:class="getScoreColor(match.score)"
							>
								{{ match.score }}% Match
							</span>
						</div>
					</div>

					<div v-if="selectedMatch === match.id" class="match-details">
						<h5>เหตุผลที่แนะนำ</h5>
						<div class="reasons-list">
							<div
								v-for="reason in analyzeMatchFactors(match)"
								:key="reason.type"
								class="reason-item"
							>
								<span class="reason-icon">{{ getMatchIcon(reason.type) }}</span>
								<div class="reason-content">
									<span class="reason-type">{{ reason.type }}</span>
									<span class="reason-impact" :class="reason.impact">
										{{ reason.impact }}
									</span>
								</div>
							</div>
						</div>

						<div class="match-actions">
							<button
								class="contact-btn"
								@click.stop="handleContact(match.id)"
							>
								ส่งคำเชิญ
							</button>
							<button
								v-if="match.status === 'contacted'"
								class="converted-btn"
								@click.stop="handleMarkConverted(match.id)"
							>
								สมัครแล้ว
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="empty-state">
			<p>ยังไม่มีข้อมูลการจับคู่</p>
			<button
				class="refresh-btn"
				@click="findPotentialMatches(userId)"
			>
				รีเฟรช
			</button>
		</div>
	</div>
</template>

<style scoped>
.smart-referral-matching {
	@apply p-6 bg-white rounded-lg shadow-md;
}

.matching-header {
	@apply mb-6;
}

.matching-header h3 {
	@apply text-xl font-bold text-gray-800 mb-2;
}

.subtitle {
	@apply text-sm text-gray-600;
}

.user-potential-card {
	@apply p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-6;
}

.user-potential-card h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.potential-score {
	@apply flex items-center justify-between mb-4;
}

.score-label {
	@apply text-sm text-gray-600;
}

.score-value {
	@apply text-2xl font-bold;
}

.potential-factors {
	@apply space-y-2;
}

.factor-bar {
	@apply flex items-center gap-2;
}

.factor-name {
	@apply w-24 text-xs text-gray-600 capitalize;
}

.factor-progress {
	@apply flex-1 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.factor-fill {
	@apply h-full bg-blue-500 rounded-full transition-all;
}

.factor-value {
	@apply w-10 text-xs text-gray-600 text-right;
}

.loading-state {
	@apply flex flex-col items-center py-8;
}

.spinner {
	@apply w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4;
}

.potential-matches h4 {
	@apply text-sm font-semibold text-gray-700 mb-4;
}

.count {
	@apply text-gray-500 font-normal;
}

.matches-grid {
	@apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.match-card {
	@apply p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all;
}

.match-card.selected {
	@apply border-blue-500 ring-2 ring-blue-200;
}

.match-header {
	@apply flex items-center gap-3;
}

.match-avatar {
	@apply w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold;
}

.match-info {
	@apply flex flex-col;
}

.match-id {
	@apply text-sm font-medium text-gray-800;
}

.match-score {
	@apply text-xs font-semibold;
}

.match-details {
	@apply mt-4 pt-4 border-t border-gray-200;
}

.match-details h5 {
	@apply text-xs font-semibold text-gray-600 mb-3;
}

.reasons-list {
	@apply space-y-2 mb-4;
}

.reason-item {
	@apply flex items-center gap-2;
}

.reason-icon {
	@apply text-lg;
}

.reason-content {
	@apply flex items-center gap-2 flex-1;
}

.reason-type {
	@apply text-xs text-gray-700 capitalize;
}

.reason-impact {
	@apply text-xs px-2 py-0.5 rounded-full;
}

.reason-impact.high {
	@apply bg-green-100 text-green-700;
}

.reason-impact.medium {
	@apply bg-yellow-100 text-yellow-700;
}

.reason-impact.low {
	@apply bg-gray-100 text-gray-600;
}

.match-actions {
	@apply flex gap-2;
}

.contact-btn {
	@apply flex-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors;
}

.converted-btn {
	@apply px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors;
}

.empty-state {
	@apply text-center py-8;
}

.empty-state p {
	@apply text-gray-500 mb-4;
}

.refresh-btn {
	@apply px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors;
}
</style>
