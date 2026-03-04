import { defineNuxtPlugin } from '#app'
import { useMermaid } from '../composables/useMermaid'
import { useKatex } from '../composables/useKatex'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.wmarkdown as {
    features?: {
      mermaid?: boolean
      katex?: boolean
    }
  }

  nuxtApp.hook('app:mounted', () => {
    if (config?.features?.mermaid) {
      const { renderAll: renderMermaidAll } = useMermaid()

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.querySelector('.mermaid')) {
                renderMermaidAll(node)
              }
            }
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      renderMermaidAll(document.body)
    }

    if (config?.features?.katex) {
      const { renderAll: renderKatexAll } = useKatex()

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.querySelector('.math, .math-block')) {
                renderKatexAll(node)
              }
            }
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      renderKatexAll(document.body)
    }
  })
})
