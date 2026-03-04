import { readonly, ref } from 'vue'

export interface ColorFormat {
  hex: string
  rgb: string
  hsl: string
  hsv: string
}

/**
 * Color Picker - Quick color selection from palette
 */
export function useColorPicker() {
  const selectedColor = ref<string>('#3b82f6')
  const recentColors = ref<string[]>([])

  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ffffff', '#f3f4f6', '#9ca3af', '#4b5563',
    '#1f2937', '#111827', '#000000'
  ]

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const getFormats = (hex: string): ColorFormat | null => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    return {
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsl.h}, ${hsl.s}%, ${Math.round((rgb.r + rgb.g + rgb.b) / 3)})`
    }
  }

  const selectColor = (color: string) => {
    selectedColor.value = color
    if (!recentColors.value.includes(color)) {
      recentColors.value = [color, ...recentColors.value].slice(0, 10)
    }
  }

  const copyToClipboard = async (format: keyof ColorFormat): Promise<boolean> => {
    const formats = getFormats(selectedColor.value)
    if (!formats) return false

    try {
      await navigator.clipboard.writeText(formats[format])
      return true
    }
    catch {
      return false
    }
  }

  const generateShades = (hex: string, count: number = 5): string[] => {
    const rgb = hexToRgb(hex)
    if (!rgb) return []

    const shades: string[] = []
    for (let i = 0; i < count; i++) {
      const factor = (i + 1) / (count + 1)
      const r = Math.round(rgb.r * factor)
      const g = Math.round(rgb.g * factor)
      const b = Math.round(rgb.b * factor)
      shades.push(`#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`)
    }
    return shades
  }

  return {
    selectedColor: readonly(selectedColor),
    recentColors: readonly(recentColors),
    presetColors,
    getFormats,
    selectColor,
    copyToClipboard,
    generateShades
  }
}
