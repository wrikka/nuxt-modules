import type { HeadConfig } from '@unhead/schema'

// Head
export type Head = HeadConfig[]

// Social Link
export interface SocialLink {
  icon: 'github' | 'twitter' | 'discord' | 'youtube' | 'linkedin' | 'instagram' | 'facebook' | 'slack' | 'mastodon' | string
  link: string
  ariaLabel?: string
}

// Nav Item
export interface NavItem {
  text: string
  link?: string
  items?: NavItem[]
  activeMatch?: string
}

// Sidebar Item
export interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
  base?: string
  docFooterText?: string
  rel?: string
  target?: string
}

// Sidebar
export type Sidebar = SidebarItem[] | Record<string, SidebarItem[]>

// Edit Link
export interface EditLink {
  pattern: string | ((payload: { relativePath: string }) => string)
  text?: string
}

// Carbon Ads
export interface CarbonAds {
  code: string
  placement: string
}

// Algolia Search
export interface AlgoliaSearch {
  appId: string
  apiKey: string
  indexName: string
  locales?: Record<string, Partial<AlgoliaSearch>>
}

// Local Search
export interface LocalSearchOptions {
  locales?: Record<string, {
    translations: {
      button: {
        buttonText: string
        buttonAriaLabel: string
      }
      modal: {
        displayDetails: string
        resetButtonTitle: string
        backButtonTitle: string
        noResultsText: string
        footer: {
          selectText: string
          upText: string
          navigateText: string
          closeText: string
        }
      }
    }
  }>
}

// Search
export interface SearchConfig {
  provider: 'local' | 'algolia'
  options?: LocalSearchOptions | AlgoliaSearch
}

// Outline
export interface Outline {
  level: number | [number, number] | 'deep'
  label?: string
}

// Last Updated
export interface LastUpdated {
  text: string
  formatOptions?: Intl.DateTimeFormatOptions
}

// Doc Footer
export interface DocFooter {
  prev?: string | false
  next?: string | false
}

// Footer
export interface Footer {
  message?: string
  copyright?: string
}

// Mobile Menu
export interface MobileMenu {
  openLabel: string
  closeLabel: string
}

// Theme Config
export interface ThemeConfig {
  logo?: string | { src: string; alt?: string; width?: number; height?: number }
  siteTitle?: string | false
  nav?: NavItem[]
  sidebar?: Sidebar
  socialLinks?: SocialLink[]
  search?: SearchConfig
  carbonAds?: CarbonAds
  editLink?: EditLink
  lastUpdated?: LastUpdated | false
  docFooter?: DocFooter
  outline?: Outline | false
  footer?: Footer
  darkModeSwitchLabel?: string
  lightModeSwitchTitle?: string
  darkModeSwitchTitle?: string
  sidebarMenuLabel?: string
  returnToTopLabel?: string
  langMenuLabel?: string
  externalLinkIcon?: boolean
  mobileMenu?: MobileMenu
  i18nRouting?: boolean
}

// Locale Config
export interface LocaleConfig {
  label: string
  lang?: string
  link?: string
  themeConfig?: Partial<ThemeConfig>
}

// Locales
export type Locales<Keys extends string = string> = Record<Keys, LocaleConfig>

// Content
export interface ContentConfig {
  root?: string
  dir?: {
    root?: string
    static?: string
  }
  ignores?: string[]
  documentDriven?: boolean
  navigation?: {
    fields?: string[]
  }
}

// Markdown
export interface MarkdownConfig {
  theme?: string
  lineNumbers?: boolean
  config?: (md: MarkdownIt) => void
}

// Build
export interface BuildConfig {
  outDir?: string
  cacheDir?: string
  assetsDir?: string
  assetsInlineLimit?: number
  minify?: boolean
  sitemap?: {
    hostname: string
    outFile?: string
  }
  robots?: {
    allowAll?: boolean
    sitemap?: string[]
  }
}

// PWA
export interface PWAConfig {
  enabled?: boolean
  manifest?: {
    name?: string
    short_name?: string
    description?: string
    theme_color?: string
    icons?: Array<{
      src: string
      sizes: string
      type: string
    }>
  }
}

// Analytics
export interface AnalyticsConfig {
  googleAnalytics?: {
    id: string
  }
  plausible?: {
    domain: string
    apiHost?: string
  }
}

// Sitemap
export interface SitemapConfig {
  hostname: string
  lastmodDateOnly?: boolean
  include?: string[]
  exclude?: string[]
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  xslUrl?: string
  xslTitlle?: string
}

// Vite
export interface ViteConfig {
  optimizeDeps?: {
    include?: string[]
    exclude?: string[]
  }
  server?: {
    port?: number
    host?: boolean | string
  }
  build?: {
    rollupOptions?: any
  }
}

// Rewrites
export type Rewrites = Record<string, string>

// Transform Head
export type TransformHead = (payload: { page: any; site: any; content: any }) => HeadConfig[] | undefined

// Transform Page Data
export type TransformPageData = (pageData: any) => any

// Hooks
export interface DocsHooks {
  'docs:init'?: () => void | Promise<void>
  'docs:build:before'?: () => void | Promise<void>
  'docs:build:after'?: () => void | Promise<void>
}

// Main Docs Config
export interface DocsConfig {
  // Site Metadata
  title?: string
  titleTemplate?: string | boolean
  description?: string
  base?: string
  lang?: string
  head?: Head
  appearance?: boolean | 'dark' | 'force-dark' | 'force-auto'
  lastUpdated?: boolean

  // Theme
  themeConfig?: ThemeConfig

  // Content
  content?: ContentConfig

  // Markdown
  markdown?: MarkdownConfig

  // i18n
  locales?: Locales

  // Build
  build?: BuildConfig

  // PWA
  pwa?: PWAConfig

  // Analytics
  analytics?: AnalyticsConfig

  // Algolia
  algolia?: AlgoliaSearch

  // Sitemap
  sitemap?: SitemapConfig

  // Rewrites
  rewrites?: Rewrites

  // Vite
  vite?: ViteConfig

  // Transforms
  transformHead?: TransformHead
  transformPageData?: TransformPageData

  // Hooks
  hooks?: DocsHooks
}
