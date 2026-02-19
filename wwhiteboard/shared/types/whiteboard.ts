export type Point = {
  x: number
  y: number
}

export type PointWithPressure = Point & {
  pressure: number
}

export type Rect = {
  x: number
  y: number
  w: number
  h: number
}

export type Camera = {
  x: number
  y: number
  zoom: number
}

export type ToolId =
  | 'select'
  | 'pan'
  | 'pencil'
  | 'line'
  | 'rectangle'
  | 'ellipse'
  | 'arrow'
  | 'text'
  | 'sticky-note'
  | 'eraser'
  | 'zoom'
  | 'diamond'
  | 'triangle'
  | 'image'
  | 'star'
  | 'hexagon'
  | 'comment'
  | 'connector'
  | 'frame'

export type ShapeId = string

export type ShapeBase = {
  id: ShapeId
  type: string
  stroke: string
  fill: string | null
  strokeWidth: number
  locked?: boolean
  parentId?: ShapeId
}

export type ShapePencil = ShapeBase & {
  type: 'pencil'
  points: PointWithPressure[]
}

export type ShapeLine = ShapeBase & {
  type: 'line'
  a: Point
  b: Point
}

export type ShapeRect = ShapeBase & {
  type: 'rectangle'
  x: number
  y: number
  w: number
  h: number
}

export type ShapeEllipse = ShapeBase & {
  type: 'ellipse'
  x: number
  y: number
  w: number
  h: number
}

export type ShapeArrow = ShapeBase & {
  type: 'arrow'
  a: Point
  b: Point
}

export type ShapeText = ShapeBase & {
  type: 'text'
  x: number
  y: number
  text: string
  fontSize: number
}

export type ShapeStickyNote = ShapeBase & {
  type: 'sticky-note'
  x: number
  y: number
  w: number
  h: number
  text: string
  fontSize: number
}

export type ShapeDiamond = ShapeBase & {
  type: 'diamond'
  x: number
  y: number
  w: number
  h: number
}

export type ShapeTriangle = ShapeBase & {
  type: 'triangle'
  x: number
  y: number
  w: number
  h: number
}

export type ShapeImage = ShapeBase & {
  type: 'image'
  src: string
  x: number
  y: number
  w: number
  h: number
}

export type ShapeStar = ShapeBase & {
  type: 'star'
  x: number
  y: number
  w: number
  h: number
}

export type ShapeHexagon = ShapeBase & {
  type: 'hexagon'
  x: number
  y: number
  w: number
  h: number
}

export type ShapeGroup = ShapeBase & {
  type: 'group'
  children: ShapeId[]
}

export type ShapeFrame = ShapeBase & {
  type: 'frame'
  x: number
  y: number
  w: number
  h: number
  name: string
  children: ShapeId[]
}

export type ShapeConnector = ShapeBase & {
  type: 'connector'
  startShapeId: ShapeId
  endShapeId: ShapeId
}

export type Shape =
  | ShapePencil
  | ShapeLine
  | ShapeRect
  | ShapeEllipse
  | ShapeArrow
  | ShapeText
  | ShapeStickyNote
  | ShapeDiamond
  | ShapeTriangle
  | ShapeImage
  | ShapeStar
  | ShapeHexagon
  | ShapeGroup
  | ShapeConnector
  | ShapeFrame

export type CommentId = string

export type Comment = {
  id: CommentId
  x: number
  y: number
  text: string
  author: string // For simplicity, just a name for now
  timestamp: number
}

export type WhiteboardDoc = {
  shapes: Record<ShapeId, Shape>
  comments: Record<CommentId, Comment>
  order: ShapeId[]
}

export type WhiteboardUi = {
  tool: ToolId
  selectedIds: ShapeId[]
  marquee: Rect | null
  editingShapeId: ShapeId | null
  presentationMode: boolean
  settings: UiSettings
}

export type UiSettings = {
  stroke: string
  fill: string | null
  strokeWidth: number
  fontSize: number
  background: string
  showGrid: boolean
}

export type RemoteCursor = {
  id: string
  x: number
  y: number
  name: string
  color: string
}

export type WhiteboardState = {
  doc: WhiteboardDoc
  ui: WhiteboardUi
  camera: Camera
  cursors: Record<string, RemoteCursor>
}
