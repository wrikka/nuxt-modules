export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
  ],

  unocss: {
    nuxtLayers: true,
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2025-01-01',
})
