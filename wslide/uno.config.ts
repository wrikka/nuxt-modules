import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		},),
		presetIcons(),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
		transformerCompileClass(),
	],
	theme: {
		colors: {
			wslide: {
				bg: "#1a1a1a",
				text: "#ffffff",
				primary: "#3b82f6",
				secondary: "#8b5cf6",
				accent: "#f59e0b",
			},
		},
	},
},);
