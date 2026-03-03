export const isImageFile = (file: File) => {
  return file.type.startsWith('image/')
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i]
}

export const validateFile = (file: File, config: { maxFileSize: number; allowedTypes: string[] }): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > config.maxFileSize) {
    return { valid: false, error: `ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด ${formatFileSize(config.maxFileSize)})` }
  }

  // Check file type
  const isAllowedType = config.allowedTypes.some(type => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType + '/')
    }
    return file.type === type
  })

  if (!isAllowedType) {
    return { valid: false, error: `ประเภทไฟล์ ${file.type} ไม่ได้รับอนุญาต` }
  }

  return { valid: true }
}
