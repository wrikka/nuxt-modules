import type { ShapePencil } from '../../../../shared/types/whiteboard'

export function renderPencil(ctx: CanvasRenderingContext2D, shape: ShapePencil) {
  if (shape.points.length < 2) {
    // Draw a dot if only one point
    if (shape.points.length === 1) {
      const p = shape.points[0]!
      ctx.beginPath()
      ctx.fillStyle = shape.stroke
      const r = (p.pressure * shape.strokeWidth) / 2
      ctx.arc(p.x, p.y, r, 0, 2 * Math.PI)
      ctx.fill()
    }
    return
  }

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Draw line segments with varying width
  for (let i = 1; i < shape.points.length; i++) {
    const p0 = shape.points[i - 1]!
    const p1 = shape.points[i]!

    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    
    // Use the average pressure of the two points for a smoother transition
    const avgPressure = (p0.pressure + p1.pressure) / 2
    ctx.lineWidth = avgPressure * shape.strokeWidth * 2.5 // Multiply for a more noticeable effect
    
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()
  }
}
