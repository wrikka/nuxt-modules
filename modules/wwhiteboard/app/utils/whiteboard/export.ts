import type { WhiteboardDoc } from '../../../shared/types/whiteboard'
import { getDocBounds } from './geometry'
import { render } from './renderer'

export const exportToPng = (doc: WhiteboardDoc, title: string) => {
  const bounds = getDocBounds(doc)
  if (!bounds) {
    alert('Cannot export an empty board.')
    return
  }

  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  const cssW = Math.round(bounds.w)
  const cssH = Math.round(bounds.h)
  canvas.width = cssW * dpr
  canvas.height = cssH * dpr

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    alert('Could not create canvas context for export.')
    return
  }

  const camera = {
    x: -bounds.x * dpr,
    y: -bounds.y * dpr,
    zoom: 1 * dpr,
  }

  render(
    ctx,
    doc,
    camera,
    {
      background: '#ffffff',
      showGrid: false,
    },
    [],
    null,
  )

  const dataUrl = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${title.replace(/\s+/g, '-')}.png`
  a.click()
}
