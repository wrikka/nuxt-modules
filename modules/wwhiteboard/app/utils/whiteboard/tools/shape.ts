import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'
import { rectFromPoints, screenToWorld } from '../geometry'

export const shape = {
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

    const r = rectFromPoints(startWorld, startWorld)
    actions.addShape({
      id,
      type: state.ui.tool as 'rectangle' | 'ellipse' | 'diamond' | 'triangle',
      ...r,
      stroke: state.ui.settings.stroke,
      fill: state.ui.settings.fill,
      strokeWidth: state.ui.settings.strokeWidth,
    })
    actions.clearSelection()
  },

  onPointerMove(
    state: WhiteboardState,
    session: Session,
    screen: import('../../../../shared/types/whiteboard').Point,
    _event: PointerEvent,
    actions: WhiteboardActions,
  ) {
    const { startWorld } = session
    const world = screenToWorld(screen, state.camera)
    const id = session.activeShapeId
    if (!id || !startWorld) return
    actions.updateRect(id, startWorld, world)
  },
}
