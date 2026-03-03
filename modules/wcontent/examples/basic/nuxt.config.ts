import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  preset: 'bun',
	modules: ["../../src/module"],
	content: {
		watch: true,
	},
});
