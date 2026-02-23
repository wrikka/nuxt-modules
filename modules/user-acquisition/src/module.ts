import {
	addComponentsDir,
	addImportsDir,
	addPlugin,
	createResolver,
	defineNuxtModule,
	useLogger,
} from "@nuxt/kit"
import { z } from "zod"
import type { ModuleOptions } from "./types"

const userAcquisitionModuleOptionsSchema = z.object({
	referral: z.object({
		enabled: z.boolean().default(true),
		codeLength: z.number().min(4).max(20).default(8),
		codePrefix: z.string().default(""),
		tiers: z.number().min(1).max(5).default(3),
		defaultReward: z.number().min(0).default(100),
		rewardType: z.enum(["points", "credits", "cash", "discount"]).default("points"),
		tierRewards: z.array(z.number()).default([100, 50, 25]),
		expirationDays: z.number().min(1).default(365),
		maxReferrals: z.number().min(0).default(0),
		trackClicks: z.boolean().default(true),
		trackConversions: z.boolean().default(true),
	}).optional(),

	affiliate: z.object({
		enabled: z.boolean().default(true),
		autoApprove: z.boolean().default(false),
		commissionRate: z.number().min(0).max(1).default(0.1),
		commissionType: z.enum(["percentage", "fixed"]).default("percentage"),
		minPayout: z.number().min(0).default(50),
		payoutFrequency: z.enum(["daily", "weekly", "monthly"]).default("monthly"),
		payoutMethod: z.enum(["bank", "paypal", "stripe"]).default("stripe"),
		cookieDuration: z.number().min(1).default(30),
		trackingDays: z.number().min(1).default(90),
		performanceThreshold: z.number().min(0).max(1).default(0.05),
	}).optional(),

	rewards: z.object({
		enabled: z.boolean().default(true),
		expirationDays: z.number().min(1).default(365),
		redeemable: z.boolean().default(true),
		transferable: z.boolean().default(false),
		tierSystem: z.boolean().default(true),
		tierNames: z.array(z.string()).default(["Bronze", "Silver", "Gold", "Platinum", "Diamond"]),
		tierRequirements: z.array(z.number()).default([0, 1000, 5000, 20000, 50000]),
		bonusMultiplier: z.number().min(1).max(5).default(1),
		gamification: z.boolean().default(true),
	}).optional(),

	analytics: z.object({
		enabled: z.boolean().default(true),
		trackReferrals: z.boolean().default(true),
		trackAffiliates: z.boolean().default(true),
		trackRewards: z.boolean().default(true),
		trackConversions: z.boolean().default(true),
		trackRevenue: z.boolean().default(true),
		retentionPeriod: z.number().min(1).default(90),
	}).optional(),

	notifications: z.object({
		enabled: z.boolean().default(true),
		email: z.boolean().default(true),
		webhook: z.boolean().default(false),
		inApp: z.boolean().default(true),
		events: z.array(z.object({
			type: z.enum([
				"referral_signup",
				"affiliate_payout",
				"reward_earned",
				"reward_expired",
				"tier_upgrade",
			]),
			channels: z.array(z.enum(["email", "webhook", "in_app"])),
		})).default([]),
	}).optional(),

	api: z.object({
		enabled: z.boolean().default(true),
		prefix: z.string().default("/api/user-acquisition"),
		cors: z.boolean().default(true),
		rateLimit: z.boolean().default(true),
		rateLimitMax: z.number().min(1).default(100),
		rateLimitWindow: z.number().min(1).default(60),
		auth: z.boolean().default(true),
	}).optional(),
})

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@wrikka/user-acquisition",
		configKey: "userAcquisition",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},

	setup(options, nuxt) {
		const logger = useLogger("@wrikka/user-acquisition")

		const validatedOptions = userAcquisitionModuleOptionsSchema.parse(options)

		const resolver = createResolver(import.meta.url)

		nuxt.options.runtimeConfig.public.userAcquisition = validatedOptions

		addImportsDir(resolver.resolve("./runtime/composables"))

		addPlugin(resolver.resolve("./runtime/plugins/client.plugin"))
		addPlugin(resolver.resolve("./runtime/plugins/server.plugin"))

		if (validatedOptions.api?.enabled) {
			nuxt.hook("app:generate", () => {
				logger.info("User Acquisition API routes registered")
			})
		}

		if (validatedOptions.referral?.enabled) {
			logger.info("Referral system enabled")
		}

		if (validatedOptions.affiliate?.enabled) {
			logger.info("Affiliate system enabled")
		}

		if (validatedOptions.rewards?.enabled) {
			logger.info("Rewards system enabled")
		}

		if (validatedOptions.analytics?.enabled) {
			logger.info("Analytics enabled")
		}

		if (validatedOptions.notifications?.enabled) {
			logger.info("Notifications enabled")
		}
	},
})
