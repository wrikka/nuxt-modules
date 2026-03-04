import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  preset: 'bun',
  compatibilityDate: '2025-12-17',
  devtools: { enabled: true },
  modules: [
    '@vue-macros/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    'nuxt-mcp-dev'
  ],
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  sourcemap: {
    server: false,
    client: false,
  },
  vite: {
    server: {
      hmr: {
        port: 24679,
      },
    },
    plugins: [],
  },
})
