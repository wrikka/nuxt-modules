import type { Ref } from 'vue'

export interface ImageEditorState {
  canvas: HTMLCanvasElement | null
  ctx: CanvasRenderingContext2D | null
  originalImage: HTMLImageElement | null
  currentImage: HTMLImageElement | null
  scale: number
  rotation: number
  flipX: boolean
  flipY: boolean
  crop: CropRegion | null
  filters: ImageFilters
}

export interface CropRegion {
  x: number
  y: number
  width: number
  height: number
  aspectRatio?: number
}

export interface ImageFilters {
  grayscale: number
  sepia: number
  blur: number
  brightness: number
  contrast: number
  saturation: number
  hue: number
}

export interface HistoryEntry {
  imageData: ImageData
  filters: ImageFilters
  crop: CropRegion | null
  rotation: number
  flipX: boolean
  flipY: boolean
}

export interface ExportOptions {
  format?: 'png' | 'jpeg' | 'webp'
  quality?: number
  width?: number
  height?: number
}

export type FilterType = keyof ImageFilters
