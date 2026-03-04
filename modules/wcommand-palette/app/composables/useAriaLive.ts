import { readonly, ref } from 'vue'

export interface AriaLiveState {
  message: string
  politeness: 'polite' | 'assertive'
}

/**
 * ARIA Live Regions - Announce search results to screen readers
 */
export function useAriaLive() {
  const state = ref<AriaLiveState>({
    message: '',
    politeness: 'polite'
  })

  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    state.value = { message, politeness }
  }

  const announceResults = (count: number, query: string) => {
    const message = count === 0
      ? 'No results found'
      : `${count} result${count === 1 ? '' : 's'} found for ${query}`
    announce(message, 'polite')
  }

  const announceSelection = (itemName: string) => {
    announce(`Selected ${itemName}`, 'polite')
  }

  const announceExecution = (commandName: string) => {
    announce(`Executing ${commandName}`, 'assertive')
  }

  const clearAnnouncement = () => {
    state.value.message = ''
  }

  return {
    state: readonly(state),
    announce,
    announceResults,
    announceSelection,
    announceExecution,
    clearAnnouncement
  }
}
