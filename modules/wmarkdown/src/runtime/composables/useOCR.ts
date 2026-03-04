import { ref } from 'vue'

interface OCROptions {
  language?: string
  confidenceThreshold?: number
}

interface OCRResult {
  text: string
  confidence: number
  blocks: Array<{
    text: string
    bbox: number[]
    confidence: number
  }>
}

interface OCRState {
  isProcessing: boolean
  progress: number
  result: OCRResult | null
  error: string | null
}

export function useOCR(options: OCROptions = {}) {
  const state = ref<OCRState>({
    isProcessing: false,
    progress: 0,
    result: null,
    error: null
  })

  const isSupported = ref('createImageBitmap' in window)

  const processImage = async (file: File | Blob): Promise<OCRResult | null> => {
    state.value.isProcessing = true
    state.value.progress = 0
    state.value.result = null
    state.value.error = null

    try {
      // Try to use Tesseract.js if available
      const Tesseract = await import('tesseract.js').catch(() => null)

      if (Tesseract) {
        const result = await Tesseract.recognize(
          file,
          options.language || 'eng',
          {
            logger: (m: { status: string; progress: number }) => {
              if (m.status === 'recognizing text') {
                state.value.progress = m.progress * 100
              }
            }
          }
        )

        const ocrResult: OCRResult = {
          text: result.data.text,
          confidence: result.data.confidence,
          blocks: result.data.words?.map((w: { text: string; bbox: { x0: number; y0: number; x1: number; y1: number }; confidence: number }) => ({
            text: w.text,
            bbox: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1],
            confidence: w.confidence
          })) || []
        }

        state.value.result = ocrResult
        state.value.isProcessing = false
        return ocrResult
      }

      // Fallback: try browser's experimental API or basic processing
      throw new Error('OCR library not available. Please install tesseract.js')
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'OCR failed'
      state.value.isProcessing = false
      return null
    }
  }

  const processImageUrl = async (url: string): Promise<OCRResult | null> => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return processImage(blob)
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to load image'
      return null
    }
  }

  const extractTextFromCanvas = (canvas: HTMLCanvasElement): string => {
    // Basic text extraction from canvas (very limited)
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // This is a placeholder - real OCR would need a library
    return 'Canvas OCR not implemented. Use processImage() with an OCR library.'
  }

  const cleanup = () => {
    state.value.isProcessing = false
    state.value.progress = 0
    state.value.result = null
    state.value.error = null
  }

  const getMarkdownFromResult = (result?: OCRResult): string => {
    const r = result || state.value.result
    if (!r) return ''

    return `<!-- OCR Result (confidence: ${Math.round(r.confidence)}%) -->\n\n${r.text}`
  }

  return {
    state,
    isSupported,
    processImage,
    processImageUrl,
    extractTextFromCanvas,
    cleanup,
    getMarkdownFromResult
  }
}
