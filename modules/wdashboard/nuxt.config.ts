import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  compatibilityDate: '2026-03-04',
  components: [
    {
      path: './runtime/components',
      pathPrefix: false
    }
  ],
  imports: {
    autoImport: true,
    dirs: ['./runtime/composables']
  },
  modules: ['@unocss/nuxt']
})
