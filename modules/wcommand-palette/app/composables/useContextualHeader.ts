import { readonly, ref } from 'vue'

export interface ContextInfo {
  page: string
  route: string
  section?: string
  context: string
}

/**
 * Contextual Header - Show current context (current page, route, etc.)
 */
export function useContextualHeader() {
  const context = ref<ContextInfo>({
    page: '',
    route: '',
    section: undefined,
    context: ''
  })

  const setContext = (info: Partial<ContextInfo>) => {
    context.value = { ...context.value, ...info }
  }

  const setPage = (page: string) => {
    context.value.page = page
  }

  const setRoute = (route: string) => {
    context.value.route = route
  }

  const setSection = (section: string) => {
    context.value.section = section
  }

  const getDisplayText = (): string => {
    const { page, section } = context.value
    return section ? `${page} > ${section}` : page
  }

  const clearContext = () => {
    context.value = { page: '', route: '', section: undefined, context: '' }
  }

  return {
    context: readonly(context),
    setContext,
    setPage,
    setRoute,
    setSection,
    getDisplayText,
    clearContext
  }
}
