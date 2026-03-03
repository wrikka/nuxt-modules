import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'

export const text = {
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
      type: 'text',
      x: startWorld.x,
      y: startWorld.y,
      text: 'Text',
      fontSize: state.ui.settings.fontSize,
      stroke: state.ui.settings.stroke,
      fill: null,
      strokeWidth: 1,
    })
    actions.selectOnly(id)
    session.phase = 'idle'
  },
}
