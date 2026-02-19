import { defineConfig, presetIcons, presetWind4, transformerVariantGroup, transformerDirectives, transformerCompileClass } from 'unocss'

export default defineConfig({
	presets: [
		presetWind4({
            preflights: { 
                reset: true, 
            } 
        }),
		presetIcons({
			autoInstall: true,
			collections: {
				mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
			}
		})
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
		transformerCompileClass()
	],
})
