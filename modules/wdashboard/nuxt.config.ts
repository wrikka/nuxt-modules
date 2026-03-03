import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-04',
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  imports: {
    autoImport: true
  },
  modules: ['@unocss/nuxt']
})
