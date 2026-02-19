import type { GpuClient } from '~/composables/core/whiteboardRuntime'
import type { Point, ShapeId, WhiteboardState, Shape } from '../../../shared/types/whiteboard'
import { screenToWorld } from './geometry'
import type { HandleId } from './renderer/selection'
import { tools } from './tools/index'

export function createId(): ShapeId {
  return crypto.randomUUID()
}

type WhiteboardActions = {
  addShape: (shape: Shape) => void
  clearSelection: () => void
  panBy: (dx: number, dy: number) => void
  moveSelectedShapesBy: (dx: number, dy: number) => void
  removeShape: (id: ShapeId) => void
  selectOnly: (id: ShapeId | null) => void
  toggleSelection: (id: ShapeId) => void
  selectShapes: (ids: ShapeId[]) => void
  setMarquee: (rect: import('../../../shared/types/whiteboard').Rect | null) => void
  setEditingShapeId: (id: ShapeId | null) => void
  updateLineLike: (id: ShapeId, a: Point, b: Point) => void
  updateRect: (id: ShapeId, a: Point, b: Point) => void
  zoomAt: (screen: Point, delta: number) => void
  addComment: (x: number, y: number, text: string) => void
  setTool: (tool: import('../../../shared/types/whiteboard').ToolId) => void
  setShapeParent: (shapeId: ShapeId, parentId: ShapeId | undefined) => void
}

export type { WhiteboardActions }

type PointerPhase = 'idle' | 'dragging'

export type Session = {
  phase: PointerPhase
  startScreen: Point | null
  startWorld: Point | null
  lastScreen: Point | null
  activeShapeId: ShapeId | null
  activeHandleId: HandleId | null
}

export function createSession(): Session {
  return {
    phase: 'idle',
    startScreen: null,
    startWorld: null,
    lastScreen: null,
    activeShapeId: null,
    activeHandleId: null,
  }
}

export function onPointerDown(state: WhiteboardState, session: Session, screen: Point, event: PointerEvent, actions: WhiteboardActions, getGpuClient: () => GpuClient | null) {
  session.phase = 'dragging'
  session.startScreen = screen
  session.lastScreen = screen
  session.startWorld = screenToWorld(screen, state.camera)

  const toolImpl = tools[state.ui.tool as keyof typeof tools]
  if (toolImpl && 'onPointerDown' in toolImpl) {
    toolImpl.onPointerDown(state, session, screen, event, actions, getGpuClient)
  }
}

export function onPointerMove(state: WhiteboardState, session: Session, screen: Point, event: PointerEvent, actions: WhiteboardActions) {
  if (session.phase !== 'dragging') return
  session.lastScreen = screen

  const toolImpl = tools[state.ui.tool as keyof typeof tools]
  if (toolImpl && 'onPointerMove' in toolImpl) {
    toolImpl.onPointerMove(state, session, screen, event, actions)
  }
}

export function onPointerUp(state: WhiteboardState, session: Session, actions: WhiteboardActions) {
  const tool = tools[state.ui.tool as keyof typeof tools]
  if (tool && 'onPointerUp' in tool) {
    tool.onPointerUp(state, session, actions)
  }

  session.phase = 'idle'
  session.startScreen = null
  session.startWorld = null
  session.lastScreen = null
  session.activeShapeId = null
  session.activeHandleId = null
}

export function onDoubleClick(state: WhiteboardState, screen: Point, actions: WhiteboardActions) {
  const tool = tools[state.ui.tool as keyof typeof tools]
  if (tool && 'onDoubleClick' in tool) {
    tool.onDoubleClick(state, screen, actions)
  }
}

export function onWheel(state: WhiteboardState, event: WheelEvent, screen: Point, actions: WhiteboardActions) {
  if (event.ctrlKey) {
    const delta = event.deltaY < 0 ? 1.08 : 0.92
    actions.zoomAt(screen, delta)
  } else {
    actions.panBy(-event.deltaX, -event.deltaY)
  }
}
