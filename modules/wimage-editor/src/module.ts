import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Default canvas width
   * @default 800
   */
  defaultCanvasWidth?: number
  /**
   * Default canvas height
   * @default 600
   */
  defaultCanvasHeight?: number
  /**
   * Default export format
   * @default 'png'
   */
  defaultExportFormat?: 'png' | 'jpeg' | 'webp'
  /**
   * Default export quality (0-1)
   * @default 0.92
   */
  defaultExportQuality?: number
  /**
   * Enable undo/redo history
   * @default true
   */
  enableHistory?: boolean
  /**
   * Maximum history stack size
   * @default 20
   */
  maxHistorySize?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@wrikka/wimage-editor',
    configKey: 'wimageEditor',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    defaultCanvasWidth: 800,
    defaultCanvasHeight: 600,
    defaultExportFormat: 'png',
    defaultExportQuality: 0.92,
    enableHistory: true,
    maxHistorySize: 20
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add runtime config
    nuxt.options.runtimeConfig.public.wimageEditor = options

    // Add composables
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Add components
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'W',
      pathPrefix: false
    })
  }
})
