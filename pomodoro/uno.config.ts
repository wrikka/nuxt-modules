/// <reference types="unocss" />
import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss"

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
		presetIcons(),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
		transformerCompileClass(),
	],
	theme: {
		colors: {
			pomodoro: {
				work: "#ef4444",
				shortBreak: "#22c55e",
				longBreak: "#3b82f6",
				text: "#1f2937",
				bg: "#ffffff",
			},
		},
	},
})
