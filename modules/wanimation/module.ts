import { defineNuxtModule, addImportsDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'wanimation',
    configKey: 'wanimation',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  defaults: {
    // Module defaults
  },
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add composables auto-import
    addImportsDir(resolver.resolve('./app/composables'))

    // Add components auto-import
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolver.resolve('./app/components'),
        prefix: 'W',
        global: true,
      })
    })
  },
})
