import { defineNuxtModule, addImportsDir, addComponentsDir, createResolver } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'

export default defineNuxtModule({
  meta: {
    name: '@wrikka/wvideo-editor',
    configKey: 'wvideoEditor',
    compatibility: {
      nuxt: '>=3.0.0'
    }
  },
  defaults: {
    // Default options
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Add composables auto-imports
    addImportsDir(resolve(runtimeDir, 'composables'))

    // Add components auto-imports
    addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      pathPrefix: false,
    })

    // Add types
    nuxt.hook('prepare:types', (options) => {
      options.tsConfig.include ||= []
      options.tsConfig.include.push(resolve(runtimeDir, 'types'))
    })
  }
})
