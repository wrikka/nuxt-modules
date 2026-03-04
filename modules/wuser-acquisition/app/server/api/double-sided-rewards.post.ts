import type { DoubleSidedReward } from "../../../types/new-features"

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const rewardConfig = config.public.userAcquisition?.doubleSidedRewards

	if (!rewardConfig?.enabled) {
		throw createError({
			statusCode: 400,
			statusMessage: "Double-sided rewards is not enabled",
		})
	}

	const body = await readBody(event)
	const { referralId, referrerId, refereeId } = body

	if (!referralId || !referrerId || !refereeId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing required fields",
		})
	}

	const reward: DoubleSidedReward = {
		id: `dsr_${Date.now()}`,
		referralId,
		referrerId,
		refereeId,
		referrerReward: {
			type: rewardConfig.referrerReward.type,
			amount: rewardConfig.referrerReward.amount,
			status: "pending",
		},
		refereeReward: {
			type: rewardConfig.refereeReward.type,
			amount: rewardConfig.refereeReward.amount,
			status: "pending",
		},
		createdAt: new Date(),
	}

	// Store in database
	await $fetch("/api/user-acquisition/double-sided-rewards/store", {
		method: "POST",
		body: reward,
	})

	return reward
})
