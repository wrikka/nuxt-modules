import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'

export interface ModuleOptions {
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wgraphs',
    configKey: 'wgraphs',
    compatibility: {
      nuxt: '^4.0.0'
    }
  },
  defaults: {
    prefix: 'W'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Graph algorithm composables
    addImportsDir(resolver.resolve('./app/composables'))

    // Chart components
    addComponentsDir({
      path: resolver.resolve('./app/components/charts'),
      prefix: options.prefix,
      pathPrefix: false
    })

    // Graph visualization components
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      prefix: false,
      pathPrefix: false
    })
  }
})
