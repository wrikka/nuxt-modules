import { fromHighlighter } from '@shikijs/markdown-it/core'
import type { Highlighter } from 'shiki'
import MarkdownIt from 'markdown-it'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { createSingletonPromise } from '@vueuse/core'

const getMarkdownIt = createSingletonPromise(async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/vitesse-light'),
    ],
    langs: [
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/vue'),
    ],
    engine: createOnigurumaEngine(() => import('shiki/wasm')),
  })

  const md = MarkdownIt()
  md.use(fromHighlighter(highlighter as Highlighter, { theme: 'vitesse-light' }))

  return md
})

export const useMarkdownRenderer = () => {
  const render = async (markdown: string) => {
    const renderer = await getMarkdownIt()
    return renderer.render(markdown)
  }

  return { render }
}
