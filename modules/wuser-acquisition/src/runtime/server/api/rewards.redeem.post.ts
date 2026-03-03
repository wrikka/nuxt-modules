import { createError, defineEventHandler, getRouterParam, useRuntimeConfig } from "h3"
import type { Reward } from "../../../types"

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const rewardsConfig = config.public.userAcquisition?.rewards

	if (!rewardsConfig?.enabled) {
		throw createError({
			statusCode: 400,
			statusMessage: "Rewards system is not enabled",
		})
	}

	if (!rewardsConfig.redeemable) {
		throw createError({
			statusCode: 400,
			statusMessage: "Rewards are not redeemable",
		})
	}

	const rewardId = getRouterParam(event, "rewardId")

	if (!rewardId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Reward ID is required",
		})
	}

	const reward = await $fetch<Reward>("/api/user-acquisition/rewards/" + rewardId)

	if (!reward) {
		throw createError({
			statusCode: 404,
			statusMessage: "Reward not found",
		})
	}

	if (reward.status !== "available") {
		throw createError({
			statusCode: 400,
			statusMessage: "Reward is not available for redemption",
		})
	}

	const redeemed = await $fetch<Reward>("/api/user-acquisition/rewards/" + rewardId + "/redeem", {
		method: "POST",
	})

	return redeemed
})
