import type { Token, TocItem } from '../types'

export function useToc() {
  const items = ref<TocItem[]>([])
  const activeId = ref<string>('')

  const generateToc = (tokens: Token[]): TocItem[] => {
    const headings = tokens.filter(t => t.type === 'heading')
    const toc: TocItem[] = []
    const stack: TocItem[][] = [toc]

    for (const heading of headings) {
      const level = (heading.props?.level as number) || 1
      const text = heading.content
      const id = slugify(text)

      const item: TocItem = { id, text, level, children: [] }

      while (stack.length > level) {
        stack.pop()
      }

      const currentLevel = stack[stack.length - 1]
      currentLevel.push(item)

      if (!stack[level]) {
        stack[level] = item.children!
      }
    }

    items.value = toc
    return toc
  }

  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeId.value = id
    }
  }

  const setupScrollSpy = () => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        })
      },
      { rootMargin: '-100px 0px -66% 0px' }
    )

    items.value.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }

  return {
    items: readonly(items),
    activeId: readonly(activeId),
    generateToc,
    scrollToId,
    setupScrollSpy
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
