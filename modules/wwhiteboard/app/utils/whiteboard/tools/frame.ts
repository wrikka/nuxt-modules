import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'
import { rectFromPoints, screenToWorld } from '../geometry'

export const frame = {
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
      type: 'frame',
      ...r,
      name: 'Frame',
      children: [],
      stroke: '#000000',
      fill: '#ffffff',
      strokeWidth: 2,
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
