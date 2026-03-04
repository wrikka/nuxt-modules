import type { DocsConfig } from '../types'
import { defu } from 'defu'

const defaultConfig: DocsConfig = {
  title: 'WDocs',
  description: 'Documentation made simple',
  base: '/',
  lang: 'en-US',
  appearance: true,
  lastUpdated: true,
  themeConfig: {
    nav: [],
    sidebar: [],
    socialLinks: [],
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },
    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',
    langMenuLabel: 'Languages',
    externalLinkIcon: true
  },
  content: {
    root: 'content',
    documentDriven: true
  },
  markdown: {
    theme: 'github-dark',
    lineNumbers: false
  }
}

export function defineDocsConfig(config: DocsConfig): DocsConfig {
  return defu(config, defaultConfig) as DocsConfig
}

export function useDocsConfig(): DocsConfig {
  const nuxtApp = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()

  // Get config from runtime config (injected by module)
  const config = runtimeConfig.public.wdocs as DocsConfig

  return defu(config, defaultConfig) as DocsConfig
}

export function useDocsThemeConfig() {
  const config = useDocsConfig()
  return computed(() => config.themeConfig)
}

export function useDocsLocale() {
  const { locale } = useI18n()
  const config = useDocsConfig()

  const currentLocale = computed(() => {
    const locales = config.locales
    if (!locales) return null
    return locales[locale.value as keyof typeof locales]
  })

  return {
    locale: currentLocale,
    config
  }
}
