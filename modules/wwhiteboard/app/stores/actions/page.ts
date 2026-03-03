import type { WhiteboardState, WhiteboardDoc } from '../../../shared/types/whiteboard'

export type WhiteboardPage = {
  id: string
  name: string
  doc: WhiteboardDoc
  camera: WhiteboardState['camera']
}

const clone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T
}

const createEmptyDoc = (): WhiteboardState['doc'] => ({
  shapes: {},
  comments: {},
  order: [],
})

const createDefaultCamera = (): WhiteboardState['camera'] => ({
  x: 0,
  y: 0,
  zoom: 1,
})

export function definePageActions(state: WhiteboardState & { pages: WhiteboardPage[]; activePageId: string }) {
  const saveActivePageSnapshot = () => {
    const idx = state.pages.findIndex((p) => p.id === state.activePageId)
    if (idx < 0) return
    state.pages[idx] = {
      ...state.pages[idx]!,
      doc: clone(state.doc),
      camera: clone(state.camera),
    }
  }

  const switchToPage = (pageId: string) => {
    if (pageId === state.activePageId) return
    saveActivePageSnapshot()

    const next = state.pages.find((p) => p.id === pageId)
    if (!next) return

    state.activePageId = pageId
    state.doc = clone(next.doc)
    state.camera = clone(next.camera)
    state.ui.selectedIds = []
  }

  const addPage = (pageId: string, initialDoc?: WhiteboardDoc) => {
    saveActivePageSnapshot()

    const next: WhiteboardPage = {
      id: pageId,
      name: `Page ${state.pages.length + 1}`,
      doc: initialDoc ? clone(initialDoc) : createEmptyDoc(),
      camera: createDefaultCamera(),
    }

    state.pages.push(next)
    state.activePageId = next.id
    state.doc = clone(next.doc)
    state.camera = clone(next.camera)
    state.ui.selectedIds = []
  }

  const renameActivePage = (title: string) => {
    const idx = state.pages.findIndex((p) => p.id === state.activePageId)
    if (idx < 0) return
    state.pages[idx]!.name = title
  }

  const removePage = (pageId: string) => {
    if (state.pages.length <= 1) return

    const idx = state.pages.findIndex((p) => p.id === pageId)
    if (idx < 0) return

    if (state.activePageId === pageId) {
      const nextIndex = idx === 0 ? 1 : idx - 1
      switchToPage(state.pages[nextIndex]!.id)
    }

    state.pages.splice(idx, 1)
  }

  return {
    saveActivePageSnapshot,
    switchToPage,
    addPage,
    renameActivePage,
    removePage,
  }
}
