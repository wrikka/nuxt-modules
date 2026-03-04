import type { AffiliateCoupon, AffiliateCouponUsage } from "../types/new-features"
import type { CouponDetails, PromotionCode } from "#wpayment/types"

export function useAffiliateCoupons() {
	const affiliateCoupons = useState<Record<string, AffiliateCoupon[]>>("affiliate-coupons", () => ({}))
	const couponUsages = useState<Record<string, AffiliateCouponUsage[]>>("coupon-usages", () => ({}))
	const activeCoupon = useState<AffiliateCoupon | null>("active-affiliate-coupon", () => null)

	async function createAffiliateCoupon(params: {
		affiliateId: string
		discountType: "percentage" | "fixed_amount"
		discountValue: number
		code?: string
		appliesTo?: "all" | "specific_products" | "categories"
		productIds?: string[]
		categoryIds?: string[]
		maxUses?: number
		expiresAt?: Date
	}): Promise<AffiliateCoupon> {
		const response = await $fetch<AffiliateCoupon>("/api/user-acquisition/affiliate-coupons", {
			method: "POST",
			body: params,
		})

		if (!affiliateCoupons.value[params.affiliateId]) {
			affiliateCoupons.value[params.affiliateId] = []
		}
		affiliateCoupons.value[params.affiliateId].push(response)
		return response
	}

	async function createStripeLinkedCoupon(params: {
		affiliateId: string
		couponData: Partial<CouponDetails>
		promotionCodeData?: Partial<PromotionCode>
	}): Promise<AffiliateCoupon> {
		const response = await $fetch<AffiliateCoupon>("/api/user-acquisition/affiliate-coupons/stripe", {
			method: "POST",
			body: params,
		})

		if (!affiliateCoupons.value[params.affiliateId]) {
			affiliateCoupons.value[params.affiliateId] = []
		}
		affiliateCoupons.value[params.affiliateId].push(response)
		return response
	}

	async function getAffiliateCoupons(affiliateId: string): Promise<AffiliateCoupon[]> {
		const response = await $fetch<AffiliateCoupon[]>(
			`/api/user-acquisition/affiliate-coupons/${affiliateId}`,
		)
		affiliateCoupons.value[affiliateId] = response
		return response
	}

	async function updateAffiliateCoupon(
		couponId: string,
		updates: Partial<AffiliateCoupon>,
	): Promise<AffiliateCoupon> {
		const response = await $fetch<AffiliateCoupon>(
			`/api/user-acquisition/affiliate-coupons/${couponId}`,
			{
				method: "PATCH",
				body: updates,
			},
		)

		for (const affiliateId in affiliateCoupons.value) {
			const index = affiliateCoupons.value[affiliateId].findIndex((c) => c.id === couponId)
			if (index !== -1) {
				affiliateCoupons.value[affiliateId][index] = response
				break
			}
		}

		return response
	}

	async function pauseAffiliateCoupon(couponId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/affiliate-coupons/${couponId}/pause`, {
			method: "POST",
		})

		for (const affiliateId in affiliateCoupons.value) {
			const coupon = affiliateCoupons.value[affiliateId].find((c) => c.id === couponId)
			if (coupon) {
				coupon.status = "paused"
				break
			}
		}
	}

	async function activateAffiliateCoupon(couponId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/affiliate-coupons/${couponId}/activate`, {
			method: "POST",
		})

		for (const affiliateId in affiliateCoupons.value) {
			const coupon = affiliateCoupons.value[affiliateId].find((c) => c.id === couponId)
			if (coupon) {
				coupon.status = "active"
				break
			}
		}
	}

	async function deleteAffiliateCoupon(couponId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/affiliate-coupons/${couponId}`, {
			method: "DELETE",
		})

		for (const affiliateId in affiliateCoupons.value) {
			affiliateCoupons.value[affiliateId] = affiliateCoupons.value[affiliateId].filter(
				(c) => c.id !== couponId,
			)
		}
	}

	async function getCouponUsages(couponId: string): Promise<AffiliateCouponUsage[]> {
		const response = await $fetch<AffiliateCouponUsage[]>(
			`/api/user-acquisition/affiliate-coupons/${couponId}/usages`,
		)
		couponUsages.value[couponId] = response
		return response
	}

	async function validateAffiliateCoupon(code: string, amount: number): Promise<{
		valid: boolean
		discountAmount: number
		finalAmount: number
		coupon?: AffiliateCoupon
	}> {
		const response = await $fetch<{
			valid: boolean
			discountAmount: number
			finalAmount: number
			coupon?: AffiliateCoupon
		}>("/api/user-acquisition/affiliate-coupons/validate", {
			method: "POST",
			body: { code, amount },
		})

		if (response.coupon) {
			activeCoupon.value = response.coupon
		}

		return response
	}

	async function applyAffiliateCoupon(code: string, orderId: string): Promise<void> {
		await $fetch("/api/user-acquisition/affiliate-coupons/apply", {
			method: "POST",
			body: { code, orderId },
		})
	}

	function getCouponStats(couponId: string): {
		revenue: number
		conversions: number
		uses: number
	} {
		const usages = couponUsages.value[couponId] || []
		return {
			revenue: usages.reduce((sum, u) => sum + u.amount, 0),
			conversions: usages.length,
			uses: usages.length,
		}
	}

	function calculateAffiliateCommission(couponId: string): number {
		const usages = couponUsages.value[couponId] || []
		return usages.reduce((sum, u) => sum + u.affiliateCommission, 0)
	}

	return {
		affiliateCoupons: readonly(affiliateCoupons),
		couponUsages: readonly(couponUsages),
		activeCoupon: readonly(activeCoupon),
		createAffiliateCoupon,
		createStripeLinkedCoupon,
		getAffiliateCoupons,
		updateAffiliateCoupon,
		pauseAffiliateCoupon,
		activateAffiliateCoupon,
		deleteAffiliateCoupon,
		getCouponUsages,
		validateAffiliateCoupon,
		applyAffiliateCoupon,
		getCouponStats,
		calculateAffiliateCommission,
	}
}
