import { defineDocsConfig } from './app/composables/useDocsConfig'
import type { DocsConfig } from './app/types'

export default defineDocsConfig({
  // Site Metadata
  title: 'WDocs',
  titleTemplate: ':title | WDocs',
  description: 'Documentation made simple',
  base: '/',
  lang: 'en-US',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c3c3c' }]
  ],

  // Appearance
  appearance: true,
  lastUpdated: true,

  // Theme Config
  themeConfig: {
    // Logo
    logo: '/logo.svg',
    siteTitle: 'WDocs',

    // Navigation
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      { text: 'API', link: '/api/' }
    ],

    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        },
        {
          text: 'Writing',
          items: [
            { text: 'Markdown', link: '/guide/markdown' },
            { text: 'Assets', link: '/guide/assets' },
            { text: 'Frontmatter', link: '/guide/frontmatter' }
          ]
        }
      ],
      '/config/': [
        {
          text: 'Config Reference',
          items: [
            { text: 'Introduction', link: '/config/' },
            { text: 'Site Config', link: '/config/site-config' },
            { text: 'Theme Config', link: '/config/theme-config' }
          ]
        }
      ]
    },

    // Social Links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wrikka/wdocs' },
      { icon: 'twitter', link: 'https://twitter.com/wrikka' },
      { icon: 'discord', link: 'https://discord.gg/wrikka' }
    ],

    // Search
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search docs'
          },
          modal: {
            noResultsText: 'No results for',
            resetButtonTitle: 'Clear query',
            footer: {
              selectText: 'to select',
              navigateText: 'to navigate',
              closeText: 'to close'
            }
          }
        }
      }
    },

    // Edit Link
    editLink: {
      pattern: 'https://github.com/wrikka/wdocs/edit/main/docs/:path',
      text: 'Edit this page'
    },

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Wrikka'
    },

    // Outline
    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    // Last Updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },

    // Doc Footer
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    // Dark Mode Switch
    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',

    // Sidebar Menu Label
    sidebarMenuLabel: 'Menu',

    // Return to Top Label
    returnToTopLabel: 'Return to top',

    // Mobile Menu
    mobileMenu: {
      openLabel: 'Open navigation',
      closeLabel: 'Close navigation'
    },

    // External Link Icon
    externalLinkIcon: true,

    // i18n Routing
    i18nRouting: false
  },

  // WMarkdown Configuration
  wmarkdown: {
    shiki: {
      theme: 'github-dark',
      darkTheme: 'github-dark',
      langs: ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'css', 'html']
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

  // WContent Configuration
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

  // i18n
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    th: {
      label: 'Thai',
      lang: 'th',
      link: '/th/',
      themeConfig: {
        nav: [
          { text: 'คู่มือ', link: '/th/guide/' }
        ]
      }
    }
  },

  // Build
  build: {
    outDir: '.docs-dist',
    cacheDir: '.docs-cache',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    minify: true,
    sitemap: {
      hostname: 'https://docs.wrikka.com'
    },
    robots: {
      allowAll: true,
      sitemap: ['https://docs.wrikka.com/sitemap.xml']
    }
  },

  // PWA
  pwa: {
    enabled: false,
    manifest: {
      name: 'WDocs',
      short_name: 'WDocs',
      description: 'Documentation made simple',
      theme_color: '#3c3c3c',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  // Analytics
  analytics: {
    googleAnalytics: {
      id: 'G-XXXXXXXXXX'
    },
    plausible: {
      domain: 'docs.wrikka.com'
    }
  },

  // Search Config (Algolia alternative)
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_API_KEY',
    indexName: 'wdocs'
  },

  // Carbon Ads
  carbonAds: {
    code: 'YOUR_CODE',
    placement: 'YOUR_PLACEMENT'
  },

  // Rewrites
  rewrites: {
    'source/:page': 'target/:page'
  },

  // Transform Head
  transformHead: ({ page, site, content }: { page: any; site: any; content: any }) => {
    return {
      meta: [
        { property: 'og:title', content: page.title }
      ]
    }
  },

  // Transform Page Data
  transformPageData: (pageData: any) => {
    return pageData
  },

  // Sitemap
  sitemap: {
    hostname: 'https://docs.wrikka.com',
    lastmodDateOnly: false,
    include: ['/guide/**', '/config/**'],
    exclude: ['/draft/**', '/private/**'],
    changefreq: 'weekly',
    priority: 0.8
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['@vueuse/core', 'vue']
    },
    server: {
      port: 5173
    }
  },

  // Hooks
  hooks: {
    'docs:init': () => {
      console.log('WDocs initialized')
    },
    'docs:build:before': () => {
      console.log('Building docs...')
    },
    'docs:build:after': () => {
      console.log('Docs built successfully')
    }
  }
})
