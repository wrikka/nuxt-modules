import { defineNuxtConfig } from "nuxt/config";
import checker from "vite-plugin-checker";

export default defineNuxtConfig({
  preset: 'bun',
	compatibilityDate: "latest",
	devtools: { enabled: true },

	typescript: {
		strict: true,
		typeCheck: true,
	},

	vite: {
		plugins: [
			checker({
				overlay: {
					initialIsOpen: false,
				},
				typescript: true,
				vueTsc: true,
				oxlint: true,
			}),
		],
	},
});
