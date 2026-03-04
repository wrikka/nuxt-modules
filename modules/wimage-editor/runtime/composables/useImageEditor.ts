import type { ImageEditorState, ImageFilters, CropRegion, ExportOptions, HistoryEntry } from '../types'

const defaultFilters: ImageFilters = {
  grayscale: 0,
  sepia: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0
}

export function useImageEditor() {
  const config = useRuntimeConfig().public.wimageEditor

  const state = reactive<ImageEditorState>({
    canvas: null,
    ctx: null,
    originalImage: null,
    currentImage: null,
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    crop: null,
    filters: { ...defaultFilters }
  })

  const history = ref<HistoryEntry[]>([])
  const historyIndex = ref(-1)

  const initCanvas = (canvas: HTMLCanvasElement, width = config.defaultCanvasWidth, height = config.defaultCanvasHeight) => {
    state.canvas = canvas
    canvas.width = width
    canvas.height = height
    state.ctx = canvas.getContext('2d')
  }

  const loadImage = async (src: string | File): Promise<void> => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    if (src instanceof File) {
      img.src = URL.createObjectURL(src)
    } else {
      img.src = src
    }

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
    })

    state.originalImage = img
    state.currentImage = img
    state.rotation = 0
    state.flipX = false
    state.flipY = false
    state.crop = null
    state.filters = { ...defaultFilters }

    if (state.canvas && state.ctx) {
      fitImageToCanvas()
      render()
      saveToHistory()
    }
  }

  const fitImageToCanvas = () => {
    if (!state.canvas || !state.originalImage) return

    const canvasRatio = state.canvas.width / state.canvas.height
    const imageRatio = state.originalImage.width / state.originalImage.height

    let drawWidth: number
    let drawHeight: number

    if (imageRatio > canvasRatio) {
      drawWidth = state.canvas.width
      drawHeight = state.canvas.width / imageRatio
    } else {
      drawHeight = state.canvas.height
      drawWidth = state.canvas.height * imageRatio
    }

    state.scale = drawWidth / state.originalImage.width
  }

  const render = () => {
    if (!state.ctx || !state.canvas || !state.currentImage) return

    const ctx = state.ctx
    const canvas = state.canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    // Apply filters
    const filterString = buildFilterString(state.filters)
    ctx.filter = filterString

    // Calculate transform
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    ctx.translate(centerX, centerY)
    ctx.rotate((state.rotation * Math.PI) / 180)
    ctx.scale(state.flipX ? -1 : 1, state.flipY ? -1 : 1)

    // Draw image
    const drawWidth = state.currentImage.width * state.scale
    const drawHeight = state.currentImage.height * state.scale

    ctx.drawImage(
      state.currentImage,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    )

    ctx.restore()

    // Apply crop if exists
    if (state.crop) {
      applyCropOverlay()
    }
  }

  const buildFilterString = (filters: ImageFilters): string => {
    const parts: string[] = []

    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`)
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`)
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`)
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`)
    if (filters.saturation !== 100) parts.push(`saturate(${filters.saturation}%)`)
    if (filters.hue !== 0) parts.push(`hue-rotate(${filters.hue}deg)`)

    return parts.join(' ') || 'none'
  }

  const applyCropOverlay = () => {
    if (!state.ctx || !state.canvas || !state.crop) return

    const ctx = state.ctx
    const { x, y, width, height } = state.crop

    // Darken outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height)

    // Clear crop area
    ctx.clearRect(x, y, width, height)

    // Draw crop border
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)
  }

  const setFilter = (type: keyof ImageFilters, value: number) => {
    state.filters[type] = value
    render()
  }

  const resetFilters = () => {
    state.filters = { ...defaultFilters }
    render()
  }

  const rotate = (degrees: number) => {
    state.rotation = (state.rotation + degrees) % 360
    render()
  }

  const flip = (axis: 'x' | 'y') => {
    if (axis === 'x') state.flipX = !state.flipX
    if (axis === 'y') state.flipY = !state.flipY
    render()
  }

  const setCrop = (crop: CropRegion | null) => {
    state.crop = crop
    render()
  }

  const applyCrop = () => {
    if (!state.crop || !state.canvas || !state.ctx) return

    const { x, y, width, height } = state.crop
    const imageData = state.ctx.getImageData(x, y, width, height)

    // Create new canvas with cropped size
    const newCanvas = document.createElement('canvas')
    newCanvas.width = width
    newCanvas.height = height
    const newCtx = newCanvas.getContext('2d')!
    newCtx.putImageData(imageData, 0, 0)

    // Update main canvas
    state.canvas.width = width
    state.canvas.height = height
    state.ctx.clearRect(0, 0, width, height)
    state.ctx.drawImage(newCanvas, 0, 0)

    state.crop = null
    saveToHistory()
  }

  const saveToHistory = () => {
    if (!config.enableHistory || !state.canvas || !state.ctx) return

    const entry: HistoryEntry = {
      imageData: state.ctx.getImageData(0, 0, state.canvas.width, state.canvas.height),
      filters: { ...state.filters },
      crop: state.crop ? { ...state.crop } : null,
      rotation: state.rotation,
      flipX: state.flipX,
      flipY: state.flipY
    }

    // Remove future history if we're not at the end
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(entry)

    // Limit history size
    if (history.value.length > config.maxHistorySize) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  const undo = () => {
    if (historyIndex.value <= 0 || !state.ctx || !state.canvas) return

    historyIndex.value--
    restoreFromHistory(history.value[historyIndex.value])
  }

  const redo = () => {
    if (historyIndex.value >= history.value.length - 1 || !state.ctx || !state.canvas) return

    historyIndex.value++
    restoreFromHistory(history.value[historyIndex.value])
  }

  const restoreFromHistory = (entry: HistoryEntry) => {
    if (!state.ctx || !state.canvas) return

    state.canvas.width = entry.imageData.width
    state.canvas.height = entry.imageData.height
    state.ctx.putImageData(entry.imageData, 0, 0)
    state.filters = { ...entry.filters }
    state.crop = entry.crop ? { ...entry.crop } : null
    state.rotation = entry.rotation
    state.flipX = entry.flipX
    state.flipY = entry.flipY
  }

  const exportImage = (options: ExportOptions = {}): string => {
    if (!state.canvas) return ''

    const format = options.format || config.defaultExportFormat || 'png'
    const quality = options.quality || config.defaultExportQuality || 0.92

    return state.canvas.toDataURL(`image/${format}`, quality)
  }

  const exportBlob = async (options: ExportOptions = {}): Promise<Blob | null> => {
    if (!state.canvas) return null

    const format = options.format || config.defaultExportFormat || 'png'
    const quality = options.quality || config.defaultExportQuality || 0.92

    return new Promise((resolve) => {
      state.canvas!.toBlob((blob) => resolve(blob), `image/${format}`, quality)
    })
  }

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  return {
    state: readonly(state),
    history: readonly(history),
    historyIndex: readonly(historyIndex),
    canUndo,
    canRedo,
    initCanvas,
    loadImage,
    render,
    setFilter,
    resetFilters,
    rotate,
    flip,
    setCrop,
    applyCrop,
    undo,
    redo,
    exportImage,
    exportBlob,
    saveToHistory
  }
}
