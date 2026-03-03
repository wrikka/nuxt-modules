export default defineNuxtConfig({
  preset: 'bun',
	compatibilityDate: "2025-12-17",
	devtools: { enabled: true },
	modules: [
		// "vue-macros/nuxt",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"nuxt-mcp-dev",
		"@nuxt/icon",
	],

	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},

	nitro: {
		preset: "cloudflare_module",
	},

	typescript: {
		// typeCheck: true
		// strict: true
	},
	vite: {
		plugins: [
			/*
			checker({
				overlay: {
					initialIsOpen: false,
				},
				//typescript: true,
				//vueTsc: true,
				//oxlint: true,
				biome: {
					command: 'check',
				},
			}),*/
		],
	},
})
