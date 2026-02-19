import { storeToRefs } from 'pinia'
import { useWhiteboardStore } from '~/stores/whiteboard'
import type { UseWhiteboardApi } from '~/composables/useWhiteboard'

export function useContextMenu(store: ReturnType<typeof useWhiteboardStore>, whiteboardApi: UseWhiteboardApi) {
  const { setTool, removeShape, clearSelection, zoomAt } = whiteboardApi
  const { ui, doc } = storeToRefs(store)

  const ctxMenuOpen = ref(false)
  const ctxMenuX = ref(0)
  const ctxMenuY = ref(0)

  const closeContextMenu = () => {
    ctxMenuOpen.value = false
  }

  const deleteSelected = () => {
    const ids = ui.value.selectedIds
    for (const id of ids) removeShape(id as string)
    clearSelection()
  }

  const contextMenuItems = computed(() => {
    const hasSelection = ui.value.selectedIds.length > 0
    const selectedShapes = ui.value.selectedIds.map(id => doc.value.shapes[id])
    const allSelectedLocked = hasSelection && selectedShapes.every(shape => shape?.locked)
    const canGroup = ui.value.selectedIds.length > 1
    const canUngroup = hasSelection && selectedShapes.every(shape => shape?.type === 'group')

    return [
      {
        id: 'select',
        label: 'Select tool',
        icon: 'mdi:cursor-default',
        shortcut: 'V',
        onSelect: () => setTool('select'),
      },
      {
        id: 'zoom-in',
        label: 'Zoom in',
        icon: 'mdi:magnify-plus-outline',
        shortcut: 'Ctrl + +',
        onSelect: () => zoomAt({ x: ctxMenuX.value, y: ctxMenuY.value }, 1.15),
      },
      {
        id: 'zoom-out',
        label: 'Zoom out',
        icon: 'mdi:magnify-minus-outline',
        shortcut: 'Ctrl + -',
        onSelect: () => zoomAt({ x: ctxMenuX.value, y: ctxMenuY.value }, 0.87),
      },
      {
        id: 'delete',
        label: 'Delete selected',
        icon: 'mdi:trash-can-outline',
        shortcut: 'Del',
        disabled: !hasSelection,
        onSelect: deleteSelected,
      },
      {
        id: 'bring-forward',
        label: 'Bring forward',
        icon: 'mdi:arrange-bring-forward',
        disabled: !hasSelection,
        onSelect: () => store.bringForward(),
      },
      {
        id: 'send-backward',
        label: 'Send backward',
        icon: 'mdi:arrange-send-backward',
        disabled: !hasSelection,
        onSelect: () => store.sendBackward(),
      },
      {
        id: 'bring-to-front',
        label: 'Bring to front',
        icon: 'mdi:arrange-bring-to-front',
        disabled: !hasSelection,
        onSelect: () => store.bringToFront(),
      },
      {
        id: 'send-to-back',
        label: 'Send to back',
        icon: 'mdi:arrange-send-to-back',
        disabled: !hasSelection,
        onSelect: () => store.sendToBack(),
      },
      {
        id: 'lock',
        label: allSelectedLocked ? 'Unlock' : 'Lock',
        icon: allSelectedLocked ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline',
        disabled: !hasSelection,
        onSelect: () => store.toggleLockSelectedShapes(),
      },
      {
        id: 'group',
        label: 'Group',
        icon: 'mdi:group',
        disabled: !canGroup,
        onSelect: () => store.groupSelectedShapes(),
      },
      {
        id: 'ungroup',
        label: 'Ungroup',
        icon: 'mdi:ungroup',
        disabled: !canUngroup,
        onSelect: () => store.ungroupSelectedShapes(),
      },
    ]
  })

  const onCanvasContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    ctxMenuX.value = e.clientX
    ctxMenuY.value = e.clientY
    ctxMenuOpen.value = true
  }

  return {
    ctxMenuOpen,
    ctxMenuX,
    ctxMenuY,
    contextMenuItems,
    onCanvasContextMenu,
    closeContextMenu,
    deleteSelected, // also used by command palette
  }
}
