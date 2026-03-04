import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  preset: 'bun',
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: [
    '@vue-macros/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    'nuxt-mcp-dev',
    '@nuxt/icon',
    '@scalar/nuxt',
  ],

  scalar: {
    url: 'https://registry.scalar.com/@scalar/apis/galaxy?format=yaml',
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  icon: {
    serverBundle: {
      collections: ['mdi'],
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        routes: [
          {
            pattern: '*example.com',
            custom_domain: true,
          },
        ],
      },
    },
  },


});
