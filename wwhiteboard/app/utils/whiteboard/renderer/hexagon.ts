import type { ShapeHexagon } from '../../../../shared/types/whiteboard'

export function renderHexagon(ctx: CanvasRenderingContext2D, shape: ShapeHexagon) {
  const { x, y, w, h } = shape
  const size = w / 2

  ctx.beginPath()
  ctx.moveTo(x + size * Math.cos(0) + w / 2, y + size * Math.sin(0) + h / 2)

  for (let i = 1; i <= 6; i += 1) {
    ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / 6) + w / 2, y + size * Math.sin(i * 2 * Math.PI / 6) + h / 2)
  }

  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
