import { initHighlighter, highlightCode, type HighlighterCore } from '../utils/shiki'
import type { ShikiOptions } from '../types'

export function useShikiHighlighter() {
  const highlighter = ref<HighlighterCore | null>(null)
  const isReady = ref(false)

  const init = async () => {
    if (!highlighter.value) {
      highlighter.value = await initHighlighter()
      isReady.value = true
    }
    return highlighter.value
  }

  const highlight = async (code: string, lang: string, theme?: string): Promise<string> => {
    await init()
    return highlightCode(code, lang, theme)
  }

  const highlightToVueRenderFunction = async (
    code: string,
    lang: string,
    options: ShikiOptions
  ): Promise<string> => {
    const instance = await init()
    if (!instance) return code

    const { theme, darkTheme } = options

    if (darkTheme && theme) {
      const lightHtml = await highlightCode(code, lang, theme)
      const darkHtml = await highlightCode(code, lang, darkTheme)

      return `<div class="code-block">
        <div class="light-theme">${lightHtml}</div>
        <div class="dark-theme hidden">${darkHtml}</div>
      </div>`
    }

    return await highlightCode(code, lang, theme)
  }

  return {
    highlighter: readonly(highlighter),
    isReady: readonly(isReady),
    init,
    highlight,
    highlightToVueRenderFunction
  }
}
