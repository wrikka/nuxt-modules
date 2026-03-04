import { ref, computed } from 'vue'
import type { ImageUploadOptions } from '../types'

interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  type: string
}

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export function useImageUpload(options: ImageUploadOptions) {
  const isUploading = ref(false)
  const progress = ref<UploadProgress>({ loaded: 0, total: 0, percentage: 0 })
  const error = ref<string | null>(null)
  const uploadedImages = ref<UploadedImage[]>([])

  const isValidFile = (file: File): boolean => {
    const maxSize = options.maxSize || 5 * 1024 * 1024 // 5MB default
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) {
      error.value = `File too large. Max size: ${formatBytes(maxSize)}`
      return false
    }

    if (!allowedTypes.includes(file.type)) {
      error.value = `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
      return false
    }

    return true
  }

  const upload = async (file: File): Promise<UploadedImage | null> => {
    if (!options.enabled) {
      error.value = 'Image upload is disabled'
      return null
    }

    if (!isValidFile(file)) {
      return null
    }

    isUploading.value = true
    error.value = null
    progress.value = { loaded: 0, total: file.size, percentage: 0 }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      const uploadPromise = new Promise<UploadedImage>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            progress.value = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            }
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            const image: UploadedImage = {
              id: response.id || generateId(),
              url: response.url,
              name: file.name,
              size: file.size,
              type: file.type
            }
            uploadedImages.value.push(image)
            resolve(image)
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'))
        })

        xhr.open('POST', options.endpoint || '/api/upload')
        xhr.send(formData)
      })

      return await uploadPromise
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Upload failed'
      return null
    } finally {
      isUploading.value = false
    }
  }

  const uploadMultiple = async (files: File[]): Promise<UploadedImage[]> => {
    const results = await Promise.all(files.map(file => upload(file)))
    return results.filter((img): img is UploadedImage => img !== null)
  }

  const removeImage = (id: string) => {
    const index = uploadedImages.value.findIndex(img => img.id === id)
    if (index !== -1) {
      uploadedImages.value.splice(index, 1)
    }
  }

  const clearError = () => {
    error.value = null
  }

  const getMarkdownImage = (image: UploadedImage, alt?: string): string => {
    return `![${alt || image.name}](${image.url})`
  }

  return {
    isUploading,
    progress,
    error,
    uploadedImages,
    upload,
    uploadMultiple,
    removeImage,
    clearError,
    getMarkdownImage,
    isValidFile
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
