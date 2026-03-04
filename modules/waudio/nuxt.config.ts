import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  name: 'waudio',

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@unocss/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  imports: {
    dirs: ['composables/**', 'utils/**'],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2025-03-01',
})
