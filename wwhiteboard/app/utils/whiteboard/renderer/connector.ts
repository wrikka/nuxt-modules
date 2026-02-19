import type { ShapeConnector, WhiteboardDoc } from '../../../../shared/types/whiteboard'
import { getShapeBounds } from '../geometry'

export function renderConnector(ctx: CanvasRenderingContext2D, shape: ShapeConnector, doc: WhiteboardDoc) {
  const startShape = doc.shapes[shape.startShapeId]
  const endShape = doc.shapes[shape.endShapeId]

  if (!startShape || !endShape) return

  const startBounds = getShapeBounds(startShape)
  const endBounds = getShapeBounds(endShape)

  const startCenter = {
    x: startBounds.x + startBounds.w / 2,
    y: startBounds.y + startBounds.h / 2,
  }

  const endCenter = {
    x: endBounds.x + endBounds.w / 2,
    y: endBounds.y + endBounds.h / 2,
  }

  ctx.beginPath()
  ctx.moveTo(startCenter.x, startCenter.y)
  ctx.lineTo(endCenter.x, endCenter.y)
  ctx.stroke()
}
