import { readonly, ref } from 'vue'
import type { Command, CommandPreview } from '../types'

export interface InlinePreviewState {
  visible: boolean
  command: Command | null
  position: 'right' | 'bottom' | 'inline'
}

/**
 * Inline Preview Panel - Show preview inline in list items
 */
export function useInlinePreview() {
  const previewState = ref<InlinePreviewState>({
    visible: false,
    command: null,
    position: 'right'
  })
  const hoveredCommand = ref<Command | null>(null)

  const showPreview = (command: Command, position: 'right' | 'bottom' | 'inline' = 'right') => {
    if (!command.preview) return

    previewState.value = {
      visible: true,
      command,
      position
    }
    hoveredCommand.value = command
  }

  const hidePreview = () => {
    previewState.value.visible = false
    hoveredCommand.value = null
  }

  const togglePreview = (command: Command) => {
    if (previewState.value.visible && previewState.value.command?.id === command.id) {
      hidePreview()
    }
    else {
      showPreview(command)
    }
  }

  const getPreviewComponent = (command: Command): string | null => {
    if (!command.preview || command.preview.type !== 'component') return null
    return command.preview.component || null
  }

  const getPreviewData = (command: Command): unknown => {
    return command.preview?.data || null
  }

  return {
    previewState: readonly(previewState),
    hoveredCommand: readonly(hoveredCommand),
    showPreview,
    hidePreview,
    togglePreview,
    getPreviewComponent,
    getPreviewData
  }
}
