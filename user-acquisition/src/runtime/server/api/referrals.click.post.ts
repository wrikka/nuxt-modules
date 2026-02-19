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

	const body = await readBody(event)
	const { code } = body

	if (!code) {
		throw createError({
			statusCode: 400,
			statusMessage: "Referral code is required",
		})
	}

	const referral = await $fetch<Referral>("/api/user-acquisition/referrals/by-code/" + code)

	if (!referral) {
		throw createError({
			statusCode: 404,
			statusMessage: "Referral not found",
		})
	}

	await $fetch("/api/user-acquisition/referrals/" + referral.id + "/click", {
		method: "POST",
	})

	return {
		success: true,
		referralId: referral.id,
	}
})
