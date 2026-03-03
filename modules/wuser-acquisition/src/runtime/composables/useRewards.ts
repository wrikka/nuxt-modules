import type { Reward } from "../types"

export function useRewards() {
	const config = useRuntimeConfig()
	const rewardsConfig = config.public.userAcquisition?.rewards

	const userRewards = useState<Reward[]>("user-rewards", () => [])
	const userTier = useState<number>("user-tier", () => 0)
	const userPoints = useState<number>("user-points", () => 0)

	async function getUserRewards(userId: string): Promise<Reward[]> {
		if (!rewardsConfig?.enabled) return []

		const response = await $fetch<Reward[]>("/api/user-acquisition/rewards/" + userId)
		userRewards.value = response
		return response
	}

	async function getUserTier(userId: string): Promise<number> {
		if (!rewardsConfig?.tierSystem) return 0

		const response = await $fetch<{ tier: number; points: number }>(
			"/api/user-acquisition/rewards/" + userId + "/tier",
		)
		userTier.value = response.tier
		userPoints.value = response.points
		return response.tier
	}

	async function redeemReward(rewardId: string): Promise<Reward> {
		const response = await $fetch<Reward>("/api/user-acquisition/rewards/" + rewardId + "/redeem", {
			method: "POST",
		})

		const index = userRewards.value.findIndex((r) => r.id === rewardId)
		if (index !== -1) {
			userRewards.value[index] = response
		}

		return response
	}

	function getTierName(tier: number): string {
		if (!rewardsConfig?.tierNames) return ""

		return rewardsConfig.tierNames[tier] || ""
	}

	function getTierRequirement(tier: number): number {
		if (!rewardsConfig?.tierRequirements) return 0

		return rewardsConfig.tierRequirements[tier] || 0
	}

	function getNextTierProgress(): number {
		if (!rewardsConfig?.tierRequirements || !rewardsConfig?.tierSystem) return 0

		const currentTier = userTier.value
		const nextTier = currentTier + 1

		if (nextTier >= rewardsConfig.tierRequirements.length) return 100

		const currentRequirement = rewardsConfig.tierRequirements[currentTier] || 0
		const nextRequirement = rewardsConfig.tierRequirements[nextTier] || 0
		const progress =
			((userPoints.value - currentRequirement) / (nextRequirement - currentRequirement)) * 100

		return Math.min(100, Math.max(0, progress))
	}

	function calculateBonusMultiplier(amount: number): number {
		if (!rewardsConfig?.bonusMultiplier) return 1

		const tierBonus = userTier.value * 0.1
		return rewardsConfig.bonusMultiplier * (1 + tierBonus)
	}

	function getAvailableRewards(): Reward[] {
		return userRewards.value.filter((r) => r.status === "available")
	}

	function getPendingRewards(): Reward[] {
		return userRewards.value.filter((r) => r.status === "pending")
	}

	function getRedeemedRewards(): Reward[] {
		return userRewards.value.filter((r) => r.status === "redeemed")
	}

	function getExpiredRewards(): Reward[] {
		return userRewards.value.filter((r) => r.status === "expired")
	}

	function getTotalRewards(): number {
		return userRewards.value.reduce((sum, r) => sum + r.amount, 0)
	}

	function getAvailableRewardsTotal(): number {
		return getAvailableRewards().reduce((sum, r) => sum + r.amount, 0)
	}

	return {
		userRewards,
		userTier,
		userPoints,
		getUserRewards,
		getUserTier,
		redeemReward,
		getTierName,
		getTierRequirement,
		getNextTierProgress,
		calculateBonusMultiplier,
		getAvailableRewards,
		getPendingRewards,
		getRedeemedRewards,
		getExpiredRewards,
		getTotalRewards,
		getAvailableRewardsTotal,
	}
}
