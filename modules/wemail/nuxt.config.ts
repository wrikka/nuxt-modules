import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  preset: 'bun',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: "2025-12-17", 
  devtools: { enabled: true },
  modules: [
    "@vue-macros/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-mcp-dev",
    "@nuxt/icon"
  ],

  icon: {
    serverBundle: {
      collections: ['mdi'] 
    }
  },

  nitro : {
    preset: "cloudflare_module",
    routeRules: {
      '/**': { cors: true },
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
  vite: {
    plugins: [],
  }
});
