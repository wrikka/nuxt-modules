import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TocItem } from '../types'

export function useTocScrollSpy() {
  const tocItems = ref<TocItem[]>([])
  const activeId = ref<string | null>(null)
  const observer = ref<IntersectionObserver | null>(null)

  const flattenedItems = computed(() => {
    const flatten = (items: TocItem[]): TocItem[] => {
      return items.reduce((acc, item) => {
        acc.push(item)
        if (item.children?.length) {
          acc.push(...flatten(item.children))
        }
        return acc
      }, [] as TocItem[])
    }
    return flatten(tocItems.value)
  })

  const initScrollSpy = (containerSelector: string = '.wmarkdown-content') => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headingIds: string[] = []

    headings.forEach(heading => {
      if (heading.id) {
        headingIds.push(heading.id)
      }
    })

    if (headingIds.length === 0) return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        })
      },
      {
        rootMargin: '-20% 0% -80% 0%',
        threshold: 0
      }
    )

    headingIds.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        observer.value?.observe(element)
      }
    })
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeId.value = id
    }
  }

  const destroyScrollSpy = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  onMounted(() => {
    initScrollSpy()
  })

  onUnmounted(() => {
    destroyScrollSpy()
  })

  return {
    tocItems,
    activeId,
    flattenedItems,
    initScrollSpy,
    scrollToHeading,
    destroyScrollSpy
  }
}
