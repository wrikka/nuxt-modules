import { defineNuxtConfig } from 'nuxt/config';
import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "2025-12-20",
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	icon: {
		serverBundle: {
			collections: ["mdi", "lucide"],
		},
	},
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
	nitro: {
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
		experimental: {
			openAPI: true,
		},
		preset: "cloudflare_module",
	},
	scalar: {
		theme: "moon",
	},
	typescript: {
		strict: true,
		typeCheck: true,
		tsConfig: {
			compilerOptions: {
				moduleResolution: "bundler",
				target: "ESNext",
			},
		},
	},
	vite: {
		plugins: [
			checker({
				biome: {
					command: "check",
				},
				overlay: {
					initialIsOpen: false,
				},
				oxlint: true,
				typescript: true,
				vueTsc: true,
			}),
		],
	},
});
