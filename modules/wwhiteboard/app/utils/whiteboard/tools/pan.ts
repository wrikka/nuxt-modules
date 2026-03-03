import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import type { Point } from '../../../../shared/types/whiteboard'

export const pan = {
  onPointerDown(
    _state: WhiteboardState,
    session: Session,
    _screen: Point,
    _event: PointerEvent,
    _actions: WhiteboardActions,
    _getGpuClient: () => unknown,
  ) {
    const { lastScreen } = session
    if (!lastScreen) return
    _actions.panBy(_screen.x - lastScreen.x, _screen.y - lastScreen.y)
  },
  onPointerMove(
    _state: WhiteboardState,
    session: Session,
    screen: Point,
    event: PointerEvent,
    actions: WhiteboardActions,
  ) {
    const { lastScreen } = session
    if (!lastScreen) return
    actions.panBy(screen.x - lastScreen.x, screen.y - lastScreen.y)
  },
}
