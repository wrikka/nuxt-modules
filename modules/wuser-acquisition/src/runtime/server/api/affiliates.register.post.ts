import type { Affiliate } from "../../../types"

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const affiliateConfig = config.public.userAcquisition?.affiliate

	if (!affiliateConfig?.enabled) {
		throw createError({
			statusCode: 400,
			statusMessage: "Affiliate system is not enabled",
		})
	}

	const body = await readBody(event)
	const { userId, name, email, payoutMethod, payoutDetails } = body

	if (!userId || !name || !email) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId, name, and email are required",
		})
	}

	const affiliate = await $fetch<Affiliate>("/api/user-acquisition/affiliates", {
		method: "POST",
		body: {
			userId,
			name,
			email,
			commissionRate: affiliateConfig.commissionRate || 0.1,
			commissionType: affiliateConfig.commissionType || "percentage",
			autoApprove: affiliateConfig.autoApprove || false,
			payoutMethod: payoutMethod || affiliateConfig.payoutMethod || "stripe",
			payoutDetails,
		},
	})

	return affiliate
})
