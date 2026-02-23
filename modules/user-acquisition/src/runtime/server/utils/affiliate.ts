import { nanoid } from "nanoid"
import type { Affiliate, Commission } from "../../../types"

export function createAffiliate(data: {
	userId: string
	name: string
	email: string
	commissionRate: number
	commissionType: "percentage" | "fixed"
	autoApprove: boolean
	payoutMethod: string
}): Affiliate {
	const now = new Date()

	return {
		id: nanoid(),
		userId: data.userId,
		name: data.name,
		email: data.email,
		status: data.autoApprove ? "active" : "pending",
		commissionRate: data.commissionRate,
		commissionType: data.commissionType,
		totalRevenue: 0,
		totalCommission: 0,
		pendingCommission: 0,
		paidCommission: 0,
		referralsCount: 0,
		conversionsCount: 0,
		conversionRate: 0,
		performanceScore: 0,
		payoutMethod: data.payoutMethod,
		createdAt: now,
		approvedAt: data.autoApprove ? now : undefined,
	}
}

export function createCommission(data: {
	affiliateId: string
	referralId?: string
	amount: number
	type: "percentage" | "fixed"
	rate: number
	orderId?: string
	orderAmount?: number
}): Commission {
	return {
		id: nanoid(),
		affiliateId: data.affiliateId,
		referralId: data.referralId,
		amount: data.amount,
		type: data.type,
		rate: data.rate,
		status: "pending",
		orderId: data.orderId,
		orderAmount: data.orderAmount,
		createdAt: new Date(),
	}
}

export function calculateCommission(
	orderAmount: number,
	commissionRate: number,
	commissionType: "percentage" | "fixed",
): number {
	if (commissionType === "percentage") {
		return orderAmount * commissionRate
	}
	return commissionRate
}

export function updateAffiliateStats(
	affiliate: Affiliate,
	revenue: number,
	conversion: boolean,
): Affiliate {
	const updated = { ...affiliate }

	updated.totalRevenue += revenue
	updated.referralsCount++

	if (conversion) {
		updated.conversionsCount++
		updated.conversionRate = updated.conversionsCount / updated.referralsCount
	}

	updated.performanceScore = updated.conversionRate * 100

	return updated
}

export function approveCommission(commission: Commission): Commission {
	return {
		...commission,
		status: "approved",
	}
}

export function payCommission(commission: Commission): Commission {
	return {
		...commission,
		status: "paid",
		paidAt: new Date(),
	}
}
