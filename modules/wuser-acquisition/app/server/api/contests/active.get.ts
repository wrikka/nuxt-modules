import type { ContestEntry, ReferralContest } from "../../../types/new-features"

export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const contestsConfig = config.public.userAcquisition?.referralContests

	if (!contestsConfig?.enabled) {
		throw createError({
			statusCode: 400,
			statusMessage: "Referral contests are not enabled",
		})
	}

	// Fetch active contests from database
	const contests = await $fetch<ReferralContest[]>("/api/user-acquisition/contests/active")

	return contests
})
