export interface ModuleOptions {
	/**
	 * Public pages that don't require authentication
	 * @default []
	 */
	publicPages?: string[];

	/**
	 * Custom navigation items
	 */
	navItems?: NavItem[];

	/**
	 * Enable/disable auth middleware
	 * @default true
	 */
	enableAuthMiddleware?: boolean;

	/**
	 * Login page path
	 * @default '/auth/login'
	 */
	loginPath?: string;

	/**
	 * WorkOS Client ID
	 */
	workosClientId?: string;

	/**
	 * WorkOS API Key
	 */
	workosApiKey?: string;

	/**
	 * Database URL
	 */
	databaseUrl?: string;
}

export interface NavItem {
	id: string;
	label: string;
	icon?: string;
	path: string;
	badge?: string | number;
	disabled?: boolean;
}

export interface WAccountConfig {
	publicPages: string[];
	navItems: NavItem[];
	enableAuthMiddleware: boolean;
	loginPath: string;
	workosClientId: string;
}

export interface WAccountRuntimeConfig {
	workosApiKey: string;
	databaseUrl: string;
}

import { createResolver, defineNuxtModule, useLogger } from "@nuxt/kit";
import { defu } from "defu";

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@wrikka/waccount",
		configKey: "waccount",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},

	defaults: {
		publicPages: [],
		navItems: [],
		enableAuthMiddleware: true,
		loginPath: "/auth/login",
		workosClientId: "",
		workosApiKey: "",
		databaseUrl: "",
	},

	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);
		const logger = useLogger("@wrikka/waccount");

		// Merge user options with defaults
		const config = defu(nuxt.options.runtimeConfig.public.waccount, options);

		// Add runtime config
		nuxt.options.runtimeConfig.public.waccount = {
			publicPages: config.publicPages ?? [],
			navItems: config.navItems ?? [],
			enableAuthMiddleware: config.enableAuthMiddleware ?? true,
			loginPath: config.loginPath ?? "/auth/login",
			workosClientId: config.workosClientId ?? "",
		};

		nuxt.options.runtimeConfig.waccount = {
			workosApiKey: config.workosApiKey ?? "",
			databaseUrl: config.databaseUrl ?? "",
		};

		// Add composables
		nuxt.hook("imports:extend", (imports) => {
			imports.push({
				name: "useWAccount",
				path: resolver.resolve("./runtime/composables/useWAccount"),
			});
		});

		// Add components
		nuxt.hook("components:dirs", (dirs) => {
			dirs.push({
				path: resolver.resolve("./runtime/components"),
				prefix: "WAccount",
			});
		});

		// Add middleware
		nuxt.hook("app:resolve", (app) => {
			if (config.enableAuthMiddleware) {
				app.middleware.push({
					name: "waccount",
					path: resolver.resolve("./runtime/middleware/auth"),
				});
			}
		});

		// Add server routes
		nuxt.hook("nitro:config", (nitroConfig) => {
			nitroConfig.handlers = nitroConfig.handlers || [];
			nitroConfig.handlers.push({
				route: "/api/auth/**",
				handler: resolver.resolve("./runtime/server/routes/auth"),
			});
		});


		logger.success("WAccount module loaded");
	},
});
