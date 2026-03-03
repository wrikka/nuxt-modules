import type { ShapeStar } from '../../../../shared/types/whiteboard'

export function renderStar(ctx: CanvasRenderingContext2D, shape: ShapeStar) {
  const { x, y, w, h } = shape
  const spikes = 5
  const outerRadius = w / 2
  const innerRadius = w / 4
  let rot = Math.PI / 2 * 3
  let step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)

  for (let i = 0; i < spikes; i++) {
    let currentX = x + w / 2 + Math.cos(rot) * outerRadius
    let currentY = y + h / 2 + Math.sin(rot) * outerRadius
    ctx.lineTo(currentX, currentY)
    rot += step

    currentX = x + w / 2 + Math.cos(rot) * innerRadius
    currentY = y + h / 2 + Math.sin(rot) * innerRadius
    ctx.lineTo(currentX, currentY)
    rot += step
  }
  ctx.lineTo(x + w / 2, y)
  ctx.closePath()

  ctx.fill()
  ctx.stroke()
}
