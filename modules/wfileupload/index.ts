import { defineNuxtModule, addComponent, addImports, createResolver } from '@nuxt/kit'

export interface FileUploadOptions {
  // Basic options
  maxFileSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  maxFiles?: number

  // Feature 1-2: Chunked & Resumable Upload
  enableChunkedUpload?: boolean
  chunkSize?: number
  enableResumableUpload?: boolean

  // Feature 3: Parallel Upload
  maxParallelUploads?: number

  // Feature 4: Cloud Sources
  enableCloudSources?: boolean
  cloudSources?: ('github' | 'googledrive' | 'onedrive' | 'dropbox' | 'box' | 's3' | 'azure')[]

  // Feature 6: Custom Validators
  customValidators?: string[]

  // Feature 7: Folder Upload
  enableFolderUpload?: boolean

  // Feature 8: Image Editor
  enableImageEditor?: boolean

  // Feature 9: Duplicate Detection
  enableDuplicateDetection?: boolean

  // Feature 10: Upload Queue
  enableUploadQueue?: boolean

  // Feature 12-13: Webcam & Screen Recording
  enableWebcamCapture?: boolean
  enableScreenRecording?: boolean

  // Feature 14: URL Import
  enableURLImport?: boolean

  // Feature 15: Compression
  enableCompression?: boolean
}

export default defineNuxtModule<FileUploadOptions>({
  meta: {
    name: 'wfileupload',
    configKey: 'wfileupload'
  },
  defaults: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'text/*', 'application/pdf'],
    multiple: true,
    maxFiles: 5,

    // New features defaults
    enableChunkedUpload: true,
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
    enableResumableUpload: true,
    maxParallelUploads: 3,
    enableCloudSources: true,
    cloudSources: ['github', 'googledrive', 'onedrive', 'dropbox', 'box', 's3', 'azure'],
    enableFolderUpload: true,
    enableImageEditor: true,
    enableDuplicateDetection: true,
    enableUploadQueue: true,
    enableWebcamCapture: true,
    enableScreenRecording: true,
    enableURLImport: true,
    enableCompression: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const resolve = resolver.resolve

    // Add imports from wcomposables
    addImports([
      { name: 'useFileUpload', from: '@wrikka/wcomposables' }
    ])

    // Add main component
    addComponent({
      name: 'FileUpload',
      filePath: resolve('./runtime/components/FileUpload.vue'),
      priority: 1
    })

    // Add new feature components
    const featureComponents = [
      { name: 'WebcamCapture', filePath: resolve('./runtime/components/WebcamCapture.vue') },
      { name: 'ScreenRecorder', filePath: resolve('./runtime/components/ScreenRecorder.vue') },
      { name: 'URLImport', filePath: resolve('./runtime/components/URLImport.vue') },
      { name: 'ImageEditor', filePath: resolve('./runtime/components/ImageEditor.vue') },
      { name: 'VideoAudioPreview', filePath: resolve('./runtime/components/VideoAudioPreview.vue') },
      { name: 'DropboxUpload', filePath: resolve('./runtime/components/DropboxUpload.vue') },
      { name: 'BoxUpload', filePath: resolve('./runtime/components/BoxUpload.vue') },
      { name: 'S3Upload', filePath: resolve('./runtime/components/S3Upload.vue') },
      { name: 'AzureUpload', filePath: resolve('./runtime/components/AzureUpload.vue') }
    ]

    for (const component of featureComponents) {
      addComponent({
        name: component.name,
        filePath: component.filePath,
        priority: 1
      })
    }

    // Make options available to runtime
    nuxt.options.runtimeConfig.public.wfileupload = {
      // Basic
      maxFileSize: options.maxFileSize!,
      allowedTypes: options.allowedTypes!,
      multiple: options.multiple!,
      maxFiles: options.maxFiles!,

      // Features 1-15
      enableChunkedUpload: options.enableChunkedUpload!,
      chunkSize: options.chunkSize!,
      enableResumableUpload: options.enableResumableUpload!,
      maxParallelUploads: options.maxParallelUploads!,
      enableCloudSources: options.enableCloudSources!,
      cloudSources: options.cloudSources!,
      enableFolderUpload: options.enableFolderUpload!,
      enableImageEditor: options.enableImageEditor!,
      enableDuplicateDetection: options.enableDuplicateDetection!,
      enableUploadQueue: options.enableUploadQueue!,
      enableWebcamCapture: options.enableWebcamCapture!,
      enableScreenRecording: options.enableScreenRecording!,
      enableURLImport: options.enableURLImport!,
      enableCompression: options.enableCompression!
    }
  }
})
