import { createResolver, defineNuxtModule, useLogger } from "@nuxt/kit";
import { defu } from "defu";
import type { ModuleOptions } from "./types";

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
		nuxt.hook("app:resolve", (app) => {
			app.composables.push({
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

		// Add types
		nuxt.hook("prepare:types", ({ references }) => {
			references.push({
				types: resolver.resolve("./types"),
			});
		});

		logger.success("WAccount module loaded");
	},
});
