// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    //typeCheck: true,
    //strict: true
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
    plugins: [
      /*
            checker({
                overlay: {
                    initialIsOpen: false,
                },
                //typescript: true,
                //vueTsc: true,
                //oxlint: true,
                biome: {
                    command: 'check',
                },
            }),*/
    ],
  },
})
