import type { NuxtConfig } from "nuxt/schema"

const config: NuxtConfig = {
	compatibilityDate: "2025-02-19",
	modules: ["./src/module.ts", "@unocss/nuxt"],
	pomodoro: {
		workDuration: 25,
		shortBreakDuration: 5,
		longBreakDuration: 15,
		longBreakInterval: 4,
		autoStartBreaks: false,
		autoStartPomodoros: false,
	},
	unocss: {
		nuxtLayers: true,
	},
}

export default config
