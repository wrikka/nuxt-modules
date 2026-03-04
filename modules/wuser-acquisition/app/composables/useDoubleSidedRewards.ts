import type { DoubleSidedReward, DoubleSidedRewardConfig } from "../types/new-features"

export function useDoubleSidedRewards() {
	const config = useRuntimeConfig()
	const rewardConfig = computed<DoubleSidedRewardConfig | undefined>(
		() => config.public.userAcquisition?.doubleSidedRewards,
	)

	const activeRewards = useState<Record<string, DoubleSidedReward>>("double-sided-rewards", () => ({}))
	const pendingClaims = useState<string[]>("pending-reward-claims", () => [])

	async function createDoubleSidedReward(params: {
		referralId: string
		referrerId: string
		refereeId: string
	}): Promise<DoubleSidedReward> {
		if (!rewardConfig.value?.enabled) {
			throw new Error("Double-sided rewards is not enabled")
		}

		const { referralId, referrerId, refereeId } = params

		const reward: DoubleSidedReward = {
			id: `dsr_${Date.now()}`,
			referralId,
			referrerId,
			refereeId,
			referrerReward: {
				type: rewardConfig.value.referrerReward.type,
				amount: rewardConfig.value.referrerReward.amount,
				status: "pending",
			},
			refereeReward: {
				type: rewardConfig.value.refereeReward.type,
				amount: rewardConfig.value.refereeReward.amount,
				status: "pending",
			},
			createdAt: new Date(),
		}

		const response = await $fetch<DoubleSidedReward>("/api/user-acquisition/double-sided-rewards", {
			method: "POST",
			body: reward,
		})

		activeRewards.value[response.id] = response
		return response
	}

	async function grantReferrerReward(rewardId: string): Promise<void> {
		const reward = activeRewards.value[rewardId]
		if (!reward) throw new Error("Reward not found")

		await $fetch(`/api/user-acquisition/double-sided-rewards/${rewardId}/grant-referrer`, {
			method: "POST",
		})

		reward.referrerReward.status = "granted"
		reward.referrerReward.grantedAt = new Date()
	}

	async function grantRefereeReward(rewardId: string): Promise<void> {
		const reward = activeRewards.value[rewardId]
		if (!reward) throw new Error("Reward not found")

		await $fetch(`/api/user-acquisition/double-sided-rewards/${rewardId}/grant-referee`, {
			method: "POST",
		})

		reward.refereeReward.status = "granted"
		reward.refereeReward.grantedAt = new Date()
	}

	async function claimReferrerReward(rewardId: string): Promise<void> {
		const reward = activeRewards.value[rewardId]
		if (!reward) throw new Error("Reward not found")
		if (reward.referrerReward.status !== "granted") {
			throw new Error("Reward not yet granted")
		}

		await $fetch(`/api/user-acquisition/double-sided-rewards/${rewardId}/claim-referrer`, {
			method: "POST",
		})

		reward.referrerReward.status = "claimed"
		reward.referrerReward.claimedAt = new Date()
		pendingClaims.value = pendingClaims.value.filter((id) => id !== rewardId)
	}

	async function claimRefereeReward(rewardId: string): Promise<void> {
		const reward = activeRewards.value[rewardId]
		if (!reward) throw new Error("Reward not found")
		if (reward.refereeReward.status !== "granted") {
			throw new Error("Reward not yet granted")
		}

		await $fetch(`/api/user-acquisition/double-sided-rewards/${rewardId}/claim-referee`, {
			method: "POST",
		})

		reward.refereeReward.status = "claimed"
		reward.refereeReward.claimedAt = new Date()
		pendingClaims.value = pendingClaims.value.filter((id) => id !== rewardId)
	}

	async function completeReferral(rewardId: string): Promise<void> {
		const reward = activeRewards.value[rewardId]
		if (!reward) throw new Error("Reward not found")

		await $fetch(`/api/user-acquisition/double-sided-rewards/${rewardId}/complete`, {
			method: "POST",
		})

		reward.completedAt = new Date()
		pendingClaims.value.push(rewardId)
	}

	function getPendingRewards(userId: string): DoubleSidedReward[] {
		return Object.values(activeRewards.value).filter(
			(r) =>
				(r.referrerId === userId && r.referrerReward.status === "granted") ||
				(r.refereeId === userId && r.refereeReward.status === "granted"),
		)
	}

	function getUnclaimedRewards(userId: string): DoubleSidedReward[] {
		return Object.values(activeRewards.value).filter(
			(r) =>
				(r.referrerId === userId && r.referrerReward.status === "granted") ||
				(r.refereeId === userId && r.refereeReward.status === "granted"),
		)
	}

	async function checkMilestoneBonus(referrerId: string, totalReferrals: number): Promise<number> {
		if (!rewardConfig.value?.milestoneRewards) return 0

		const milestone = rewardConfig.value.milestoneRewards.find((m) => m.milestone === totalReferrals)
		if (!milestone) return 0

		await $fetch("/api/user-acquisition/double-sided-rewards/milestone-bonus", {
			method: "POST",
			body: {
				referrerId,
				milestone: totalReferrals,
				bonusAmount: milestone.bonusAmount,
			},
		})

		return milestone.bonusAmount
	}

	return {
		activeRewards: readonly(activeRewards),
		pendingClaims: readonly(pendingClaims),
		createDoubleSidedReward,
		grantReferrerReward,
		grantRefereeReward,
		claimReferrerReward,
		claimRefereeReward,
		completeReferral,
		getPendingRewards,
		getUnclaimedRewards,
		checkMilestoneBonus,
	}
}
