import type { NuxtModule } from '@nuxt/schema'
import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir, addPlugin } from '@nuxt/kit'

export interface ModuleOptions {
  prefix?: string
  defaultTab?: string
  enableTheme?: boolean
}

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@wrikka/wdashboard',
    configKey: 'wdashboard',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    prefix: 'W',
    defaultTab: 'profile',
    enableTheme: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add components
    addComponentsDir({
      path: resolver.resolve('./runtime/components/tabs'),
      prefix: options.prefix,
      pathPrefix: false
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components/layout'),
      prefix: options.prefix,
      pathPrefix: false
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false
    })

    // Add composables
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Add theme plugin if enabled
    if (options.enableTheme) {
      addPlugin(resolver.resolve('./runtime/plugins/theme.client'))
    }
  }
})

export default module
