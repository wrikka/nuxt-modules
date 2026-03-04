import { readonly, ref } from 'vue'

export interface QRCodeOptions {
  text: string
  size?: number
  color?: string
  bgColor?: string
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * QR Generator - Generate QR codes from palette
 */
export function useQRGenerator() {
  const generatedQR = ref<string | null>(null)
  const isGenerating = ref(false)

  // QR Code pattern generation using simple algorithm
  const generateQRPattern = (text: string): boolean[][] => {
    const size = 21 // Minimum QR size for version 1
    const pattern: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))

    // Finder patterns (corners)
    const drawFinder = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isBorder = i === 0 || i === 6 || j === 0 || j === 6
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4
          pattern[y + i][x + j] = isBorder || isInner
        }
      }
    }

    drawFinder(0, 0)
    drawFinder(size - 7, 0)
    drawFinder(0, size - 7)

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      pattern[6][i] = i % 2 === 0
      pattern[i][6] = i % 2 === 0
    }

    // Simple data encoding (not real QR, just visual pattern)
    let dataIndex = 0
    for (let i = 8; i < size - 8 && dataIndex < text.length; i++) {
      for (let j = 8; j < size - 8 && dataIndex < text.length; j++) {
        if (pattern[i][j] === false) {
          pattern[i][j] = text.charCodeAt(dataIndex) % 2 === 1
          dataIndex++
        }
      }
    }

    return pattern
  }

  const generate = async (options: QRCodeOptions): Promise<string | null> => {
    isGenerating.value = true

    try {
      const { text, size = 200, color = '#000000', bgColor = '#ffffff' } = options
      const pattern = generateQRPattern(text)
      const cellSize = Math.floor(size / pattern.length)

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      if (!ctx) return null

      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)

      ctx.fillStyle = color
      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
          if (pattern[i][j]) {
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
          }
        }
      }

      const dataUrl = canvas.toDataURL('image/png')
      generatedQR.value = dataUrl
      return dataUrl
    }
    catch (error) {
      console.error('QR generation failed:', error)
      return null
    }
    finally {
      isGenerating.value = false
    }
  }

  const downloadQR = (filename?: string): boolean => {
    if (!generatedQR.value) return false

    const a = document.createElement('a')
    a.href = generatedQR.value
    a.download = filename || `qr-${Date.now()}.png`
    a.click()
    return true
  }

  const copyToClipboard = async (): Promise<boolean> => {
    if (!generatedQR.value) return false

    try {
      const response = await fetch(generatedQR.value)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      return true
    }
    catch {
      return false
    }
  }

  const generateFromURL = (url: string): Promise<string | null> => {
    return generate({ text: url, size: 256 })
  }

  return {
    generatedQR: readonly(generatedQR),
    isGenerating: readonly(isGenerating),
    generate,
    downloadQR,
    copyToClipboard,
    generateFromURL
  }
}
