import { defineConfig, presetIcons, presetWind4, transformerVariantGroup, transformerDirectives, transformerCompileClass } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind4({
      preflights: {
        reset: true
      },
    }),
  ],

  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
    transformerCompileClass(),
  ],

})
