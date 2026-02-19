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
			app.composables.push({
				name: "useWShop",
				path: resolver.resolve("./runtime/composables/useWShop"),
			})
			app.composables.push({
				name: "useCart",
				path: resolver.resolve("./runtime/composables/useCart"),
			})
			app.composables.push({
				name: "useProducts",
				path: resolver.resolve("./runtime/composables/useProducts"),
			})
			app.composables.push({
				name: "useOrders",
				path: resolver.resolve("./runtime/composables/useOrders"),
			})
		})

		// Add components
		if (config.enableComponents) {
			nuxt.hook("components:dirs", (dirs) => {
				dirs.push({
					path: resolver.resolve("./runtime/components"),
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
				handler: resolver.resolve("./runtime/server/routes/shop"),
			})

			// Add admin API routes
			if (config.enableAdmin) {
				nitroConfig.handlers.push({
					route: "/api/admin/**",
					handler: resolver.resolve("./runtime/server/routes/admin"),
				})
			}

			// Add Stripe webhook endpoint
			nitroConfig.handlers.push({
				route: "/api/webhooks/stripe",
				handler: resolver.resolve("./runtime/server/routes/webhooks/stripe"),
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
				src: resolver.resolve("./runtime/plugins/stripe.client"),
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
