import { nanoid } from "nanoid"
import type { Referral, ReferralLink } from "../../../types"

export function generateReferralCode(
	userId: string,
	prefix: string = "",
	length: number = 8,
): string {
	return prefix + nanoid(length)
}

export function createReferral(data: {
	code: string
	referrerId: string
	tier: number
	defaultReward: number
	rewardType: string
	expirationDays?: number
}): Referral {
	const now = new Date()
	const expiresAt = data.expirationDays
		? new Date(now.getTime() + data.expirationDays * 24 * 60 * 60 * 1000)
		: undefined

	return {
		id: nanoid(),
		code: data.code,
		referrerId: data.referrerId,
		tier: data.tier,
		status: "pending",
		clicks: 0,
		conversions: 0,
		reward: data.defaultReward,
		rewardType: data.rewardType,
		createdAt: now,
		expiresAt,
	}
}

export function createReferralLink(
	referralId: string,
	code: string,
	baseUrl: string,
): ReferralLink {
	return {
		id: nanoid(),
		referralId,
		code,
		url: `${baseUrl}/ref/${code}`,
		clicks: 0,
		uniqueClicks: 0,
		conversions: 0,
		revenue: 0,
		createdAt: new Date(),
	}
}

export function validateReferralCode(code: string, referralCodes: Record<string, string>): boolean {
	return Object.values(referralCodes).includes(code)
}

export function getReferralByCode(code: string, referrals: Referral[]): Referral | null {
	return referrals.find((r) => r.code === code && r.status !== "expired") || null
}

export function updateReferralStats(
	referral: Referral,
	type: "click" | "conversion",
	revenue?: number,
): Referral {
	const updated = { ...referral }

	if (type === "click") {
		updated.clicks++
	} else if (type === "conversion") {
		updated.conversions++
		updated.status = "completed"
		updated.completedAt = new Date()
		if (revenue) updated.reward = revenue
	}

	return updated
}
