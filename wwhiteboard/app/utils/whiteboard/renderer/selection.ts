import type { Shape } from '../../../../shared/types/whiteboard'

function getBounds(shape: Shape): { x: number; y: number; w: number; h: number } {
  switch (shape.type) {
    case 'rectangle':
    case 'ellipse':
      return { x: shape.x, y: shape.y, w: shape.w, h: shape.h }
    case 'line':
    case 'arrow': {
      const x1 = Math.min(shape.a.x, shape.b.x)
      const y1 = Math.min(shape.a.y, shape.b.y)
      const x2 = Math.max(shape.a.x, shape.b.x)
      const y2 = Math.max(shape.a.y, shape.b.y)
      return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
    }
    case 'pencil': {
      let minX = Number.POSITIVE_INFINITY
      let minY = Number.POSITIVE_INFINITY
      let maxX = Number.NEGATIVE_INFINITY
      let maxY = Number.NEGATIVE_INFINITY
      for (const p of shape.points) {
        minX = Math.min(minX, p.x)
        minY = Math.min(minY, p.y)
        maxX = Math.max(maxX, p.x)
        maxY = Math.max(maxY, p.y)
      }
      if (!Number.isFinite(minX)) return { x: 0, y: 0, w: 0, h: 0 }
      return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
    }
    case 'text': {
      return { x: shape.x, y: shape.y - shape.fontSize, w: shape.text.length * (shape.fontSize * 0.6), h: shape.fontSize * 1.2 }
    }
  }
  return { x: 0, y: 0, w: 0, h: 0 }
}

const HANDLE_SIZE = 8

export const handleIds = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'top',
  'bottom',
  'left',
  'right',
] as const

export type HandleId = (typeof handleIds)[number]

export function getHandles(shape: Shape) {
  const bb = getBounds(shape)
  const { x, y, w, h } = bb
  return {
    topLeft: { x: x - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    topRight: { x: x + w - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    bottomLeft: { x: x - HANDLE_SIZE / 2, y: y + h - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    bottomRight: { x: x + w - HANDLE_SIZE / 2, y: y + h - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    top: { x: x + w / 2 - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    bottom: { x: x + w / 2 - HANDLE_SIZE / 2, y: y + h - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    left: { x: x - HANDLE_SIZE / 2, y: y + h / 2 - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
    right: { x: x + w - HANDLE_SIZE / 2, y: y + h / 2 - HANDLE_SIZE / 2, w: HANDLE_SIZE, h: HANDLE_SIZE },
  }
}

export function renderSelection(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.save()
  const bb = getBounds(shape)

  // Draw selection box
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(59,130,246,0.9)'
  ctx.setLineDash([6, 4])
  ctx.strokeRect(bb.x, bb.y, bb.w, bb.h)

  // Draw handles
  ctx.setLineDash([])
  ctx.fillStyle = 'rgba(59,130,246,0.9)'
  const handles = getHandles(shape)
  for (const handle of Object.values(handles)) {
    ctx.fillRect(handle.x, handle.y, handle.w, handle.h)
  }

  ctx.restore()
}
