import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { getShapeBounds, hitTestTop, pointInRect, rectFromPoints, screenToWorld, hitTestTopFrame } from '../geometry'
import { getHandles, handleIds } from '../renderer/selection'

export const select = {
  onPointerDown(
    state: WhiteboardState,
    session: Session,
    screen: import('../../../../shared/types/whiteboard').Point,
    event: PointerEvent,
    actions: WhiteboardActions,
    _getGpuClient: () => unknown,
  ) {
    const { startWorld } = session
    if (!startWorld) return

    // Handle resizing first
    if (state.ui.selectedIds.length > 0) {
      for (const selectedId of state.ui.selectedIds) {
        const selectedShape = state.doc.shapes[selectedId]
        if (!selectedShape) continue
        const handles = getHandles(selectedShape)
        for (const id of handleIds) {
          if (pointInRect(startWorld, handles[id])) {
            session.activeHandleId = id
            session.activeShapeId = selectedId // Keep track of which shape's handle is being dragged
            return
          }
        }
      }
    }

    let hit = hitTestTop(state.doc, startWorld)
    if (hit) {
      const shape = state.doc.shapes[hit]
      if (shape?.parentId) {
        hit = shape.parentId
      }
    }
    if (hit && state.doc.shapes[hit]?.locked) {
      session.phase = 'idle'
      return
    }

    if (event.shiftKey) {
      if (hit) actions.toggleSelection(hit)
    } else {
      if (hit) {
        if (!state.ui.selectedIds.includes(hit)) {
          actions.selectOnly(hit)
        }
      } else {
        actions.clearSelection()
      }
    }
  },

  onPointerMove(
    state: WhiteboardState,
    session: Session,
    screen: import('../../../../shared/types/whiteboard').Point,
    event: PointerEvent,
    actions: WhiteboardActions,
  ) {
    const world = screenToWorld(screen, state.camera)
    const { startWorld, lastScreen } = session
    if (!startWorld) return

    // Handle resizing
    if (session.activeHandleId && session.activeShapeId) {
      const shape = state.doc.shapes[session.activeShapeId]
      if (shape && (shape.type === 'rectangle' || shape.type === 'ellipse' || shape.type === 'diamond' || shape.type === 'triangle' || shape.type === 'image')) {
        const handle = session.activeHandleId
        let { x, y, w, h } = shape

        if (handle.includes('Left')) {
          x = world.x
          w = shape.x + shape.w - world.x
        }
        if (handle.includes('Right')) {
          w = world.x - shape.x
        }
        if (handle.includes('Top')) {
          y = world.y
          h = shape.y + shape.h - world.y
        }
        if (handle.includes('Bottom')) {
          h = world.y - shape.y
        }

        if (w < 0) { [x, w] = [x + w, -w] }
        if (h < 0) { [y, h] = [y + h, -h] }

        actions.updateRect(session.activeShapeId, { x, y }, { x: x + w, y: y + h })
      }
    // Handle dragging selected shapes
    const isAnySelectedLocked = state.ui.selectedIds.some(id => state.doc.shapes[id]?.locked)
    if (isAnySelectedLocked) return

    } else if (state.ui.selectedIds.length > 0 && startWorld) {
      if (!lastScreen) return
      const dx = (event.clientX - lastScreen.x) / state.camera.zoom
      const dy = (event.clientY - lastScreen.y) / state.camera.zoom
      actions.moveSelectedShapesBy(dx, dy)
    // Handle marquee selection
    } else if (!session.activeHandleId && startWorld) {
      const marquee = rectFromPoints(startWorld, world)
      actions.setMarquee(marquee)
    }
  },

  onPointerUp(
    state: WhiteboardState,
    session: Session,
    actions: WhiteboardActions,
  ) {
    if (!session.activeHandleId && session.startWorld && session.lastScreen) {
      const marquee = state.ui.marquee
      if (marquee && (marquee.w > 5 || marquee.h > 5)) {
        const selectedIds = state.doc.order.filter((id) => {
          const shape = state.doc.shapes[id]
          if (!shape) return false
          const shapeBounds = getShapeBounds(shape)
          // AABB intersection
          return (
            shapeBounds.x < marquee.x + marquee.w &&
            shapeBounds.x + shapeBounds.w > marquee.x &&
            shapeBounds.y < marquee.y + marquee.h &&
            shapeBounds.y + shapeBounds.h > marquee.y
          )
        })
        actions.selectShapes(selectedIds)
      }
    }
    // Handle dropping shapes into frames
    if (session.startWorld && session.lastScreen && state.ui.selectedIds.length > 0 && !session.activeHandleId) {
      const world = screenToWorld(session.lastScreen, state.camera)
      const frameId = hitTestTopFrame(state.doc, world)

      for (const id of state.ui.selectedIds) {
        const shape = state.doc.shapes[id]
        // Don't allow dropping a frame into another frame, or a shape into its own frame
        if (shape && shape.type !== 'frame' && shape.parentId !== frameId) {
          actions.setShapeParent(id, frameId ?? undefined)
        }
      }
    }

    actions.setMarquee(null)
  },

  onDoubleClick(
    state: WhiteboardState,
    screen: import('../../../../shared/types/whiteboard').Point,
    actions: WhiteboardActions,
  ) {
    const world = screenToWorld(screen, state.camera)
    const hit = hitTestTop(state.doc, world)

    if (hit) {
      const shape = state.doc.shapes[hit]
      if (shape && (shape.type === 'sticky-note' || shape.type === 'text')) {
        actions.setEditingShapeId(hit)
      }
    }
  },
}
