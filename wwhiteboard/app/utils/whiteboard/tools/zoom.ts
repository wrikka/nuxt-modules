import type { Point, WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session } from '../tools'
import type { WhiteboardActions } from '../tools'

export const zoom = {
  onPointerDown(
    _state: WhiteboardState,
    _session: Session,
    screen: Point,
    _event: PointerEvent,
    actions: WhiteboardActions,
    _getGpuClient: () => unknown,
  ) {
    _session.phase = 'idle'
    const factor = _event.shiftKey ? 0.9 : 1.1
    actions.zoomAt(screen, factor)
  },
}
