import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	modules: [
		"./modules/wdocs.ts",
		"@wrikka/wdesign",
	],
	devtools: { enabled: true },
});
