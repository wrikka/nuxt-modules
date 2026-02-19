import type { Camera, Shape, WhiteboardDoc, Rect } from '../../../shared/types/whiteboard'
import { renderGrid } from './renderer/grid'
import { renderPencil } from './renderer/pencil'
import { renderRectangle } from './renderer/rectangle'
import { renderEllipse } from './renderer/ellipse'
import { renderLine } from './renderer/line'
import { renderArrow } from './renderer/arrow'
import { renderText } from './renderer/text'
import { renderStickyNote } from './renderer/stickyNote'
import { renderDiamond } from './renderer/diamond'
import { renderTriangle } from './renderer/triangle'
import { renderStar } from './renderer/star'
import { renderHexagon } from './renderer/hexagon'
import { renderImage } from './renderer/image'
import { renderFrame } from './renderer/frame'
import { renderConnector } from './renderer/connector'
import { renderSelection } from './renderer/selection'

export type RenderOptions = {
  background: string
  showGrid: boolean
}

export function render(ctx: CanvasRenderingContext2D, doc: WhiteboardDoc, camera: Camera, options: RenderOptions, selected: string[], marquee: Rect | null) {
  const dpr = globalThis.devicePixelRatio || 1
  const { width, height } = ctx.canvas
  const cssWidth = width / dpr
  const cssHeight = height / dpr
  ctx.save()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssWidth, cssHeight)
  ctx.fillStyle = options.background
  ctx.fillRect(0, 0, cssWidth, cssHeight)

  ctx.translate(camera.x, camera.y)
  ctx.scale(camera.zoom, camera.zoom)

  if (options.showGrid) {
    renderGrid(ctx, camera, cssWidth, cssHeight)
  }

  for (const id of doc.order) {
    const shape = doc.shapes[id]
    if (!shape) continue
    drawShape(ctx, doc, shape, selected.includes(id))
  }

  if (marquee) {
    ctx.save()
    ctx.fillStyle = 'rgba(0, 100, 255, 0.1)'
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)'
    ctx.lineWidth = 1 / camera.zoom
    ctx.beginPath()
    ctx.rect(marquee.x, marquee.y, marquee.w, marquee.h)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  ctx.restore()
}

function drawShape(ctx: CanvasRenderingContext2D, doc: WhiteboardDoc, shape: Shape, isSelected: boolean) {
  ctx.save()
  ctx.lineWidth = shape.strokeWidth
  ctx.strokeStyle = shape.stroke
  ctx.fillStyle = shape.fill ?? 'transparent'

  switch (shape.type) {
    case 'pencil':
      renderPencil(ctx, shape)
      break
    case 'rectangle':
      renderRectangle(ctx, shape)
      break
    case 'ellipse':
      renderEllipse(ctx, shape)
      break
    case 'line':
      renderLine(ctx, shape)
      break
    case 'arrow':
      renderArrow(ctx, shape)
      break
    case 'text':
      renderText(ctx, shape)
      break
    case 'sticky-note':
      renderStickyNote(ctx, shape)
      break
    case 'diamond':
      renderDiamond(ctx, shape)
      break
    case 'triangle':
      renderTriangle(ctx, shape)
      break
    case 'star':
      renderStar(ctx, shape)
      break
    case 'hexagon':
      renderHexagon(ctx, shape)
      break
    case 'image':
      renderImage(ctx, shape)
      break
    case 'frame':
      renderFrame(ctx, shape)
      break
    case 'connector':
      renderConnector(ctx, shape, doc)
      break
  }

  if (isSelected) {
    renderSelection(ctx, shape)
  }

  ctx.restore()
}

