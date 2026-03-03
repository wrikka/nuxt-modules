import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import unocss from '@unocss/vite'

export default defineConfig({
  title: 'WUI Documentation',
  description: 'Documentation for WUI Nuxt Module',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'Buttons', link: '/components/buttons' },
            { text: 'Forms', link: '/components/forms' },
            { text: 'Layout', link: '/components/layout' }
          ]
        }
      ]
    }
  },
  vite: {
    plugins: [
      unocss()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../modules/wui/runtime'),
        '~': resolve(__dirname, '../../modules/wui/runtime')
      }
    },
    optimizeDeps: {
      include: ['vue']
    }
  }
})
