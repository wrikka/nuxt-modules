export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
	compatibilityDate: "2025-12-17", 
	devtools: { enabled: true },
	modules: [
        "@vue-macros/nuxt",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "@unocss/nuxt",
        "@pinia/nuxt",
        "nuxt-mcp-dev",
        "@nuxt/icon"
    ],

    icon: {
        serverBundle: {
        collections: ['mdi'] 
        }
    },

    nitro : {
        preset: "cloudflare_module",
        routeRules: {
            '/**': { cors: true },
        },
        cloudflare: {
            deployConfig: true,
            nodeCompat: true,
        },
    },

	typescript: {
		// typeCheck: true
		// strict: true
	},
	vite : {
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
	}
});
