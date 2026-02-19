import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "nuxt/schema";

const config: NuxtConfig = {
	compatibilityDate: "2025-02-19",
	modules: ["../src/module.ts", "@unocss/nuxt"],
};

const exportedConfig: typeof config = defineNuxtConfig(config);
export default exportedConfig;
