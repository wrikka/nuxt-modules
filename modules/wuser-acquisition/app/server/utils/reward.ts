import type { Reward } from "#user-acquisition/types"
import { nanoid } from "nanoid"

export function createReward(data: {
	userId: string
	type: "referral" | "affiliate" | "bonus" | "tier_upgrade"
	amount: number
	rewardType: "points" | "credits" | "cash" | "discount"
	tier?: number
	description?: string
	expirationDays?: number
}): Reward {
	const now = new Date()
	const expiresAt = data.expirationDays
		? new Date(now.getTime() + data.expirationDays * 24 * 60 * 60 * 1000)
		: undefined

	return {
		id: nanoid(),
		userId: data.userId,
		type: data.type,
		amount: data.amount,
		rewardType: data.rewardType,
		status: "available",
		tier: data.tier,
		description: data.description,
		expiresAt,
		createdAt: now,
	}
}

export function redeemReward(reward: Reward): Reward {
	return {
		...reward,
		status: "redeemed",
		redeemedAt: new Date(),
	}
}

export function expireReward(reward: Reward): Reward {
	return {
		...reward,
		status: "expired",
	}
}

export function calculateTier(points: number, tierRequirements: number[]): number {
	for (let i = tierRequirements.length - 1; i >= 0; i--) {
		if (points >= tierRequirements[i]) {
			return i
		}
	}
	return 0
}

export function calculateBonusMultiplier(tier: number, baseMultiplier: number): number {
	const tierBonus = tier * 0.1
	return baseMultiplier * (1 + tierBonus)
}

export function getRewardsByStatus(rewards: Reward[], status: Reward["status"]): Reward[] {
	return rewards.filter((r) => r.status === status)
}

export function getTotalRewardsAmount(rewards: Reward[]): number {
	return rewards.reduce((sum, r) => sum + r.amount, 0)
}
