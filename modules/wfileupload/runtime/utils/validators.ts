export type ValidationResult = {
  valid: boolean
  error?: string
  code?: string
}

export type FileValidator = (file: File) => ValidationResult | Promise<ValidationResult>

export interface ValidatorOptions {
  validators: FileValidator[]
  stopOnFirstError?: boolean
}

export function createCustomValidator(options: ValidatorOptions) {
  const { validators, stopOnFirstError = true } = options

  return {
    async validate(file: File): Promise<ValidationResult> {
      for (const validator of validators) {
        const result = await validator(file)
        if (!result.valid && stopOnFirstError) {
          return result
        }
      }
      return { valid: true }
    },

    async validateAll(files: File[]): Promise<{ file: File; result: ValidationResult }[]> {
      return Promise.all(
        files.map(async file => ({
          file,
          result: await this.validate(file)
        }))
      )
    }
  }
}

// Built-in validators
export const validators = {
  // Checksum validator - verify file integrity
  checksum: (expectedHash: string, algorithm: 'SHA-256' | 'SHA-1' = 'SHA-256'): FileValidator => {
    return async (file: File): Promise<ValidationResult> => {
      try {
        const buffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const actualHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        if (actualHash !== expectedHash.toLowerCase()) {
          return {
            valid: false,
            error: `Checksum mismatch. Expected: ${expectedHash}, Got: ${actualHash}`,
            code: 'CHECKSUM_MISMATCH'
          }
        }
        return { valid: true }
      } catch {
        return {
          valid: false,
          error: 'Failed to calculate checksum',
          code: 'CHECKSUM_ERROR'
        }
      }
    }
  },

  // File name validator - check for invalid characters
  fileName: (options: { pattern?: RegExp; blockedChars?: string[] } = {}): FileValidator => {
    const { pattern, blockedChars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'] } = options

    return (file: File): ValidationResult => {
      if (pattern && !pattern.test(file.name)) {
        return {
          valid: false,
          error: `File name does not match required pattern: ${pattern.source}`,
          code: 'INVALID_FILENAME_PATTERN'
        }
      }

      const hasBlockedChars = blockedChars.some(char => file.name.includes(char))
      if (hasBlockedChars) {
        return {
          valid: false,
          error: `File name contains invalid characters: ${blockedChars.join(', ')}`,
          code: 'INVALID_FILENAME_CHARS'
        }
      }

      return { valid: true }
    }
  },

  // File content validator - check magic bytes
  magicBytes: (expectedSignatures: string[][]): FileValidator => {
    return async (file: File): Promise<ValidationResult> => {
      try {
        const header = await file.slice(0, 8).arrayBuffer()
        const bytes = new Uint8Array(header)
        const hexBytes = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'))

        const matches = expectedSignatures.some(sig =>
          sig.every((byte, i) => hexBytes[i]?.toLowerCase() === byte.toLowerCase())
        )

        if (!matches) {
          return {
            valid: false,
            error: `File signature does not match expected type`,
            code: 'MAGIC_BYTES_MISMATCH'
          }
        }

        return { valid: true }
      } catch {
        return {
          valid: false,
          error: 'Failed to read file header',
          code: 'MAGIC_BYTES_ERROR'
        }
      }
    }
  },

  // Virus scan placeholder - would integrate with actual scan service
  virusScan: (scanService?: (file: File) => Promise<{ clean: boolean; reason?: string }>): FileValidator => {
    return async (file: File): Promise<ValidationResult> => {
      if (!scanService) {
        // Placeholder - just check basic patterns
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

        if (suspiciousExtensions.includes(ext) && !file.type) {
          return {
            valid: false,
            error: `Potentially dangerous file type: ${ext}`,
            code: 'SUSPICIOUS_FILE_TYPE'
          }
        }

        return { valid: true }
      }

      try {
        const result = await scanService(file)
        if (!result.clean) {
          return {
            valid: false,
            error: result.reason || 'File failed virus scan',
            code: 'VIRUS_DETECTED'
          }
        }
        return { valid: true }
      } catch {
        return {
          valid: false,
          error: 'Virus scan failed',
          code: 'VIRUS_SCAN_ERROR'
        }
      }
    }
  },

  // Duplicate check within batch
  duplicate: (existingHashes: Set<string>): FileValidator => {
    return async (file: File): Promise<ValidationResult> => {
      const buffer = await file.slice(0, 64 * 1024).arrayBuffer()
      const hash = await crypto.subtle.digest('SHA-256', buffer)
      const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')

      if (existingHashes.has(hashHex)) {
        return {
          valid: false,
          error: `Duplicate file detected: ${file.name}`,
          code: 'DUPLICATE_FILE'
        }
      }

      existingHashes.add(hashHex)
      return { valid: true }
    }
  },

  // Resolution validator for images
  imageResolution: (minWidth: number, minHeight: number, maxWidth?: number, maxHeight?: number): FileValidator => {
    return (file: File): Promise<ValidationResult> => {
      return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
          resolve({ valid: true })
          return
        }

        const img = new Image()
        img.onload = () => {
          URL.revokeObjectURL(img.src)

          if (img.width < minWidth || img.height < minHeight) {
            resolve({
              valid: false,
              error: `Image resolution too small. Minimum: ${minWidth}x${minHeight}`,
              code: 'IMAGE_TOO_SMALL'
            })
            return
          }

          if (maxWidth && img.width > maxWidth) {
            resolve({
              valid: false,
              error: `Image width too large. Maximum: ${maxWidth}px`,
              code: 'IMAGE_TOO_WIDE'
            })
            return
          }

          if (maxHeight && img.height > maxHeight) {
            resolve({
              valid: false,
              error: `Image height too large. Maximum: ${maxHeight}px`,
              code: 'IMAGE_TOO_TALL'
            })
            return
          }

          resolve({ valid: true })
        }

        img.onerror = () => {
          resolve({
            valid: false,
            error: 'Failed to load image for resolution check',
            code: 'IMAGE_LOAD_ERROR'
          })
        }

        img.src = URL.createObjectURL(file)
      })
    }
  },

  // Duration validator for audio/video
  mediaDuration: (minSeconds?: number, maxSeconds?: number): FileValidator => {
    return (file: File): Promise<ValidationResult> => {
      return new Promise((resolve) => {
        const isAudio = file.type.startsWith('audio/')
        const isVideo = file.type.startsWith('video/')

        if (!isAudio && !isVideo) {
          resolve({ valid: true })
          return
        }

        const media = isVideo ? document.createElement('video') : document.createElement('audio')

        media.onloadedmetadata = () => {
          URL.revokeObjectURL(media.src)
          const duration = media.duration

          if (minSeconds && duration < minSeconds) {
            resolve({
              valid: false,
              error: `Media too short. Minimum duration: ${minSeconds}s`,
              code: 'MEDIA_TOO_SHORT'
            })
            return
          }

          if (maxSeconds && duration > maxSeconds) {
            resolve({
              valid: false,
              error: `Media too long. Maximum duration: ${maxSeconds}s`,
              code: 'MEDIA_TOO_LONG'
            })
            return
          }

          resolve({ valid: true })
        }

        media.onerror = () => {
          resolve({
            valid: false,
            error: 'Failed to load media for duration check',
            code: 'MEDIA_LOAD_ERROR'
          })
        }

        media.src = URL.createObjectURL(file)
      })
    }
  }
}

// Common magic bytes for file type validation
export const magicBytes = {
  JPEG: [['ff', 'd8', 'ff']],
  PNG: [['89', '50', '4e', '47']],
  GIF: [['47', '49', '46', '38']],
  PDF: [['25', '50', '44', '46']],
  ZIP: [['50', '4b', '03', '04']],
  MP3: [['49', '44', '33'], ['ff', 'fb'], ['ff', 'f3'], ['ff', 'f2']],
  MP4: [['00', '00', '00', '18', '66', '74', '79', '70'], ['00', '00', '00', '20', '66', '74', '79', '70']],
  WEBP: [['52', '49', '46', '46']]
}
