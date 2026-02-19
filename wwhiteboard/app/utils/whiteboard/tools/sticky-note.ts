import type { GpuClient } from '~/composables/core/whiteboardRuntime'
import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { createId } from '../tools'

export const stickyNote = {
  onPointerDown(
    state: WhiteboardState,
    session: Session,
    _screen: import('../../../../shared/types/whiteboard').Point,
    _event: PointerEvent,
    actions: WhiteboardActions,
    getGpuClient: () => GpuClient | null,
  ) {
    const gpuClient = getGpuClient()
    if (gpuClient) {
      gpuClient.add_sticky_note?.()
      session.phase = 'idle'
      return
    }
    const { startWorld } = session
    if (!startWorld) return

    const id = createId()
    session.activeShapeId = id

    actions.addShape({
      id,
      type: 'sticky-note',
      x: startWorld.x - 100,
      y: startWorld.y - 100,
      w: 200,
      h: 200,
      text: 'Sticky Note',
      fontSize: state.ui.settings.fontSize,
      stroke: state.ui.settings.stroke,
      fill: state.ui.settings.fill ?? '#facc15', // yellow-400
      strokeWidth: state.ui.settings.strokeWidth,
    })
    actions.selectOnly(id)
    session.phase = 'idle'
  },
}
