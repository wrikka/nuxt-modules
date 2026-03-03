import { z } from "zod"

export const LoyaltyProgramSchema = z.object({
	id: z.number(),
	name: z.string().min(1, "Program name is required"),
	pointsPerCurrency: z.number().positive(),
	currencyPerPoint: z.number().positive(),
	minimumPoints: z.number().nonnegative(),
	isActive: z.boolean(),
	tiers: z.array(z.object({
		id: z.number(),
		name: z.string(),
		minPoints: z.number(),
		benefits: z.array(z.string()),
		color: z.string(),
	})),
})

export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>

export const LoyaltyTransactionSchema = z.object({
	id: z.number(),
	customerId: z.number(),
	orderId: z.number().nullable(),
	type: z.enum(["earned", "redeemed", "expired", "adjusted"]),
	points: z.number(),
	description: z.string(),
	balance: z.number(),
	createdAt: z.string(),
	expiresAt: z.string().nullable(),
})

export type LoyaltyTransaction = z.infer<typeof LoyaltyTransactionSchema>

export const CustomerLoyaltySchema = z.object({
	customerId: z.number(),
	programId: z.number(),
	currentPoints: z.number(),
	tierId: z.number(),
	totalEarned: z.number(),
	totalRedeemed: z.number(),
	joinDate: z.string(),
	lastActivity: z.string(),
})

export type CustomerLoyalty = z.infer<typeof CustomerLoyaltySchema>

export const LoyaltyTierSchema = z.object({
	id: z.number(),
	name: z.string(),
	minPoints: z.number(),
	benefits: z.array(z.string()),
	color: z.string(),
	isCurrent: z.boolean().optional(),
	description: z.string().optional(),
	pointsMultiplier: z.number().optional(),
	discount: z.number().optional(),
	pointsPerBaht: z.number().optional(),
})

export type LoyaltyTier = z.infer<typeof LoyaltyTierSchema>

export const LoyaltyMemberSchema = z.object({
	id: z.number(),
	customerId: z.number(),
	programId: z.number(),
	tierId: z.number(),
	status: z.enum(["active", "inactive", "suspended"]),
	currentPoints: z.number(),
	totalEarned: z.number(),
	totalRedeemed: z.number(),
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	joinDate: z.string(),
	lastActivity: z.string(),
	recentTransactions: z.array(z.object({
		id: z.number(),
		type: z.enum(["earned", "redeemed", "expired", "adjusted"]),
		points: z.number(),
		description: z.string(),
		createdAt: z.string(),
	})),
})

export type LoyaltyMember = z.infer<typeof LoyaltyMemberSchema>
