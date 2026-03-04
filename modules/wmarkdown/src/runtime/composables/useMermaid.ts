import mermaid from 'mermaid'
import { ref, onMounted } from 'vue'

let mermaidInitialized = false

export function useMermaid() {
  const isReady = ref(false)

  const initMermaid = async (options: Record<string, unknown> = {}) => {
    if (mermaidInitialized) return

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'strict',
      ...options
    })

    mermaidInitialized = true
    isReady.value = true
  }

  const render = async (id: string, definition: string): Promise<string> => {
    if (!mermaidInitialized) {
      await initMermaid()
    }

    try {
      const { svg } = await mermaid.render(id, definition)
      return svg
    } catch (error) {
      console.error('Mermaid render error:', error)
      return `<pre class="mermaid-error">Error rendering diagram: ${error}</pre>`
    }
  }

  const renderAll = async (container: HTMLElement) => {
    if (!mermaidInitialized) {
      await initMermaid()
    }

    const diagrams = container.querySelectorAll('.mermaid')
    for (const diagram of diagrams) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      const definition = diagram.textContent || ''
      try {
        const svg = await render(id, definition)
        diagram.innerHTML = svg
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error)
      }
    }
  }

  onMounted(() => {
    initMermaid()
  })

  return {
    isReady,
    initMermaid,
    render,
    renderAll
  }
}
