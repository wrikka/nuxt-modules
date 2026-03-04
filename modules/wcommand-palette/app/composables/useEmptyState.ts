import { readonly, ref } from 'vue'

export interface EmptyState {
  title: string
  description: string
  icon: string
  action?: { label: string; command: string }
}

/**
 * Empty State Illustration - Show illustration when no results found
 */
export function useEmptyState() {
  const emptyStates: Record<string, EmptyState> = {
    'no-results': {
      title: 'No results found',
      description: 'Try a different search term or browse all commands',
      icon: '🔍',
      action: { label: 'Clear search', command: 'clear-search' }
    },
    'no-commands': {
      title: 'No commands available',
      description: 'Register some commands to get started',
      icon: '📋'
    },
    'no-recent': {
      title: 'No recent commands',
      description: 'Commands you use will appear here',
      icon: '⏰'
    },
    'no-pinned': {
      title: 'No pinned commands',
      description: 'Pin your favorite commands for quick access',
      icon: '📌'
    },
    'error': {
      title: 'Something went wrong',
      description: 'Please try again later',
      icon: '⚠️'
    },
    'offline': {
      title: 'You are offline',
      description: 'Some features may not be available',
      icon: '📡'
    }
  }

  const currentState = ref<EmptyState | null>(null)

  const setEmptyState = (key: keyof typeof emptyStates | EmptyState) => {
    if (typeof key === 'string') {
      currentState.value = emptyStates[key] || null
    }
    else {
      currentState.value = key
    }
  }

  const clearEmptyState = () => {
    currentState.value = null
  }

  const registerEmptyState = (key: string, state: EmptyState) => {
    emptyStates[key] = state
  }

  return {
    currentState: readonly(currentState),
    emptyStates,
    setEmptyState,
    clearEmptyState,
    registerEmptyState
  }
}
