import type { ShapeStickyNote } from '../../../../shared/types/whiteboard'

export function renderStickyNote(ctx: CanvasRenderingContext2D, shape: ShapeStickyNote) {
  ctx.beginPath()
  ctx.rect(shape.x, shape.y, shape.w, shape.h)
  ctx.fill()
  ctx.stroke()

  // Render text
  ctx.fillStyle = shape.stroke // Use stroke color for text
  ctx.font = `${shape.fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(shape.text, shape.x + shape.w / 2, shape.y + shape.h / 2)
}
