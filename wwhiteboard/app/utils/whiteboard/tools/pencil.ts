import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'
import { screenToWorld } from '../geometry'

export const pencil = {
  onPointerDown(
    state: WhiteboardState,
    session: Session,
    _screen: import('../../../../shared/types/whiteboard').Point,
    _event: PointerEvent,
    actions: WhiteboardActions,
    _getGpuClient: () => unknown,
  ) {
    const { startWorld } = session
    if (!startWorld) return

    const id = createId()
    session.activeShapeId = id

    actions.addShape({
      id,
      type: 'pencil',
      points: [{ ...startWorld, pressure: _event.pressure > 0 ? _event.pressure : 0.5 }],
      stroke: state.ui.settings.stroke,
      fill: null,
      strokeWidth: state.ui.settings.strokeWidth,
    })
    actions.clearSelection()
  },

  onPointerMove(
    state: WhiteboardState,
    session: Session,
    screen: import('../../../../shared/types/whiteboard').Point,
    event: PointerEvent,
    _actions: WhiteboardActions,
  ) {
    const world = screenToWorld(screen, state.camera)
    const id = session.activeShapeId
    if (!id) return
    const shape = state.doc.shapes[id]
    if (!shape || shape.type !== 'pencil') return
    shape.points.push({ ...world, pressure: event.pressure > 0 ? event.pressure : 0.5 })
  },
}
