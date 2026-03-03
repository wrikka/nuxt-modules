import type { Camera, Point, Shape, ShapeId } from '../../../shared/types/whiteboard'

export function screenToWorld(p: Point, camera: Camera): Point {
  return {
    x: (p.x - camera.x) / camera.zoom,
    y: (p.y - camera.y) / camera.zoom,
  }
}

export function worldToScreen(p: Point, camera: Camera): Point {
  return {
    x: p.x * camera.zoom + camera.x,
    y: p.y * camera.zoom + camera.y,
  }
}

export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function rectFromPoints(a: Point, b: Point): { x: number; y: number; w: number; h: number } {
  const x1 = Math.min(a.x, b.x)
  const y1 = Math.min(a.y, b.y)
  const x2 = Math.max(a.x, b.x)
  const y2 = Math.max(a.y, b.y)
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}

export function pointInRect(p: Point, r: { x: number; y: number; w: number; h: number }): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
}

export function hitTestShape(shape: Shape, p: Point, tolerance = 6): boolean {
  switch (shape.type) {
    case 'sticky-note':
    case 'rectangle':
    case 'diamond':
    case 'triangle':
    case 'image':
    case 'star':
    case 'hexagon': {
      const expanded = {
        x: shape.x - tolerance,
        y: shape.y - tolerance,
        w: shape.w + tolerance * 2,
        h: shape.h + tolerance * 2,
      }
      return pointInRect(p, expanded)
    }
    case 'ellipse': {
      const cx = shape.x + shape.w / 2
      const cy = shape.y + shape.h / 2
      const rx = Math.max(1, Math.abs(shape.w) / 2)
      const ry = Math.max(1, Math.abs(shape.h) / 2)
      const nx = (p.x - cx) / rx
      const ny = (p.y - cy) / ry
      return nx * nx + ny * ny <= 1 + tolerance / 100
    }
    case 'line':
    case 'arrow': {
      return distancePointToSegment(p, shape.a, shape.b) <= tolerance
    }
    case 'pencil': {
      for (let i = 1; i < shape.points.length; i++) {
        if (distancePointToSegment(p, shape.points[i - 1]!, shape.points[i]!) <= tolerance) return true
      }
      return false
    }
    case 'text': {
      const r = { x: shape.x, y: shape.y - shape.fontSize, w: shape.text.length * (shape.fontSize * 0.6), h: shape.fontSize * 1.2 }
      const expanded = {
        x: r.x - tolerance,
        y: r.y - tolerance,
        w: r.w + tolerance * 2,
        h: r.h + tolerance * 2,
      }
      return pointInRect(p, expanded)
    }
  }
  return false
}

export function hitTestTop(doc: { order: ShapeId[]; shapes: Record<ShapeId, Shape> }, p: Point): ShapeId | null {
  for (let i = doc.order.length - 1; i >= 0; i--) {
    const id = doc.order[i]!
    const shape = doc.shapes[id]
    if (!shape) continue
    if (hitTestShape(shape, p)) return id
  }
  return null
}

export function hitTestTopFrame(doc: { order: ShapeId[]; shapes: Record<ShapeId, Shape> }, p: Point): ShapeId | null {
  for (let i = doc.order.length - 1; i >= 0; i--) {
    const id = doc.order[i]!
    const shape = doc.shapes[id]
    if (!shape || shape.type !== 'frame') continue
    if (hitTestShape(shape, p)) return id
  }
  return null
}

export const getShapeBounds = (shape: Shape): { x: number; y: number; w: number; h: number } => {
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
    case 'text':
      return { x: shape.x, y: shape.y - shape.fontSize, w: shape.text.length * (shape.fontSize * 0.6), h: shape.fontSize * 1.2 }
    case 'sticky-note':
      return { x: shape.x, y: shape.y, w: shape.w, h: shape.h }
  }

  return { x: 0, y: 0, w: 0, h: 0 }
}

export const getDocBounds = (doc: { order: ShapeId[]; shapes: Record<ShapeId, Shape> }) => {
  if (doc.order.length === 0) return null
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const id of doc.order) {
    const s = doc.shapes[id]
    if (!s) continue
    const b = getShapeBounds(s)
    minX = Math.min(minX, b.x)
    minY = Math.min(minY, b.y)
    maxX = Math.max(maxX, b.x + b.w)
    maxY = Math.max(maxY, b.y + b.h)
  }

  if (!Number.isFinite(minX)) return null
  const pad = 80
  return {
    x: minX - pad,
    y: minY - pad,
    w: (maxX - minX) + pad * 2,
    h: (maxY - minY) + pad * 2,
  }
}

export function distancePointToSegment(p: Point, a: Point, b: Point): number {
  const vx = b.x - a.x
  const vy = b.y - a.y
  const wx = p.x - a.x
  const wy = p.y - a.y
  const c1 = vx * wx + vy * wy
  if (c1 <= 0) return distance(p, a)
  const c2 = vx * vx + vy * vy
  if (c2 <= c1) return distance(p, b)
  const t = c1 / c2
  return distance(p, { x: a.x + t * vx, y: a.y + t * vy })
}
