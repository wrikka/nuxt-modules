// Bot Platform Plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!config.public.wchat?.enableBots) {
    return {
      provide: {
        bots: null
      }
    }
  }

  // Mini App iframe manager
  const miniApps = new Map<string, HTMLIFrameElement>()

  const openMiniApp = (appId: string, url: string, options?: {
    fullscreen?: boolean
    allowWriteAccess?: boolean
  }): HTMLIFrameElement => {
    // Create iframe for Mini App
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-forms', 'allow-popups')
    iframe.allow = 'camera; microphone; geolocation; payment'
    iframe.style.cssText = `
      width: 100%;
      height: ${options?.fullscreen ? '100vh' : '500px'};
      border: none;
      border-radius: 8px;
    `

    miniApps.set(appId, iframe)
    return iframe
  }

  const closeMiniApp = (appId: string): void => {
    const iframe = miniApps.get(appId)
    if (iframe) {
      iframe.remove()
      miniApps.delete(appId)
    }
  }

  // Bot command parser
  const parseCommand = (text: string): { command: string; args: string[] } | null => {
    const match = text.match(/^\/([a-zA-Z0-9_]+)(?:\s+(.+))?$/)
    if (!match) return null

    return {
      command: match[1],
      args: match[2] ? match[2].split(/\s+/) : []
    }
  }

  // Inline query handler for bot commands
  const handleInlineQuery = async (query: string, offset?: string) => {
    // This would query the bot's inline API
    const response = await $fetch('/api/chat/bots/inline', {
      method: 'POST',
      body: { query, offset }
    })
    return response
  }

  // Payment request through bot
  const requestPayment = async (botId: string, params: {
    title: string
    description: string
    payload: string
    currency: string
    amount: number
  }): Promise<boolean> => {
    try {
      const response = await $fetch(`/api/chat/bots/${botId}/payment`, {
        method: 'POST',
        body: params
      })
      return response.success
    } catch {
      return false
    }
  }

  // Web App data handler
  const sendWebAppData = async (botId: string, data: unknown): Promise<void> => {
    await $fetch(`/api/chat/bots/${botId}/webapp`, {
      method: 'POST',
      body: { data }
    })
  }

  return {
    provide: {
      bots: {
        openMiniApp,
        closeMiniApp,
        parseCommand,
        handleInlineQuery,
        requestPayment,
        sendWebAppData
      }
    }
  }
})
