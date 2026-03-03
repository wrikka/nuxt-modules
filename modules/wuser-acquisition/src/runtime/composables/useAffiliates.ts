import type { Affiliate, Commission, Payout } from "../types"

export function useAffiliates() {
	const config = useRuntimeConfig()
	const affiliateConfig = config.public.userAcquisition?.affiliate

	const currentAffiliate = useState<Affiliate | null>("current-affiliate", () => null)
	const affiliateCommissions = useState<Commission[]>("affiliate-commissions", () => [])
	const affiliatePayouts = useState<Payout[]>("affiliate-payouts", () => [])

	async function registerAffiliate(data: {
		userId: string
		name: string
		email: string
		payoutMethod?: string
		payoutDetails?: Record<string, unknown>
	}): Promise<Affiliate> {
		if (!affiliateConfig?.enabled) {
			throw new Error("Affiliate system is not enabled")
		}

		const response = await $fetch<Affiliate>("/api/user-acquisition/affiliates/register", {
			method: "POST",
			body: data,
		})

		currentAffiliate.value = response
		return response
	}

	async function getAffiliate(userId: string): Promise<Affiliate | null> {
		if (!affiliateConfig?.enabled) return null

		const response = await $fetch<Affiliate>("/api/user-acquisition/affiliates/" + userId)
		currentAffiliate.value = response
		return response
	}

	async function updateAffiliateProfile(data: {
		name?: string
		email?: string
		payoutMethod?: string
		payoutDetails?: Record<string, unknown>
	}): Promise<Affiliate> {
		if (!currentAffiliate.value) {
			throw new Error("No active affiliate")
		}

		const response = await $fetch<Affiliate>(
			"/api/user-acquisition/affiliates/" + currentAffiliate.value.id,
			{
				method: "PATCH",
				body: data,
			},
		)

		currentAffiliate.value = response
		return response
	}

	async function getAffiliateCommissions(): Promise<Commission[]> {
		if (!currentAffiliate.value) return []

		const response = await $fetch<Commission[]>(
			"/api/user-acquisition/affiliates/" + currentAffiliate.value.id + "/commissions",
		)
		affiliateCommissions.value = response
		return response
	}

	async function getAffiliatePayouts(): Promise<Payout[]> {
		if (!currentAffiliate.value) return []

		const response = await $fetch<Payout[]>(
			"/api/user-acquisition/affiliates/" + currentAffiliate.value.id + "/payouts",
		)
		affiliatePayouts.value = response
		return response
	}

	async function requestPayout(): Promise<Payout> {
		if (!currentAffiliate.value) {
			throw new Error("No active affiliate")
		}

		const response = await $fetch<Payout>(
			"/api/user-acquisition/affiliates/" + currentAffiliate.value.id + "/payouts",
			{
				method: "POST",
			},
		)

		affiliatePayouts.value.unshift(response)
		return response
	}

	function calculateCommission(orderAmount: number): number {
		if (!affiliateConfig) return 0

		if (affiliateConfig.commissionType === "percentage") {
			return orderAmount * (affiliateConfig.commissionRate || 0)
		}
		return affiliateConfig.commissionRate || 0
	}

	function canRequestPayout(): boolean {
		if (!currentAffiliate.value || !affiliateConfig) return false

		return currentAffiliate.value.pendingCommission >= (affiliateConfig.minPayout || 0)
	}

	return {
		currentAffiliate,
		affiliateCommissions,
		affiliatePayouts,
		registerAffiliate,
		getAffiliate,
		updateAffiliateProfile,
		getAffiliateCommissions,
		getAffiliatePayouts,
		requestPayout,
		calculateCommission,
		canRequestPayout,
	}
}
