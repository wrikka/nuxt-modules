import type { WebSocketMessage } from '../types'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!config.public.wchat?.enableCloudSync) {
    return {
      provide: {
        ws: null
      }
    }
  }

  // WebSocket connection for real-time messaging
  let ws: WebSocket | null = null
  const listeners = new Map<string, Set<(data: unknown) => void>>()

  const connect = () => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/chat`
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WChat: WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        const handlers = listeners.get(message.type)
        handlers?.forEach(handler => handler(message.payload))
      } catch (err) {
        console.error('WChat: WebSocket message error', err)
      }
    }

    ws.onclose = () => {
      console.log('WChat: WebSocket disconnected')
      // Reconnect after 3 seconds
      setTimeout(connect, 3000)
    }

    ws.onerror = (err) => {
      console.error('WChat: WebSocket error', err)
    }
  }

  // Connect on client-side only
  if (process.client) {
    connect()
  }

  const on = (event: string, handler: (data: unknown) => void) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    listeners.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      listeners.get(event)?.delete(handler)
    }
  }

  const send = (type: string, payload: unknown) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload, timestamp: new Date() }))
    }
  }

  return {
    provide: {
      ws: {
        on,
        send,
        connect,
        disconnect: () => ws?.close()
      }
    }
  }
})
