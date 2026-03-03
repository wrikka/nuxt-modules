import type { Point, WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { hitTestTop } from '../geometry'

export const eraser = {
  onPointerDown(
    state: WhiteboardState,
    session: Session,
    _screen: Point,
    _event: PointerEvent,
    actions: WhiteboardActions,
    _getGpuClient: () => unknown,
  ) {
    const { startWorld } = session
    if (!startWorld) return
    const hit = hitTestTop(state.doc, startWorld)
    if (hit) actions.removeShape(hit)
    session.phase = 'idle'
  },
}
