import { defineNuxtModule, addComponent, addImports, createResolver } from '@nuxt/kit'

export interface FileUploadOptions {
  maxFileSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  maxFiles?: number
}

export default defineNuxtModule<FileUploadOptions>({
  meta: {
    name: 'file-upload',
    configKey: 'fileUpload'
  },
  defaults: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'text/*', 'application/pdf'],
    multiple: true,
    maxFiles: 5
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const resolve = resolver.resolve

    addImports([
      { name: 'useFileUpload', from: resolve('../shared/composables/useFileUpload') }
    ])

    // Add component to auto-imports
    addComponent({
      name: 'FileUpload',
      filePath: resolve('./runtime/components/FileUpload.vue'),
      priority: 1
    })

    // Make options available to runtime
    nuxt.options.runtimeConfig.public.fileUpload = {
      maxFileSize: options.maxFileSize!,
      allowedTypes: options.allowedTypes!,
      multiple: options.multiple!,
      maxFiles: options.maxFiles!
    }
  }
})
