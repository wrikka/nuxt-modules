import type { WhiteboardState, Shape, ShapeId, Point, ShapeGroup } from '../../../shared/types/whiteboard'
import { rectFromPoints } from '../../utils/whiteboard/geometry'
import { createId } from '../../utils/whiteboard/tools'

export function defineShapeActions(state: WhiteboardState) {
  const addShape = (shape: Shape) => {
    state.doc.shapes[shape.id] = shape
    state.doc.order.push(shape.id)
  }

  const removeShape = (id: ShapeId) => {
    delete state.doc.shapes[id]
    state.doc.order = state.doc.order.filter((x: ShapeId) => x !== id)
    state.ui.selectedIds = state.ui.selectedIds.filter((x) => x !== id)
  }

  const updateRect = (id: ShapeId, a: Point, b: Point) => {
    const shape = state.doc.shapes[id]
    if (!shape) return
    if (shape.type !== 'rectangle' && shape.type !== 'ellipse' && shape.type !== 'diamond' && shape.type !== 'triangle' && shape.type !== 'image') return
    const r = rectFromPoints(a, b)
    shape.x = r.x
    shape.y = r.y
    shape.w = r.w
    shape.h = r.h
  }

  const updateLineLike = (id: ShapeId, a: Point, b: Point) => {
    const shape = state.doc.shapes[id]
    if (!shape) return
    if (shape.type !== 'line' && shape.type !== 'arrow') return
    shape.a = a
    shape.b = b
  }

  const moveSelectedShapesBy = (dx: number, dy: number) => {
    const moveShape = (shape: Shape, dx: number, dy: number) => {
      if (!shape) return

      switch (shape.type) {
        case 'rectangle':
        case 'ellipse':
        case 'text':
        case 'sticky-note':
        case 'diamond':
        case 'triangle':
        case 'image':
          shape.x += dx
          shape.y += dy
          break
        case 'line':
        case 'arrow':
          shape.a.x += dx
          shape.a.y += dy
          shape.b.x += dx
          shape.b.y += dy
          break
        case 'pencil':
          for (const p of shape.points) {
            p.x += dx
            p.y += dy
          }
          break
        case 'group':
          for (const childId of shape.children) {
            const childShape = state.doc.shapes[childId]
            if (childShape) {
              moveShape(childShape, dx, dy)
            }
          }
          break
        case 'frame':
          shape.x += dx
          shape.y += dy
          // Children are contained visually but their coordinates are absolute,
          // so we need to move them along with the frame.
          for (const childId of shape.children) {
            const childShape = state.doc.shapes[childId]
            if (childShape) {
              moveShape(childShape, dx, dy)
            }
          }
          break
      }
    }

    for (const id of state.ui.selectedIds) {
      const shape = state.doc.shapes[id]
      if (shape) {
        moveShape(shape, dx, dy)
      }
    }
  }

  const updateShapeText = (id: ShapeId, text: string) => {
    const shape = state.doc.shapes[id]
    if (shape && ('text' in shape)) {
      shape.text = text
    }
  }

  const bringForward = () => {
    const order = state.doc.order
    const selected = state.ui.selectedIds
    for (let i = 0; i < order.length - 1; i++) {
      const current = order[i]
      const next = order[i + 1]
      if (current && next && selected.includes(current) && !selected.includes(next)) {
        [order[i], order[i + 1]] = [next, current]
      }
    }
  }

  const sendBackward = () => {
    const order = state.doc.order
    const selected = state.ui.selectedIds
    for (let i = order.length - 1; i > 0; i--) {
      const current = order[i]
      const prev = order[i - 1]
      if (current && prev && selected.includes(current) && !selected.includes(prev)) {
        [order[i], order[i - 1]] = [prev, current]
      }
    }
  }

  const bringToFront = () => {
    const order = state.doc.order
    const selected = state.ui.selectedIds
    const rest = order.filter(id => !selected.includes(id))
    state.doc.order = [...rest, ...selected]
  }

  const sendToBack = () => {
    const order = state.doc.order
    const selected = state.ui.selectedIds
    const rest = order.filter(id => !selected.includes(id))
    state.doc.order = [...selected, ...rest]
  }

  const toggleLockSelectedShapes = () => {
    for (const id of state.ui.selectedIds) {
      const shape = state.doc.shapes[id]
      if (shape) {
        shape.locked = !shape.locked
      }
    }
  }

  const groupSelectedShapes = () => {
    const selectedIds = state.ui.selectedIds
    if (selectedIds.length < 2) return

    const newGroupId = createId()
    const newGroup: ShapeGroup = {
      id: newGroupId,
      type: 'group',
      children: selectedIds,
      stroke: 'transparent',
      fill: null,
      strokeWidth: 0,
    }

    addShape(newGroup)

    for (const id of selectedIds) {
      const shape = state.doc.shapes[id]
      if (shape) {
        shape.parentId = newGroupId
      }
    }

    state.ui.selectedIds = [newGroupId]
  }

  const setShapeParent = (shapeId: ShapeId, parentId: ShapeId | undefined) => {
    const shape = state.doc.shapes[shapeId];
    if (!shape) return;

    const oldParentId = shape.parentId;

    // Remove from old parent
    if (oldParentId) {
        const oldParent = state.doc.shapes[oldParentId];
        if (oldParent && (oldParent.type === 'frame' || oldParent.type === 'group')) {
            oldParent.children = oldParent.children.filter(id => id !== shapeId);
        }
    }

    // Add to new parent
    if (parentId) {
        const newParent = state.doc.shapes[parentId];
        if (newParent && (newParent.type === 'frame' || newParent.type === 'group')) {
            newParent.children.push(shapeId);
        }
    }

    shape.parentId = parentId;
  }

  const ungroupSelectedShapes = () => {
    for (const id of state.ui.selectedIds) {
      const shape = state.doc.shapes[id]
      if (shape?.type === 'group') {
        for (const childId of shape.children) {
          const childShape = state.doc.shapes[childId]
          if (childShape) {
            childShape.parentId = undefined
          }
        }
        removeShape(id)
        state.ui.selectedIds = shape.children
      }
    }
  }

  return {
    addShape,
    removeShape,
    updateRect,
    updateLineLike,
    moveSelectedShapesBy,
    updateShapeText,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    toggleLockSelectedShapes,
    groupSelectedShapes,
    ungroupSelectedShapes,
    setShapeParent,
  }
}
