import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'
import { hitTestTop } from '../geometry'

export const connector = {
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

    const hit = hitTestTop(state.doc, startWorld)
    if (!hit) return

    if (!session.activeShapeId) {
      // First click: select start shape
      session.activeShapeId = hit
      // We need a way to show a pending line, for now we just store the start
    } else {
      // Second click: create the connector
      const startShapeId = session.activeShapeId
      const endShapeId = hit

      if (startShapeId === endShapeId) return // Don't connect to self

      actions.addShape({
        id: createId(),
        type: 'connector',
        startShapeId,
        endShapeId,
        stroke: state.ui.settings.stroke,
        fill: null,
        strokeWidth: state.ui.settings.strokeWidth,
      })

      // Reset session
      session.activeShapeId = null
      session.phase = 'idle'
      actions.setTool('select')
    }
  },
}
