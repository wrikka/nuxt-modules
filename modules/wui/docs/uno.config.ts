import { defineConfig, presetUno, presetWind, transformerVariantGroup, transformerDirectives, transformerCompileClass } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWind({
      preflights: {
        reset: true,
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
    transformerCompileClass(),
  ],
  content: {
    filesystem: ['./**/*.{html,js,ts,jsx,tsx,vue,svelte,md}'],
  },
})
