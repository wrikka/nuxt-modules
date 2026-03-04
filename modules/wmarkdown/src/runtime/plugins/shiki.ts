import { initHighlighter } from './utils/shiki'

export default defineNuxtPlugin(async () => {
  if (process.client) {
    await initHighlighter()
  }

  return {
    provide: {
      wmarkdown: {
        ready: true
      }
    }
  }
})
