import type { CouponDetails, PromotionCode } from "#wpayment/types"

// Feature 1: Double-Sided Rewards
export interface DoubleSidedRewardConfig {
	enabled: boolean
	referrerReward: {
		type: "points" | "credits" | "cash" | "discount"
		amount: number
		minPurchase?: number
	}
	refereeReward: {
		type: "points" | "credits" | "cash" | "discount"
		amount: number
		welcomeBonus?: boolean
	}
	milestoneRewards?: {
		milestone: number
		bonusAmount: number
	}[]
}

export interface DoubleSidedReward {
	id: string
	referralId: string
	referrerId: string
	refereeId: string
	referrerReward: {
		type: string
		amount: number
		status: "pending" | "granted" | "claimed"
		grantedAt?: Date
		claimedAt?: Date
	}
	refereeReward: {
		type: string
		amount: number
		status: "pending" | "granted" | "claimed"
		grantedAt?: Date
		claimedAt?: Date
	}
	createdAt: Date
	completedAt?: Date
}

// Feature 2: Referral Contest/Gamification
export interface ReferralContest {
	id: string
	name: string
	description?: string
	status: "draft" | "active" | "ended" | "cancelled"
	startDate: Date
	endDate: Date
	rules: {
		minReferrals?: number
		minRevenue?: number
		eligibleTiers?: number[]
		allowAffiliates?: boolean
	}
	prizes: ContestPrize[]
	leaderboard: ContestEntry[]
	createdAt: Date
}

export interface ContestPrize {
	id: string
	rank: number
	orMinReferrals?: number
	type: "cash" | "points" | "credits" | "product" | "exclusive"
	value: number
	description?: string
}

export interface ContestEntry {
	id: string
	contestId: string
	userId: string
	userName?: string
	avatar?: string
	referralsCount: number
	revenueGenerated: number
	conversionsCount: number
	score: number
	rank: number
	lastUpdated: Date
}

export interface GamificationBadge {
	id: string
	name: string
	description: string
	icon: string
	condition: {
		type: "referrals" | "revenue" | "conversions" | "streak" | "milestone"
		threshold: number
		timeframe?: "daily" | "weekly" | "monthly" | "all_time"
	}
	reward?: {
		type: string
		amount: number
	}
}

export interface UserBadge {
	id: string
	badgeId: string
	userId: string
	earnedAt: Date
	equipped: boolean
}

// Feature 3: Smart Referral Matching
export interface ReferralMatch {
	id: string
	referrerId: string
	potentialRefereeId: string
	score: number
	reasons: MatchReason[]
	status: "pending" | "contacted" | "converted" | "rejected"
	createdAt: Date
	contactedAt?: Date
	convertedAt?: Date
}

export interface MatchReason {
	type: "network_overlap" | "interest_match" | "behavior_similarity" | "demographic_fit" | "engagement_score"
	score: number
	description: string
}

export interface ReferralPotential {
	userId: string
	score: number
	factors: {
		networkSize: number
		engagementRate: number
		purchaseHistory: number
		socialActivity: number
		invitationResponse: number
	}
	recommendations: string[]
	lastCalculated: Date
}

// Feature 4: Affiliate Coupon Codes (Integration with wpayment)
export interface AffiliateCoupon {
	id: string
	affiliateId: string
	couponId: string
	stripeCouponId?: string
	code: string
	stripePromotionCodeId?: string
	discountType: "percentage" | "fixed_amount"
	discountValue: number
	appliesTo: "all" | "specific_products" | "categories"
	productIds?: string[]
	categoryIds?: string[]
	maxUses?: number
	currentUses: number
	status: "active" | "paused" | "expired" | "depleted"
	createdAt: Date
	expiresAt?: Date
	lastUsedAt?: Date
	revenueGenerated: number
	conversionsCount: number
}

export interface AffiliateCouponUsage {
	id: string
	affiliateCouponId: string
	orderId: string
	customerId: string
	amount: number
	discountApplied: number
	affiliateCommission: number
	createdAt: Date
}

// Feature 5: Referral Retargeting
export interface ReferralFunnel {
	id: string
	userId: string
	referralCode: string
	stages: FunnelStage[]
	currentStage: number
	status: "in_progress" | "abandoned" | "completed" | "converted"
	createdAt: Date
	lastActivityAt: Date
	convertedAt?: Date
}

export interface FunnelStage {
	stage: "link_clicked" | "landing_viewed" | "signup_started" | "signup_completed" | "purchase_made"
	completed: boolean
	completedAt?: Date
	abandonedAt?: Date
}

export interface RetargetingCampaign {
	id: string
	name: string
	targetStage: string
	trigger: {
		type: "time_delay" | "stage_abandoned" | "behavior_based"
		delay?: number
		condition?: string
	}
	channels: ("email" | "push" | "sms" | "in_app")[]
	message: {
		subject?: string
		body: string
		ctaText: string
		ctaLink: string
	}
	status: "active" | "paused" | "ended"
	metrics: {
		sent: number
		opened: number
		clicked: number
		converted: number
	}
	createdAt: Date
}

export interface RetargetingEvent {
	id: string
	campaignId: string
	userId: string
	funnelId: string
	stage: string
	eventType: "sent" | "opened" | "clicked" | "converted" | "bounced"
	createdAt: Date
}
