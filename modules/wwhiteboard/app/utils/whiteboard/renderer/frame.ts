import type { ShapeFrame } from '../../../../shared/types/whiteboard'

export function renderFrame(ctx: CanvasRenderingContext2D, shape: ShapeFrame) {
  ctx.save()
  ctx.fillStyle = shape.fill ?? 'transparent'
  ctx.strokeStyle = shape.stroke
  ctx.lineWidth = shape.strokeWidth

  ctx.beginPath()
  ctx.rect(shape.x, shape.y, shape.w, shape.h)
  ctx.fill()
  ctx.stroke()

  // Draw the frame name
  ctx.fillStyle = '#666'
  ctx.font = '14px sans-serif'
  ctx.fillText(shape.name, shape.x + 8, shape.y + 20)

  ctx.restore()
}
