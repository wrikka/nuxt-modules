import { useWhiteboardStore } from '~/stores/whiteboard'
import type { WhiteboardDoc } from '~/../shared/types/whiteboard'

export function useWhiteboardTemplates(store: ReturnType<typeof useWhiteboardStore>) {
  const addPageFromTemplate = (doc: WhiteboardDoc) => {
    const pageId = `page-${Date.now()}`
    store.addPage(pageId, doc)
  }

  return {
    addPageFromTemplate,
  }
}
