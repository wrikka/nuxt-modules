import type { CouponDetails, PromotionCode } from "#wpayment/types"
import type { AffiliateCoupon, AffiliateCouponUsage } from "../types/new-features"

/**
 * Integration composable for connecting affiliate coupons with wpayment module
 * Uses useDiscountCoupon and usePromoCode from @wrikka/wpayment
 */
export function useAffiliateCouponPayment() {
	const config = useRuntimeConfig()
	const couponConfig = config.public.userAcquisition?.affiliateCoupons

	// Import wpayment composables dynamically to avoid circular dependencies
	async function createStripeCoupon(params: {
		affiliateId: string
		discountType: "percentage" | "fixed_amount"
		discountValue: number
		code?: string
		maxUses?: number
		expiresAt?: Date
		appliesTo?: "all" | "specific_products" | "categories"
		productIds?: string[]
	}): Promise<AffiliateCoupon> {
		if (!couponConfig?.enabled) {
			throw new Error("Affiliate coupons are not enabled")
		}

		// Create coupon in Stripe via wpayment API
		const stripeCoupon = await $fetch<CouponDetails>("/api/stripe/coupon", {
			method: "POST",
			body: {
				name: `Affiliate Coupon - ${params.affiliateId}`,
				duration: "forever",
				[params.discountType === "percentage" ? "percent_off" : "amount_off"]:
					params.discountType === "percentage"
						? params.discountValue
						: params.discountValue * 100, // Convert to cents
				redeem_by: params.expiresAt ? Math.floor(params.expiresAt.getTime() / 1000) : undefined,
				max_redemptions: params.maxUses,
				applies_to: params.appliesTo === "specific_products" && params.productIds
					? { products: params.productIds }
					: undefined,
			},
		})

		// Create promotion code for the coupon
		const code = params.code || generateAffiliateCode(params.affiliateId)
		const promotionCode = await $fetch<PromotionCode>("/api/stripe/promotion-code", {
			method: "POST",
			body: {
				coupon: stripeCoupon.id,
				code,
				active: true,
			},
		})

		// Create affiliate coupon record
		const affiliateCoupon: AffiliateCoupon = {
			id: `ac_${Date.now()}`,
			affiliateId: params.affiliateId,
			couponId: stripeCoupon.id,
			stripeCouponId: stripeCoupon.id,
			code: promotionCode.code,
			stripePromotionCodeId: promotionCode.id,
			discountType: params.discountType,
			discountValue: params.discountValue,
			appliesTo: params.appliesTo || "all",
			productIds: params.productIds,
			maxUses: params.maxUses,
			currentUses: 0,
			status: "active",
			createdAt: new Date(),
			expiresAt: params.expiresAt,
			revenueGenerated: 0,
			conversionsCount: 0,
		}

		// Store in database
		await $fetch("/api/user-acquisition/affiliate-coupons/store", {
			method: "POST",
			body: affiliateCoupon,
		})

		return affiliateCoupon
	}

	async function validateAndApplyCoupon(params: {
		code: string
		orderAmount: number
		currency: string
		customerId?: string
	}): Promise<{
		valid: boolean
		discountAmount: number
		finalAmount: number
		affiliateCoupon?: AffiliateCoupon
		stripeCoupon?: CouponDetails
	}> {
		// First validate via wpayment
		const stripeValidation = await $fetch<{
			valid: boolean
			discountAmount: number
			finalAmount: number
			coupon?: CouponDetails
		}>("/api/stripe/promo-code/validate", {
			method: "POST",
			body: {
				code: params.code,
				customer: params.customerId,
			},
		})

		if (!stripeValidation.valid) {
			return {
				valid: false,
				discountAmount: 0,
				finalAmount: params.orderAmount,
			}
		}

		// Check if this is an affiliate coupon
		const affiliateCoupon = await $fetch<AffiliateCoupon | null>(
			`/api/user-acquisition/affiliate-coupons/by-code/${params.code}`,
		)

		return {
			valid: true,
			discountAmount: stripeValidation.discountAmount,
			finalAmount: stripeValidation.finalAmount,
			affiliateCoupon: affiliateCoupon || undefined,
			stripeCoupon: stripeValidation.coupon,
		}
	}

	async function trackCouponUsage(params: {
		code: string
		orderId: string
		customerId: string
		amount: number
		discountApplied: number
	}): Promise<AffiliateCouponUsage> {
		// Get affiliate coupon
		const affiliateCoupon = await $fetch<AffiliateCoupon>(
			`/api/user-acquisition/affiliate-coupons/by-code/${params.code}`,
		)

		// Calculate affiliate commission (e.g., 10% of order after discount)
		const commissionRate = 0.1
		const commission = (params.amount - params.discountApplied) * commissionRate

		const usage: AffiliateCouponUsage = {
			id: `acu_${Date.now()}`,
			affiliateCouponId: affiliateCoupon.id,
			orderId: params.orderId,
			customerId: params.customerId,
			amount: params.amount,
			discountApplied: params.discountApplied,
			affiliateCommission: commission,
			createdAt: new Date(),
		}

		// Record usage in database
		await $fetch("/api/user-acquisition/affiliate-coupons/usage", {
			method: "POST",
			body: usage,
		})

		// Update affiliate's pending commission
		await $fetch(`/api/user-acquisition/affiliates/${affiliateCoupon.affiliateId}/commission`, {
			method: "POST",
			body: {
				amount: commission,
				orderId: params.orderId,
				type: "coupon_usage",
			},
		})

		return usage
	}

	async function syncCouponStatus(affiliateCouponId: string): Promise<void> {
		const affiliateCoupon = await $fetch<AffiliateCoupon>(
			`/api/user-acquisition/affiliate-coupons/${affiliateCouponId}`,
		)

		if (!affiliateCoupon.stripePromotionCodeId) return

		// Get current status from Stripe
		const stripeCode = await $fetch<PromotionCode>(
			`/api/stripe/promotion-code/${affiliateCoupon.stripePromotionCodeId}`,
		)

		// Update status if needed
		const newStatus = stripeCode.active
			? affiliateCoupon.currentUses >= (affiliateCoupon.maxUses || Infinity)
				? "depleted"
				: "active"
			: "paused"

		if (newStatus !== affiliateCoupon.status) {
			await $fetch(`/api/user-acquisition/affiliate-coupons/${affiliateCouponId}/status`, {
				method: "POST",
				body: { status: newStatus },
			})
		}
	}

	async function deactivateStripeCoupon(affiliateCouponId: string): Promise<void> {
		const affiliateCoupon = await $fetch<AffiliateCoupon>(
			`/api/user-acquisition/affiliate-coupons/${affiliateCouponId}`,
		)

		if (affiliateCoupon.stripePromotionCodeId) {
			// Deactivate in Stripe
			await $fetch(`/api/stripe/promotion-code/${affiliateCoupon.stripePromotionCodeId}/deactivate`, {
				method: "POST",
			})
		}
	}

	function generateAffiliateCode(affiliateId: string): string {
		const prefix = "AFF"
		const timestamp = Date.now().toString(36).toUpperCase()
		const random = Math.random().toString(36).substring(2, 5).toUpperCase()
		return `${prefix}_${affiliateId.substring(0, 4)}_${timestamp}_${random}`
	}

	return {
		createStripeCoupon,
		validateAndApplyCoupon,
		trackCouponUsage,
		syncCouponStatus,
		deactivateStripeCoupon,
		generateAffiliateCode,
	}
}
