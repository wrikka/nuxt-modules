import type { DoubleSidedReward } from "../../../types/new-features"

export default defineEventHandler(async (event) => {
	const rewardId = getRouterParam(event, "id")
	if (!rewardId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Reward ID is required",
		})
	}

	// Update referrer reward status to granted
	const update = {
		"referrerReward.status": "granted",
		"referrerReward.grantedAt": new Date(),
	}

	await $fetch(`/api/user-acquisition/double-sided-rewards/${rewardId}/update`, {
		method: "POST",
		body: update,
	})

	return { success: true }
})
