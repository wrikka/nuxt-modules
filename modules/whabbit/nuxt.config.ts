import checker from "vite-plugin-checker";

export default defineNuxtConfig({
  preset: 'bun',
  compatibilityDate: 'latest',
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@vue-macros/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    'nuxt-mcp-dev',
    '@scalar/nuxt'
  ],

  scalar: {
    url: 'https://registry.scalar.com/@scalar/apis/galaxy?format=yaml',
  },

  css: ['~/assets/css/main.css', '~/assets/css/theme.css'],

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    public: {}
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  icon: {
    serverBundle: {
      collections: ['mdi']
    }
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
            pattern: "*example.com",
            custom_domain: true,
          },
        ]
      }
    },
  },

  vite: {
    plugins: [
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        vueTsc: true,
        oxlint: true,
      }),
    ],
  },

  app: {
    head: {
      title: 'HabitKit - Track Your Habits',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track your habits with ease and view your daily progress in a clear, intuitive way.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
