import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@vue-macros/nuxt',
    '@unocss/nuxt',
    '@nuxt/icon'
  ],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: true
  },

  icon: {
    serverBundle: {
      collections: ['mdi', 'lucide']
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        'shiki'
      ]
    }
  }
})
