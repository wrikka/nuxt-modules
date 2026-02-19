import { createError, defineEventHandler, getRouterParam, useRuntimeConfig } from "h3"
import type { Referral } from "../../../types"

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const referralConfig = config.public.userAcquisition?.referral

	if (!referralConfig?.enabled) {
		throw createError({
			statusCode: 400,
			statusMessage: "Referral system is not enabled",
		})
	}

	const userId = getRouterParam(event, "userId")

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "User ID is required",
		})
	}

	const referrals = await $fetch<Referral[]>("/api/user-acquisition/referrals/" + userId)
	return referrals
})
