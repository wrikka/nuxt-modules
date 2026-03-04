<script setup lang="ts">
import { useReferralContests } from "../composables/useReferralContests"

const props = defineProps<{
	userId: string
}>()

const {
	activeContests,
	currentLeaderboard,
	userBadges,
	fetchActiveContests,
	getContestLeaderboard,
	joinContest,
	getUserRank,
	fetchUserBadges,
	calculateGamificationScore,
} = useReferralContests()

const selectedContest = ref<string | null>(null)
const userGamificationScore = ref(0)

onMounted(async () => {
	await fetchActiveContests()
	await fetchUserBadges(props.userId)
	userGamificationScore.value = calculateGamificationScore(props.userId)
})

async function selectContest(contestId: string) {
	selectedContest.value = contestId
	await getContestLeaderboard(contestId)
}

async function handleJoinContest(contestId: string) {
	try {
		await joinContest(contestId, props.userId)
	}
	catch (err) {
		console.error("Failed to join contest:", err)
	}
}

const currentUserRank = computed(() => {
	if (!selectedContest.value) return 0
	return getUserRank(selectedContest.value, props.userId)
})

const topThree = computed(() => currentLeaderboard.value.slice(0, 3))
const currentUserEntry = computed(() =>
	currentLeaderboard.value.find((e) => e.userId === props.userId),
)
</script>

<template>
	<div class="referral-contests">
		<div class="contests-header">
			<h3>การแข่งขัน Referral</h3>
			<div class="gamification-score">
				<span class="score-label">คะแนนรวม</span>
				<span class="score-value">{{ userGamificationScore }}</span>
			</div>
		</div>

		<div v-if="userBadges.length > 0" class="user-badges">
			<h4>เหรียญตราของคุณ</h4>
			<div class="badges-row">
				<div
					v-for="badge in userBadges.slice(0, 5)"
					:key="badge.id"
					class="badge-item"
					:title="badge.badgeId"
				>
					🏆
				</div>
			</div>
		</div>

		<div class="contests-list">
			<h4>การแข่งขันที่กำลังเปิด</h4>
			<div
				v-for="contest in activeContests"
				:key="contest.id"
				class="contest-card"
				:class="{ active: selectedContest === contest.id }"
				@click="selectContest(contest.id)"
			>
				<div class="contest-info">
					<h5>{{ contest.name }}</h5>
					<p class="contest-description">{{ contest.description }}</p>
					<div class="contest-meta">
						<span class="contest-dates">
							{{ new Date(contest.startDate).toLocaleDateString() }} -
							{{ new Date(contest.endDate).toLocaleDateString() }}
						</span>
						<span class="prize-count">{{ contest.prizes.length }} รางวัล</span>
					</div>
				</div>
				<button
					v-if="selectedContest !== contest.id"
					class="join-btn"
					@click.stop="handleJoinContest(contest.id)"
				>
					เข้าร่วม
				</button>
			</div>
		</div>

		<div v-if="selectedContest && currentLeaderboard.length > 0" class="leaderboard">
			<h4>ตารางคะแนน</h4>

			<div class="podium">
				<div
					v-for="(entry, index) in topThree"
					:key="entry.id"
					class="podium-item"
					:class="`rank-${index + 1}`"
				>
					<div class="rank-badge">{{ index + 1 }}</div>
					<div class="podium-avatar">{{ entry.userName?.[0] || "?" }}</div>
					<div class="podium-name">{{ entry.userName || entry.userId }}</div>
					<div class="podium-score">{{ entry.score.toLocaleString() }}</div>
				</div>
			</div>

			<div v-if="currentUserEntry && currentUserRank > 3" class="user-ranking">
				<div class="rank-item current-user">
					<span class="rank-number">#{{ currentUserRank }}</span>
					<span class="rank-name">คุณ</span>
					<span class="rank-score">{{ currentUserEntry.score.toLocaleString() }}</span>
				</div>
			</div>

			<div class="leaderboard-list">
				<div
					v-for="entry in currentLeaderboard.slice(3, 10)"
					:key="entry.id"
					class="rank-item"
				>
					<span class="rank-number">#{{ entry.rank }}</span>
					<span class="rank-name">{{ entry.userName || entry.userId }}</span>
					<span class="rank-score">{{ entry.score.toLocaleString() }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.referral-contests {
	@apply p-6 bg-white rounded-lg shadow-md;
}

.contests-header {
	@apply flex items-center justify-between mb-6;
}

.contests-header h3 {
	@apply text-xl font-bold text-gray-800;
}

.gamification-score {
	@apply flex flex-col items-end;
}

.score-label {
	@apply text-xs text-gray-500;
}

.score-value {
	@apply text-2xl font-bold text-blue-600;
}

.user-badges {
	@apply mb-6;
}

.user-badges h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.badges-row {
	@apply flex gap-2;
}

.badge-item {
	@apply w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition-transform;
}

.contests-list {
	@apply mb-6;
}

.contests-list h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.contest-card {
	@apply p-4 border border-gray-200 rounded-lg mb-3 cursor-pointer hover:border-blue-300 transition-colors;
}

.contest-card.active {
	@apply border-blue-500 bg-blue-50;
}

.contest-info h5 {
	@apply font-semibold text-gray-800 mb-1;
}

.contest-description {
	@apply text-sm text-gray-600 mb-2;
}

.contest-meta {
	@apply flex gap-4 text-xs text-gray-500;
}

.join-btn {
	@apply mt-3 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors;
}

.leaderboard {
	@apply mt-6;
}

.leaderboard h4 {
	@apply text-sm font-semibold text-gray-700 mb-4 text-center;
}

.podium {
	@apply flex justify-center items-end gap-4 mb-6;
}

.podium-item {
	@apply flex flex-col items-center p-4 rounded-lg;
}

.podium-item.rank-1 {
	@apply bg-yellow-100 order-2;
}

.podium-item.rank-2 {
	@apply bg-gray-100 order-1;
}

.podium-item.rank-3 {
	@apply bg-orange-100 order-3;
}

.rank-badge {
	@apply w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm mb-2;
}

.podium-avatar {
	@apply w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold mb-2;
}

.podium-name {
	@apply text-sm font-medium text-gray-800;
}

.podium-score {
	@apply text-lg font-bold text-gray-700;
}

.leaderboard-list {
	@apply space-y-2;
}

.rank-item {
	@apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
}

.rank-item.current-user {
	@apply bg-blue-50 border border-blue-200;
}

.rank-number {
	@apply w-8 text-sm font-medium text-gray-500;
}

.rank-name {
	@apply flex-1 text-sm text-gray-800;
}

.rank-score {
	@apply text-sm font-bold text-gray-700;
}

.user-ranking {
	@apply mb-4;
}
</style>
