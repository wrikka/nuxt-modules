import type { ShapeDiamond } from '../../../../shared/types/whiteboard'

export function renderDiamond(ctx: CanvasRenderingContext2D, shape: ShapeDiamond) {
  const { x, y, w, h } = shape
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w, y + h / 2)
  ctx.lineTo(x + w / 2, y + h)
  ctx.lineTo(x, y + h / 2)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
