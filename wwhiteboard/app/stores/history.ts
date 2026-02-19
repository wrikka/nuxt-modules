import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WhiteboardDoc } from '../../shared/types/whiteboard'

const clone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T
}

export const useHistoryStore = defineStore('history', () => {
  const undoStack = ref<WhiteboardDoc[]>([])
  const redoStack = ref<WhiteboardDoc[]>([])

  function push(doc: WhiteboardDoc) {
    undoStack.value.push(clone(doc))
    redoStack.value = [] // Clear redo stack on new action
  }

  function undo(currentDoc: WhiteboardDoc): WhiteboardDoc | null {
    const previousDoc = undoStack.value.pop()
    if (!previousDoc) return null

    redoStack.value.push(clone(currentDoc))
    return previousDoc
  }

  function redo(currentDoc: WhiteboardDoc): WhiteboardDoc | null {
    const nextDoc = redoStack.value.pop()
    if (!nextDoc) return null

    undoStack.value.push(clone(currentDoc))
    return nextDoc
  }

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  function clear() {
    undoStack.value = []
    redoStack.value = []
  }

  return {
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  }
})
