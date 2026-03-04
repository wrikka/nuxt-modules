import { defineConfig, presetWind4, transformerVariantGroup, transformerDirectives, transformerCompileClass } from 'unocss'
import { presetWtheme } from './src/preset'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetWtheme(),
  ],

  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
    transformerCompileClass(),
  ],
})
