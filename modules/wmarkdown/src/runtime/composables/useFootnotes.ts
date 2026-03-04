import { ref, computed } from 'vue'

interface Footnote {
  id: string
  content: string
  refCount: number
}

export function useFootnotes() {
  const footnotes = ref<Footnote[]>([])
  const footnoteCounter = ref(0)

  const footnoteList = computed(() => {
    return footnotes.value.map((fn, index) => ({
      ...fn,
      number: index + 1
    }))
  })

  const parseFootnotes = (markdown: string): { content: string; footnotes: Footnote[] } => {
    const footnoteDefs: Record<string, string> = {}
    const footnoteRefs: string[] = []
    footnoteCounter.value = 0
    footnotes.value = []

    // Extract footnote definitions: [^id]: content
    const defRegex = /^\[\^([^\]]+)\]:\s*(.+)$/gm
    let match
    while ((match = defRegex.exec(markdown)) !== null) {
      footnoteDefs[match[1]] = match[2]
    }

    // Remove footnote definitions from content
    let content = markdown.replace(/^\[\^([^\]]+)\]:\s*(.+)\n?/gm, '')

    // Replace footnote references: [^id]
    content = content.replace(/\[\^([^\]]+)\]/g, (match, id) => {
      if (footnoteDefs[id]) {
        const existingIndex = footnoteRefs.indexOf(id)
        const footnoteNumber = existingIndex !== -1 ? existingIndex + 1 : footnoteRefs.push(id)

        return `<sup class="footnote-ref"><a href="#footnote-${id}" id="footnote-ref-${id}">${footnoteNumber}</a></sup>`
      }
      return match
    })

    // Build footnotes array
    footnoteRefs.forEach((id, index) => {
      if (footnoteDefs[id]) {
        footnotes.value.push({
          id,
          content: footnoteDefs[id],
          refCount: 1
        })
      }
    })

    return { content, footnotes: footnotes.value }
  }

  const renderFootnotes = (): string => {
    if (footnotes.value.length === 0) return ''

    const items = footnotes.value
      .map((fn, index) => {
        const number = index + 1
        return `<li id="footnote-${fn.id}">
          <p>${fn.content} <a href="#footnote-ref-${fn.id}" class="footnote-backref">↩</a></p>
        </li>`
      })
      .join('\n')

    return `<div class="footnotes">
      <hr />
      <ol>${items}</ol>
    </div>`
  }

  const getFootnoteMarkdown = (id: string, content: string): string => {
    return `[^${id}]: ${content}`
  }

  const getFootnoteRef = (id: string): string => {
    return `[^${id}]`
  }

  const reset = () => {
    footnotes.value = []
    footnoteCounter.value = 0
  }

  return {
    footnotes,
    footnoteList,
    parseFootnotes,
    renderFootnotes,
    getFootnoteMarkdown,
    getFootnoteRef,
    reset
  }
}
