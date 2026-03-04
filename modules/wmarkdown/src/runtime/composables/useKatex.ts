import katex from 'katex'

export interface KatexOptions {
  displayMode?: boolean
  throwOnError?: boolean
  errorColor?: string
  macros?: Record<string, string>
  colorIsTextColor?: boolean
  maxSize?: number
  maxExpand?: number
  allowedProtocols?: string[]
  strict?: boolean | 'ignore' | 'warn' | 'error' | ((errorCode: string, errorMsg: string, token: unknown) => boolean | undefined)
}

export function useKatex() {
  const render = (tex: string, options: KatexOptions = {}): string => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        ...options
      })
    } catch (error) {
      console.error('KaTeX render error:', error)
      return `<span class="katex-error" title="${error}">${tex}</span>`
    }
  }

  const renderInline = (tex: string, options: Omit<KatexOptions, 'displayMode'> = {}): string => {
    return render(tex, { ...options, displayMode: false })
  }

  const renderBlock = (tex: string, options: Omit<KatexOptions, 'displayMode'> = {}): string => {
    return render(tex, { ...options, displayMode: true })
  }

  const renderAll = (container: HTMLElement, options: KatexOptions = {}) => {
    const inlineMath = container.querySelectorAll('.math:not(.math-block)')
    const blockMath = container.querySelectorAll('.math-block')

    inlineMath.forEach((el) => {
      const tex = el.textContent || ''
      el.innerHTML = renderInline(tex, options)
    })

    blockMath.forEach((el) => {
      const tex = el.textContent || ''
      el.innerHTML = renderBlock(tex, options)
    })
  }

  return {
    render,
    renderInline,
    renderBlock,
    renderAll
  }
}
