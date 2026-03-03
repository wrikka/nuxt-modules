import { defineConfig } from 'vitepress'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  title: '@wpackages/chart',
  description: 'Nuxt chart utilities module for data visualization',
  vite: {
    plugins: [UnoCSS()],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../module/src/runtime')
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/installation' },
      { text: 'API', link: '/guide/api' },
      { text: 'Examples', link: '/guide/examples' }
    ],
    sidebar: {
      '/guide/': [
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Usage', link: '/guide/usage' },
        { text: 'API Reference', link: '/guide/api' },
        { text: 'Examples', link: '/guide/examples' },
        { text: 'Composables', link: '/guide/composables' },
        { text: 'Components', link: '/guide/components' },
        { text: 'Configuration', link: '/guide/configuration' },
        { text: 'Contributing', link: '/guide/contributing' }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wrikka/bun-packages' }
    ]
  }
})
