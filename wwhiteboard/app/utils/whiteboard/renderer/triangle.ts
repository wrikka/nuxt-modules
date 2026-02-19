import type { ShapeTriangle } from '../../../../shared/types/whiteboard'

export function renderTriangle(ctx: CanvasRenderingContext2D, shape: ShapeTriangle) {
  const { x, y, w, h } = shape
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
