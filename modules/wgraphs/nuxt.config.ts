import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  modules: [
    '@unocss/nuxt',
  ],
  css: [],
  devtools: { enabled: true },
  compatibilityDate: '2023-03-04',
})
