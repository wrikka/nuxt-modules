import type { WhiteboardState, ShapeId, Point, Rect } from '../../../shared/types/whiteboard'

export function defineCameraActions(state: WhiteboardState) {
  const panBy = (dx: number, dy: number) => {
    state.camera.x += dx
    state.camera.y += dy
  }

  const zoomAt = (screen: Point, delta: number) => {
    const prev = state.camera.zoom
    const next = Math.max(0.2, Math.min(4, prev * delta))
    const scale = next / prev
    state.camera.x = screen.x - (screen.x - state.camera.x) * scale
    state.camera.y = screen.y - (screen.y - state.camera.y) * scale
    state.camera.zoom = next
  }

  const clearSelection = () => {
    state.ui.selectedIds = []
  }

  const selectOnly = (id: ShapeId | null) => {
    state.ui.selectedIds = id ? [id] : []
  }

  const toggleSelection = (id: ShapeId) => {
    const index = state.ui.selectedIds.indexOf(id)
    if (index > -1) {
      state.ui.selectedIds.splice(index, 1)
    } else {
      state.ui.selectedIds.push(id)
    }
  }

  const selectShapes = (ids: ShapeId[]) => {
    state.ui.selectedIds = ids
  }

  const setMarquee = (rect: Rect | null) => {
    state.ui.marquee = rect
  }

  const setEditingShapeId = (id: ShapeId | null) => {
    state.ui.editingShapeId = id
  }

  return {
    panBy,
    zoomAt,
    clearSelection,
    selectOnly,
    toggleSelection,
    selectShapes,
    setMarquee,
    setEditingShapeId,
  }
}
