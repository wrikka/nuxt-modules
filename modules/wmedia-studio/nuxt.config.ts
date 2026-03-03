import { defineNuxtConfig } from "nuxt/config";
import checker from "vite-plugin-checker";

export default defineNuxtConfig({
  preset: 'bun',
	compatibilityDate: "latest",
	devtools: { enabled: true },
	modules: [
		"@vue-macros/nuxt",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"@pinia/nuxt",
		"nuxt-mcp-dev",
		"@nuxt/icon",
		"@scalar/nuxt",
	],

	scalar: {
		url: "https://registry.scalar.com/@scalar/apis/galaxy?format=yaml",
	},

	colorMode: {
		preference: "system",
		fallback: "light",
		classSuffix: "",
	},

	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},

	css: ["~/assets/css/main.css"],

	app: {
		head: {
			title: "Media Studio",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "description", content: "A powerful media studio platform" },
			],
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
			],
		},
		pageTransition: { name: "page", mode: "out-in" },
		layoutTransition: { name: "layout", mode: "out-in" },
	},

	runtimeConfig: {
		public: {
			apiBase: process.env.API_BASE_URL || "/api",
			wsUrl: process.env.WS_URL || "ws://localhost:3000",
		},
	},

	nitro: {
		experimental: {
			openAPI: true,
			wasm: true,
		},
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				routes: [
					{
						pattern: "*/*",
						custom_domain: true,
					},
				],
			},
		},
	},



	typescript: {
		strict: true,
		typeCheck: true,
	},
});
