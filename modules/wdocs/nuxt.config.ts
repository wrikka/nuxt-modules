import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@vue-macros/nuxt',
    '@unocss/nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@wrikka/wcontent',
    '@wrikka/wmarkdown',
    '@vite-pwa/nuxt'
  ],

  css: ['~/assets/css/main.css', '~/assets/css/theme.css'],

  wcontent: {
    contentDirs: ['content'],
    database: {
      type: 'sqlite',
      path: '.data/content.db'
    },
    search: {
      enabled: true,
      fuzzy: true
    },
    sitemap: {
      enabled: true
    },
    rss: {
      enabled: true,
      title: 'WDocs Documentation',
      description: 'Latest documentation updates'
    }
  },

  wmarkdown: {
    shiki: {
      theme: 'github-light',
      darkTheme: 'github-dark',
      langs: ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'css', 'html', 'rust', 'go', 'python', 'mermaid']
    },
    features: {
      linkPreview: true,
      toc: true,
      tables: true,
      interactive: true,
      mermaid: true,
      katex: true
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  icon: {
    serverBundle: {
      collections: ['mdi', 'lucide']
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'WDocs',
      short_name: 'WDocs',
      description: 'Documentation made simple',
      theme_color: '#3c3c3c',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },

  app: {
    head: {
      templateParams: {
        separator: ' | '
      },
      titleTemplate: '%s %separator WDocs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Documentation site powered by WDocs' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        'minisearch',
        'shiki',
        'mermaid',
        'katex',
        'feed'
      ]
    }
  }
})
