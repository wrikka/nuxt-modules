<script setup lang="ts">
import { useDoubleSidedRewards } from "../composables/useDoubleSidedRewards"

const props = defineProps<{
	userId: string
	referralId?: string
}>()

const { getUnclaimedRewards, claimReferrerReward, claimRefereeReward, activeRewards } = useDoubleSidedRewards()

const unclaimedRewards = computed(() => getUnclaimedRewards(props.userId))

const referrerRewards = computed(() =>
	unclaimedRewards.value.filter((r) => r.referrerId === props.userId && r.referrerReward.status === "granted"),
)

const refereeRewards = computed(() =>
	unclaimedRewards.value.filter((r) => r.refereeId === props.userId && r.refereeReward.status === "granted"),
)

const totalReferrerValue = computed(() =>
	referrerRewards.value.reduce((sum, r) => sum + r.referrerReward.amount, 0),
)

const totalRefereeValue = computed(() =>
	refereeRewards.value.reduce((sum, r) => sum + r.refereeReward.amount, 0),
)

async function handleClaimReferrer(rewardId: string) {
	try {
		await claimReferrerReward(rewardId)
	}
	catch (err) {
		console.error("Failed to claim referrer reward:", err)
	}
}

async function handleClaimReferee(rewardId: string) {
	try {
		await claimRefereeReward(rewardId)
	}
	catch (err) {
		console.error("Failed to claim referee reward:", err)
	}
}
</script>

<template>
	<div class="double-sided-rewards">
		<div class="rewards-header">
			<h3>รางวัลสองด้าน</h3>
			<p class="subtitle">คุณและเพื่อนของคุณจะได้รับรางวัลเมื่อสำเร็จการ Referral</p>
		</div>

		<div class="rewards-summary">
			<div class="reward-card referrer">
				<div class="reward-icon">🎁</div>
				<div class="reward-info">
					<span class="reward-label">รางวัลจากการชวน</span>
					<span class="reward-value">{{ totalReferrerValue }} Points</span>
					<span class="reward-count">{{ referrerRewards.length }} รายการรอรับ</span>
				</div>
			</div>

			<div class="reward-card referee">
				<div class="reward-icon">🎉</div>
				<div class="reward-info">
					<span class="reward-label">รางวัลต้อนรับเพื่อนใหม่</span>
					<span class="reward-value">{{ totalRefereeValue }} Points</span>
					<span class="reward-count">{{ refereeRewards.length }} รายการรอรับ</span>
				</div>
			</div>
		</div>

		<div v-if="referrerRewards.length > 0" class="rewards-list">
			<h4>รางวัลที่ได้จากการชวน</h4>
			<div v-for="reward in referrerRewards" :key="reward.id" class="reward-item">
				<div class="reward-details">
					<span class="reward-type">{{ reward.referrerReward.type }}</span>
					<span class="reward-amount">+{{ reward.referrerReward.amount }}</span>
					<span class="reward-from">จาก: {{ reward.refereeId }}</span>
				</div>
				<button
					class="claim-btn"
					@click="handleClaimReferrer(reward.id)"
				>
					รับรางวัล
				</button>
			</div>
		</div>

		<div v-if="refereeRewards.length > 0" class="rewards-list">
			<h4>รางวัลต้อนรับ</h4>
			<div v-for="reward in refereeRewards" :key="reward.id" class="reward-item">
				<div class="reward-details">
					<span class="reward-type">{{ reward.refereeReward.type }}</span>
					<span class="reward-amount">+{{ reward.refereeReward.amount }}</span>
					<span class="reward-from">จากการใช้รหัส: {{ reward.referralId }}</span>
				</div>
				<button
					class="claim-btn"
					@click="handleClaimReferee(reward.id)"
				>
					รับรางวัล
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.double-sided-rewards {
	@apply p-6 bg-white rounded-lg shadow-md;
}

.rewards-header {
	@apply mb-6 text-center;
}

.rewards-header h3 {
	@apply text-xl font-bold text-gray-800 mb-2;
}

.subtitle {
	@apply text-sm text-gray-600;
}

.rewards-summary {
	@apply grid grid-cols-2 gap-4 mb-6;
}

.reward-card {
	@apply p-4 rounded-lg flex items-center gap-3;
}

.reward-card.referrer {
	@apply bg-blue-50 border border-blue-200;
}

.reward-card.referee {
	@apply bg-green-50 border border-green-200;
}

.reward-icon {
	@apply text-2xl;
}

.reward-info {
	@apply flex flex-col;
}

.reward-label {
	@apply text-xs text-gray-600 mb-1;
}

.reward-value {
	@apply text-lg font-bold text-gray-800;
}

.reward-count {
	@apply text-xs text-gray-500;
}

.rewards-list {
	@apply mt-4;
}

.rewards-list h4 {
	@apply text-sm font-semibold text-gray-700 mb-3;
}

.reward-item {
	@apply flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2;
}

.reward-details {
	@apply flex flex-col gap-1;
}

.reward-type {
	@apply text-xs text-gray-500 uppercase;
}

.reward-amount {
	@apply text-lg font-bold text-green-600;
}

.reward-from {
	@apply text-xs text-gray-500;
}

.claim-btn {
	@apply px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors;
}
</style>
