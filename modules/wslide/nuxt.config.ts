import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "nuxt/schema";

const config: NuxtConfig = {
	preset: 'bun',
	compatibilityDate: "2025-02-19",
	devtools: { enabled: false },
	modules: ["./module/slide/module", "@unocss/nuxt"],
	typescript: {
		strict: true,
		typeCheck: true,
	},
	vite: {
		define: {
			global: 'globalThis',
		},
		optimizeDeps: {
			include: ['buffer']
		},
		resolve: {
			alias: {
				buffer: 'buffer'
			}
		}
	},
	nitro: {
		experimental: {
			wasm: true
		}
	}
};

const exportedConfig: typeof config = defineNuxtConfig(config);
export default exportedConfig;
