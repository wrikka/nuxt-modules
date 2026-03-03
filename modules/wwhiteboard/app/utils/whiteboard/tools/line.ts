import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'
import { screenToWorld } from '../geometry'

export const line = {
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
      type: state.ui.tool as 'line' | 'arrow',
      a: startWorld,
      b: startWorld,
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
    _event: PointerEvent,
    actions: WhiteboardActions,
  ) {
    const { startWorld } = session
    const world = screenToWorld(screen, state.camera)
    const id = session.activeShapeId
    if (!id || !startWorld) return
    actions.updateLineLike(id, startWorld, world)
  },
}
