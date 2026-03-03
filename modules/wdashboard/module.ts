import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'

export interface ModuleOptions {
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@wrikka/wdashboard',
    configKey: 'wdashboard',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    prefix: 'W'
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

    // Add composables
    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
