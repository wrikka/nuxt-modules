import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	compatibilityDate: "2026-02-25",
	modules: ["@wrikka/diff-modules", "@unocss/nuxt", "@pinia/nuxt"],
});
