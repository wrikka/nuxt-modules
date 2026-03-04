import type { DocsConfig, ModuleOptions } from './app/types'
import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir, installModule } from '@nuxt/kit'
import { defu } from 'defu'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@wrikka/wdocs',
    configKey: 'wdocs',
    version: '0.1.0'
  },
  defaults: {
    enabled: true,
    title: 'WDocs',
    description: 'Documentation made simple',
    base: '/',
    lang: 'en-US',
    appearance: true,
    lastUpdated: true
  },
  async setup(options, nuxt) {
    if (!options.enabled) return

    const resolver = createResolver(import.meta.url)

    // Load user docs.config.ts if exists
    let userConfig: Partial<DocsConfig> = {}
    try {
      const configPath = resolver.resolve(nuxt.options.rootDir, 'docs.config.ts')
      const configModule = await import(configPath)
      userConfig = configModule.default || configModule
    } catch {
      // No user config found, use defaults
    }

    // Merge configs
    const config = defu(userConfig, options) as DocsConfig

    // Expose config to runtime
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.public.wdocs = config

    // Install required modules
    await installModule('@nuxt/content')
    await installModule('@nuxt/icon')
    await installModule('@unocss/nuxt')
    await installModule('@vueuse/nuxt')

    // Add components
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      pathPrefix: false
    })

    // Add composables
    addImportsDir(resolver.resolve('./app/composables'))
    addImportsDir(resolver.resolve('./app/types'))

    // Add CSS
    nuxt.options.css.push(resolver.resolve('./app/assets/css/main.css'))

    // Content configuration
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.publicAssets = nitroConfig.publicAssets || []
      nitroConfig.publicAssets.push({
        dir: resolver.resolve('./app/assets'),
        maxAge: 60 * 60 * 24 * 365
      })
    })

    // Run hooks
    if (config.hooks?.['docs:init']) {
      await config.hooks['docs:init']()
    }

    nuxt.hook('build:before', async () => {
      if (config.hooks?.['docs:build:before']) {
        await config.hooks['docs:build:before']()
      }
    })

    nuxt.hook('build:done', async () => {
      if (config.hooks?.['docs:build:after']) {
        await config.hooks['docs:build:after']()
      }
    })
  }
})

export type { DocsConfig, ModuleOptions }
