import {
	defineConfig,
	presetIcons,
	presetWind,
	transformerVariantGroup,
	transformerDirectives,
	transformerCompileClass,
} from "unocss";

export default defineConfig({
	presets: [
		presetWind({
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
});
