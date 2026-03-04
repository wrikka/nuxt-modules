import { defineNuxtPlugin } from '#app'
import { useCopyButton } from '../composables/useCopyButton'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.wmarkdown as {
    features?: {
      copyButton?: boolean
    }
  }

  if (!config?.features?.copyButton) return

  const { addCopyButtonsToCodeBlocks } = useCopyButton()

  nuxtApp.hook('app:mounted', () => {
    // Add copy buttons to existing code blocks
    addCopyButtonsToCodeBlocks(document.body)

    // Watch for dynamically added code blocks
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.querySelector('pre code') || node.matches('pre code')) {
              addCopyButtonsToCodeBlocks(node)
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
})
