import { readonly, ref } from 'vue'

export interface Position {
  x: number
  y: number
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

/**
 * Smart Positioning - Adjust palette position based on cursor/element
 */
export function useSmartPositioning() {
  const position = ref<Position>({ x: 0, y: 0, placement: 'center' })
  const targetElement = ref<HTMLElement | null>(null)

  const calculatePosition = (
    triggerRect: DOMRect,
    paletteWidth: number,
    paletteHeight: number,
    viewportWidth: number,
    viewportHeight: number
  ): Position => {
    const spacing = 8
    let x = triggerRect.left + triggerRect.width / 2 - paletteWidth / 2
    let y = triggerRect.bottom + spacing
    let placement: Position['placement'] = 'bottom'

    if (y + paletteHeight > viewportHeight) {
      y = triggerRect.top - paletteHeight - spacing
      placement = 'top'
    }

    if (x < spacing) {
      x = spacing
    }
    else if (x + paletteWidth > viewportWidth - spacing) {
      x = viewportWidth - paletteWidth - spacing
    }

    if (y < spacing) {
      y = spacing
      placement = 'bottom'
    }

    return { x, y, placement }
  }

  const positionAtCursor = (event: MouseEvent, paletteWidth = 400, paletteHeight = 300) => {
    const triggerRect = new DOMRect(event.clientX - 10, event.clientY - 10, 20, 20)
    position.value = calculatePosition(
      triggerRect,
      paletteWidth,
      paletteHeight,
      window.innerWidth,
      window.innerHeight
    )
  }

  const positionAtElement = (element: HTMLElement, paletteWidth = 400, paletteHeight = 300) => {
    targetElement.value = element
    const rect = element.getBoundingClientRect()
    position.value = calculatePosition(
      rect,
      paletteWidth,
      paletteHeight,
      window.innerWidth,
      window.innerHeight
    )
  }

  const centerOnScreen = (paletteWidth = 400, paletteHeight = 300) => {
    position.value = {
      x: (window.innerWidth - paletteWidth) / 2,
      y: (window.innerHeight - paletteHeight) / 2,
      placement: 'center'
    }
  }

  return {
    position: readonly(position),
    targetElement: readonly(targetElement),
    calculatePosition,
    positionAtCursor,
    positionAtElement,
    centerOnScreen
  }
}
