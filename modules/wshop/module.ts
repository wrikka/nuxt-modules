import { createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import type { ModuleOptions } from "./types"

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@wrikka/wshop",
		configKey: "wshop",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},

	defaults: {
		siteUrl: "http://localhost:3000",
		stripeSecretKey: "",
		stripePublishableKey: "",
		databaseUrl: "",
		resendApiKey: "",
		resendFromEmail: "",
		enableAdmin: true,
		adminPath: "/admin",
		enableCustomerAccounts: true,
		enableReviews: true,
		enableWishlist: true,
		enableInventory: true,
		enableDiscounts: true,
		enableShipping: true,
		enableTaxes: true,
		componentPrefix: "WShop",
		enableComponents: true,
		locales: ["en", "th"],
		defaultLocale: "en",
		currency: {
			code: "USD",
			symbol: "$",
			position: "before",
		},
		image: {
			formats: ["webp", "jpg"],
			sizes: {
				thumbnail: 150,
				small: 300,
				medium: 600,
				large: 1200,
			},
		},
	},

	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url)
		const logger = useLogger("@wrikka/wshop")

		// Merge user options with defaults
		const config = defu(nuxt.options.runtimeConfig.public.wshop, options)

		// Add runtime config
		nuxt.options.runtimeConfig.public.wshop = {
			siteUrl: config.siteUrl ?? "http://localhost:3000",
			stripePublishableKey: config.stripePublishableKey ?? "",
			enableAdmin: config.enableAdmin ?? true,
			adminPath: config.adminPath ?? "/admin",
			enableCustomerAccounts: config.enableCustomerAccounts ?? true,
			enableReviews: config.enableReviews ?? true,
			enableWishlist: config.enableWishlist ?? true,
			enableInventory: config.enableInventory ?? true,
			enableDiscounts: config.enableDiscounts ?? true,
			enableShipping: config.enableShipping ?? true,
			enableTaxes: config.enableTaxes ?? true,
			componentPrefix: config.componentPrefix ?? "WShop",
			enableComponents: config.enableComponents ?? true,
			locales: config.locales ?? ["en", "th"],
			defaultLocale: config.defaultLocale ?? "en",
			currency: config.currency ?? {
				code: "USD",
				symbol: "$",
				position: "before",
			},
			image: config.image ?? {
				formats: ["webp", "jpg"],
				sizes: {
					thumbnail: 150,
					small: 300,
					medium: 600,
					large: 1200,
				},
			},
		}

		nuxt.options.runtimeConfig.wshop = {
			stripeSecretKey: config.stripeSecretKey ?? "",
			databaseUrl: config.databaseUrl ?? "",
			resendApiKey: config.resendApiKey ?? "",
			resendFromEmail: config.resendFromEmail ?? "",
		}

		// Add composables
		nuxt.hook("app:resolve", (app) => {
			// Core composables
			app.composables.push({
				name: "useWShop",
				path: resolver.resolve("./app/composables/useWShop"),
			})
			app.composables.push({
				name: "useCart",
				path: resolver.resolve("./app/composables/useCart"),
			})
			app.composables.push({
				name: "useProducts",
				path: resolver.resolve("./app/composables/useProducts"),
			})
			app.composables.push({
				name: "useOrders",
				path: resolver.resolve("./app/composables/useOrders"),
			})

			// AI & Smart Features
			app.composables.push({
				name: "useAIRecommendations",
				path: resolver.resolve("./app/composables/useAIRecommendations"),
			})
			app.composables.push({
				name: "useAISearch",
				path: resolver.resolve("./app/composables/useAISearch"),
			})
			app.composables.push({
				name: "usePredictiveAnalytics",
				path: resolver.resolve("./app/composables/usePredictiveAnalytics"),
			})
			app.composables.push({
				name: "useShopChatbot",
				path: resolver.resolve("./app/composables/useShopChatbot"),
			})

			// Advanced Features
			app.composables.push({
				name: "useAbandonedCart",
				path: resolver.resolve("./app/composables/useAbandonedCart"),
			})
			app.composables.push({
				name: "useInventorySync",
				path: resolver.resolve("./app/composables/useInventorySync"),
			})
			app.composables.push({
				name: "useVendorMarketplace",
				path: resolver.resolve("./app/composables/useVendorMarketplace"),
			})

			// Emerging Tech
			app.composables.push({
				name: "useARPreview",
				path: resolver.resolve("./app/composables/useARPreview"),
			})
			app.composables.push({
				name: "useVoiceCommerce",
				path: resolver.resolve("./app/composables/useVoiceCommerce"),
			})
			app.composables.push({
				name: "useSocialCommerce",
				path: resolver.resolve("./app/composables/useSocialCommerce"),
			})
			app.composables.push({
				name: "useLiveShopping",
				path: resolver.resolve("./app/composables/useLiveShopping"),
			})

			// Financial & Payments
			app.composables.push({
				name: "useBNPL",
				path: resolver.resolve("./app/composables/useBNPL"),
			})
			app.composables.push({
				name: "useQRCheckout",
				path: resolver.resolve("./app/composables/useQRCheckout"),
			})
			app.composables.push({
				name: "useGiftCards",
				path: resolver.resolve("./app/composables/useGiftCards"),
			})
			app.composables.push({
				name: "useProductBundles",
				path: resolver.resolve("./app/composables/useProductBundles"),
			})

			// Integrations
			app.composables.push({
				name: "useAccountingSync",
				path: resolver.resolve("./app/composables/useAccountingSync"),
			})

			// Product Management
			app.composables.push({
				name: "useProductComparison",
				path: resolver.resolve("./app/composables/useProductComparison"),
			})
			app.composables.push({
				name: "useProductImportExport",
				path: resolver.resolve("./app/composables/useProductImportExport"),
			})
			app.composables.push({
				name: "useBulkPriceEditor",
				path: resolver.resolve("./app/composables/useBulkPriceEditor"),
			})
			app.composables.push({
				name: "useWaitlist",
				path: resolver.resolve("./app/composables/useWaitlist"),
			})

			// Marketing
			app.composables.push({
				name: "useCustomerSegments",
				path: resolver.resolve("./app/composables/useCustomerSegments"),
			})
			app.composables.push({
				name: "useAffiliateSystem",
				path: resolver.resolve("./app/composables/useAffiliateSystem"),
			})
		})

		// Add components
		if (config.enableComponents) {
			nuxt.hook("components:dirs", (dirs) => {
				dirs.push({
					path: resolver.resolve("./app/components"),
					prefix: config.componentPrefix || "WShop",
				})
			})
		}

		// Add server routes
		nuxt.hook("nitro:config", (nitroConfig) => {
			nitroConfig.handlers = nitroConfig.handlers || []

			// Add e-commerce API routes
			nitroConfig.handlers.push({
				route: "/api/shop/**",
				handler: resolver.resolve("./app/server/routes/shop"),
			})

			// Add admin API routes
			if (config.enableAdmin) {
				nitroConfig.handlers.push({
					route: "/api/admin/**",
					handler: resolver.resolve("./app/server/routes/admin"),
				})
			}

			// Add Stripe webhook endpoint
			nitroConfig.handlers.push({
				route: "/api/webhooks/stripe",
				handler: resolver.resolve("./app/server/routes/webhooks/stripe"),
			})
		})

		// Add types
		nuxt.hook("prepare:types", ({ references }) => {
			references.push({
				types: resolver.resolve("./types"),
			})
		})

		// Add Stripe client plugin
		nuxt.hook("app:resolve", (app) => {
			app.plugins.push({
				src: resolver.resolve("./app/plugins/stripe.client"),
			})
		})

		// Add i18n configuration
		if (config.locales && config.locales.length > 0) {
			nuxt.hook("i18n:registerLocale", (locale) => {
				// Add module-specific translations
				locale.locales = locale.locales || []
				locale.locales.push(...config.locales!.map((code) => ({
					code,
					file: `${code}.json`,
					name: code === "en" ? "English" : code === "th" ? "ไทย" : code,
				})))
			})
		}

		// Add image optimization
		if (config.image) {
			nuxt.options.image = nuxt.options.image || {}
			nuxt.options.image.format = config.image.formats
			nuxt.options.image.screens = Object.entries(config.image.sizes).reduce(
				(acc, [name, size]) => ({ ...acc, [name]: size }),
				{},
			)
		}

		logger.success("WShop module loaded")
	},
})
