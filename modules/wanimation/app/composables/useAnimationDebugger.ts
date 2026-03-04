import anime from 'animejs'

export interface AnimationDebuggerOptions {
  enabled?: boolean
  showTimeline?: boolean
  showKeyframes?: boolean
  showValues?: boolean
}

export const useAnimationDebugger = (options: AnimationDebuggerOptions = {}) => {
  const { enabled = true, showTimeline = true, showKeyframes = true, showValues = true } = options

  const animations: Map<string, {
    id: string
    startTime: number
    duration: number
    progress: number
    properties: string[]
    element: Element | null
  }> = new Map()

  let panel: HTMLElement | null = null
  let isVisible = false

  const createPanel = () => {
    if (panel || !enabled) return

    panel = document.createElement('div')
    panel.className = 'wanimation-debugger'
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      max-height: 500px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      border-radius: 8px;
      padding: 16px;
      z-index: 999999;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `

    const header = document.createElement('div')
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 1px solid #333;
      padding-bottom: 8px;
    `
    header.innerHTML = `
      <span style="font-weight: bold; font-size: 14px;">🔧 WAnimation Debugger</span>
      <button id="wanimation-debug-toggle" style="
        background: #333;
        border: none;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      ">Hide</button>
    `

    panel.appendChild(header)

    const content = document.createElement('div')
    content.id = 'wanimation-debug-content'
    panel.appendChild(content)

    document.body.appendChild(panel)

    // Toggle visibility
    panel.querySelector('#wanimation-debug-toggle')?.addEventListener('click', () => {
      isVisible = !isVisible
      content.style.display = isVisible ? 'none' : 'block'
      ;(panel?.querySelector('#wanimation-debug-toggle') as HTMLButtonElement).textContent = isVisible ? 'Show' : 'Hide'
    })
  }

  const trackAnimation = (
    id: string,
    anim: anime.AnimeInstance,
    element: Element | null
  ) => {
    if (!enabled) return

    createPanel()

    animations.set(id, {
      id,
      startTime: Date.now(),
      duration: anim.duration,
      progress: 0,
      properties: Object.keys(anim.animations[0]?.property || {}),
      element,
    })

    const originalUpdate = anim.update
    anim.update = (a: anime.AnimeInstance) => {
      const data = animations.get(id)
      if (data) {
        data.progress = (a.currentTime / a.duration) * 100
      }
      originalUpdate?.(a)
    }

    const originalComplete = anim.complete
    anim.complete = (a: anime.AnimeInstance) => {
      animations.delete(id)
      originalComplete?.(a)
    }
  }

  const updateDisplay = () => {
    if (!panel || !enabled) return

    const content = panel.querySelector('#wanimation-debug-content')
    if (!content) return

    let html = `
      <div style="margin-bottom: 12px;">
        <div style="color: #888; margin-bottom: 4px;">Active Animations: ${animations.size}</div>
      </div>
    `

    for (const [id, data] of animations) {
      html += `
        <div style="
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 8px;
        ">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #4ecdc4;">${id}</span>
            <span style="color: #888;">${Math.round(data.progress)}%</span>
          </div>
      `

      if (showTimeline) {
        html += `
          <div style="
            height: 4px;
            background: #333;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 4px;
          ">
            <div style="
              height: 100%;
              width: ${data.progress}%;
              background: linear-gradient(90deg, #4ecdc4, #44a08d);
              transition: width 0.1s linear;
            "></div>
          </div>
        `
      }

      if (showValues && data.properties.length > 0) {
        html += `
          <div style="color: #888; font-size: 10px;">
            ${data.properties.join(', ')}
          </div>
        `
      }

      html += '</div>'
    }

    content.innerHTML = html
  }

  // Update loop
  const updateLoop = () => {
    updateDisplay()
    requestAnimationFrame(updateLoop)
  }

  if (enabled) {
    updateLoop()
  }

  return {
    trackAnimation,
    show: () => {
      if (panel) panel.style.display = 'block'
    },
    hide: () => {
      if (panel) panel.style.display = 'none'
    },
    toggle: () => {
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none'
      }
    },
  }
}
