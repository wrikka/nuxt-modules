
import checker from 'vite-plugin-checker';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	modules: ["@unocss/nuxt"],
	typescript: {
		strict: true,
		typeCheck: true
	},
	vite: {
		plugins: [
			checker({
				overlay: {
					initialIsOpen: false,
				},
				biome: { command: "lint" },
				oxlint: true,
				typescript: true,
				vueTsc: true,
			}) as any,
		],
	},
})
