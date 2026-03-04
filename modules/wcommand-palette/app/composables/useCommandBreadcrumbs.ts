import { readonly, ref } from 'vue'
import type { Command } from '../types'

export interface BreadcrumbItem {
  id: string
  title: string
  icon?: string
}

/**
 * Command Breadcrumbs - Show breadcrumb trail for command chains
 */
export function useCommandBreadcrumbs() {
  const breadcrumbs = ref<BreadcrumbItem[]>([])
  const chainPath = ref<Command[]>([])

  const pushBreadcrumb = (command: Command) => {
    breadcrumbs.value.push({
      id: command.id,
      title: command.title,
      icon: command.icon
    })
    chainPath.value.push(command)
  }

  const popBreadcrumb = () => {
    breadcrumbs.value.pop()
    chainPath.value.pop()
  }

  const goToBreadcrumb = (index: number) => {
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
    chainPath.value = chainPath.value.slice(0, index + 1)
  }

  const clearBreadcrumbs = () => {
    breadcrumbs.value = []
    chainPath.value = []
  }

  const getBreadcrumbPath = (): string => {
    return breadcrumbs.value.map(b => b.title).join(' > ')
  }

  return {
    breadcrumbs: readonly(breadcrumbs),
    chainPath: readonly(chainPath),
    pushBreadcrumb,
    popBreadcrumb,
    goToBreadcrumb,
    clearBreadcrumbs,
    getBreadcrumbPath
  }
}
