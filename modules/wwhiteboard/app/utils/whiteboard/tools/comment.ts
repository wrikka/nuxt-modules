import type { WhiteboardState } from '../../../../shared/types/whiteboard'
import type { Session, WhiteboardActions } from '../tools'
import { screenToWorld } from '../geometry'

export const comment = {
  onPointerDown(
    _state: WhiteboardState,
    session: Session,
    _screen: import('../../../../shared/types/whiteboard').Point,
    _event: PointerEvent,
    actions: WhiteboardActions,
    _getGpuClient: () => unknown,
  ) {
    const worldPoint = screenToWorld(_screen, _state.camera)
    const text = prompt('Enter your comment:')
    if (text) {
      actions.addComment(worldPoint.x, worldPoint.y, text)
      actions.setTool('select') // Switch back to select tool after commenting
    }
  },
}
