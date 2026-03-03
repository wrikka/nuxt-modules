export interface ModuleOptions {
	referral?: ReferralOptions
	affiliate?: AffiliateOptions
	rewards?: RewardsOptions
	analytics?: AnalyticsOptions
	notifications?: NotificationOptions
	api?: ApiOptions
}

export interface ReferralOptions {
	enabled: boolean
	codeLength?: number
	codePrefix?: string
	tiers?: number
	defaultReward?: number
	rewardType?: "points" | "credits" | "cash" | "discount"
	tierRewards?: number[]
	expirationDays?: number
	maxReferrals?: number
	trackClicks?: boolean
	trackConversions?: boolean
}

export interface AffiliateOptions {
	enabled: boolean
	autoApprove?: boolean
	commissionRate?: number
	commissionType?: "percentage" | "fixed"
	minPayout?: number
	payoutFrequency?: "daily" | "weekly" | "monthly"
	payoutMethod?: "bank" | "paypal" | "stripe"
	cookieDuration?: number
	trackingDays?: number
	performanceThreshold?: number
}

export interface RewardsOptions {
	enabled: boolean
	expirationDays?: number
	redeemable?: boolean
	transferable?: boolean
	tierSystem?: boolean
	tierNames?: string[]
	tierRequirements?: number[]
	bonusMultiplier?: number
	gamification?: boolean
}

export interface AnalyticsOptions {
	enabled: boolean
	trackReferrals?: boolean
	trackAffiliates?: boolean
	trackRewards?: boolean
	trackConversions?: boolean
	trackRevenue?: boolean
	retentionPeriod?: number
}

export interface NotificationOptions {
	enabled: boolean
	email?: boolean
	webhook?: boolean
	inApp?: boolean
	events?: NotificationEvent[]
}

export interface NotificationEvent {
	type: "referral_signup" | "affiliate_payout" | "reward_earned" | "reward_expired" | "tier_upgrade"
	channels: ("email" | "webhook" | "in_app")[]
}

export interface ApiOptions {
	enabled: boolean
	prefix?: string
	cors?: boolean
	rateLimit?: boolean
	rateLimitMax?: number
	rateLimitWindow?: number
	auth?: boolean
}

export interface Referral {
	id: string
	code: string
	referrerId: string
	referrerName?: string
	refereeId?: string
	refereeName?: string
	tier: number
	status: "pending" | "active" | "completed" | "expired"
	clicks: number
	conversions: number
	reward?: number
	rewardType: string
	createdAt: Date
	expiresAt?: Date
	completedAt?: Date
}

export interface Affiliate {
	id: string
	userId: string
	name: string
	email: string
	status: "pending" | "active" | "suspended" | "inactive"
	commissionRate: number
	commissionType: "percentage" | "fixed"
	totalRevenue: number
	totalCommission: number
	pendingCommission: number
	paidCommission: number
	referralsCount: number
	conversionsCount: number
	conversionRate: number
	performanceScore: number
	payoutMethod: string
	payoutDetails?: Record<string, unknown>
	createdAt: Date
	approvedAt?: Date
	lastPayoutAt?: Date
}

export interface Reward {
	id: string
	userId: string
	type: "referral" | "affiliate" | "bonus" | "tier_upgrade"
	amount: number
	rewardType: "points" | "credits" | "cash" | "discount"
	status: "pending" | "available" | "redeemed" | "expired"
	tier?: number
	description?: string
	expiresAt?: Date
	redeemedAt?: Date
	createdAt: Date
}

export interface ReferralLink {
	id: string
	referralId: string
	code: string
	url: string
	clicks: number
	uniqueClicks: number
	conversions: number
	revenue: number
	createdAt: Date
}

export interface Commission {
	id: string
	affiliateId: string
	referralId?: string
	amount: number
	type: "percentage" | "fixed"
	rate: number
	status: "pending" | "approved" | "paid" | "rejected"
	orderId?: string
	orderAmount?: number
	createdAt: Date
	paidAt?: Date
}

export interface Payout {
	id: string
	affiliateId: string
	amount: number
	method: string
	status: "pending" | "processing" | "completed" | "failed"
	transactionId?: string
	createdAt: Date
	completedAt?: Date
}

export interface AnalyticsData {
	referrals: {
		total: number
		active: number
		completed: number
		revenue: number
		conversionRate: number
	}
	affiliates: {
		total: number
		active: number
		totalCommission: number
		pendingCommission: number
		averageRevenue: number
	}
	rewards: {
		total: number
		available: number
		redeemed: number
		expired: number
		totalAmount: number
	}
	trends: {
		date: string
		referrals: number
		conversions: number
		revenue: number
	}[]
}

export interface ReferralStats {
	totalReferrals: number
	activeReferrals: number
	completedReferrals: number
	totalClicks: number
	totalConversions: number
	conversionRate: number
	totalRevenue: number
	totalRewards: number
	tierDistribution: Record<number, number>
}

export interface AffiliateStats {
	totalAffiliates: number
	activeAffiliates: number
	totalRevenue: number
	totalCommission: number
	pendingCommission: number
	paidCommission: number
	averageCommission: number
	topAffiliates: {
		id: string
		name: string
		revenue: number
		commission: number
		conversions: number
	}[]
}

export interface RewardStats {
	totalRewards: number
	availableRewards: number
	redeemedRewards: number
	expiredRewards: number
	totalAmount: number
	rewardDistribution: Record<string, number>
	tierDistribution: Record<number, number>
}
