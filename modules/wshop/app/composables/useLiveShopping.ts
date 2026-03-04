import { ref, computed, onMounted, onUnmounted } from "vue"
import type { Product } from "~~/types"

export interface LiveStream {
  id: string
  title: string
  hostId: string
  hostName: string
  status: "scheduled" | "live" | "ended"
  scheduledAt: Date
  startedAt?: Date
  endedAt?: Date
  products: LiveProduct[]
  viewers: number
  maxViewers: number
  chatEnabled: boolean
  chatMessages: ChatMessage[]
  recordingUrl?: string
}

export interface LiveProduct extends Product {
  streamPrice: number
  flashSale: boolean
  flashSaleEndAt?: Date
  quantity: number
  sold: number
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: "text" | "question" | "purchase" | "reaction"
}

export const useLiveShopping = () => {
  const currentStream = ref<LiveStream | null>(null)
  const activeStreams = ref<LiveStream[]>([])
  const isLive = ref(false)
  const viewerCount = ref(0)
  const chatMessages = ref<ChatMessage[]>([])
  let ws: WebSocket | null = null
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null

  const connectToStream = async (streamId: string): Promise<void> => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    ws = new WebSocket(`${protocol}//${window.location.host}/api/shop/live/${streamId}/ws`)

    ws.onopen = () => {
      isLive.value = true
      startHeartbeat()
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case "viewer_count":
          viewerCount.value = data.count
          break
        case "chat":
          chatMessages.value.push(data.message)
          break
        case "product_highlight":
          // Highlight product in UI
          break
        case "flash_sale_start":
          // Trigger flash sale countdown
          break
        case "stream_ended":
          isLive.value = false
          break
      }
    }

    ws.onclose = () => {
      isLive.value = false
      stopHeartbeat()
    }
  }

  const disconnectFromStream = (): void => {
    ws?.close()
    ws = null
    isLive.value = false
    stopHeartbeat()
  }

  const startHeartbeat = () => {
    heartbeatInterval = setInterval(() => {
      ws?.send(JSON.stringify({ type: "ping" }))
    }, 30000)
  }

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  const sendChatMessage = (message: string, type: ChatMessage["type"] = "text"): void => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify({
      type: "chat",
      message: {
        message,
        type,
        timestamp: new Date().toISOString(),
      },
    }))
  }

  const buyFromStream = async (productId: string, quantity = 1): Promise<void> => {
    if (!currentStream.value) return

    await $fetch("/api/shop/live/purchase", {
      method: "POST",
      body: {
        streamId: currentStream.value.id,
        productId,
        quantity,
      },
    })

    // Show purchase confirmation in chat
    sendChatMessage(`Purchased ${quantity} item(s)`, "purchase")
  }

  const scheduleStream = async (streamData: Omit<LiveStream, "id" | "viewers" | "maxViewers" | "chatMessages">): Promise<LiveStream> => {
    const stream = await $fetch<LiveStream>("/api/shop/live/streams", {
      method: "POST",
      body: streamData,
    })
    return stream
  }

  const startStream = async (streamId: string): Promise<void> => {
    await $fetch(`/api/shop/live/streams/${streamId}/start`, {
      method: "POST",
    })

    const stream = await $fetch<LiveStream>(`/api/shop/live/streams/${streamId}`)
    currentStream.value = stream
    isLive.value = true
  }

  const endStream = async (streamId: string): Promise<void> => {
    await $fetch(`/api/shop/live/streams/${streamId}/end`, {
      method: "POST",
    })

    isLive.value = false
    disconnectFromStream()
  }

  const addProductToStream = async (streamId: string, product: Omit<LiveProduct, "id">): Promise<LiveProduct> => {
    const liveProduct = await $fetch<LiveProduct>(`/api/shop/live/streams/${streamId}/products`, {
      method: "POST",
      body: product,
    })

    if (currentStream.value) {
      currentStream.value.products.push(liveProduct)
    }

    return liveProduct
  }

  const highlightProduct = (productId: string): void => {
    if (!ws) return
    ws.send(JSON.stringify({ type: "highlight_product", productId }))
  }

  const startFlashSale = (productId: string, discountPercent: number, durationMinutes: number): void => {
    if (!ws) return
    ws.send(JSON.stringify({
      type: "flash_sale",
      productId,
      discountPercent,
      durationMinutes,
    }))
  }

  const fetchActiveStreams = async (): Promise<LiveStream[]> => {
    const streams = await $fetch<LiveStream[]>("/api/shop/live/streams/active")
    activeStreams.value = streams
    return streams
  }

  const fetchUpcomingStreams = async (): Promise<LiveStream[]> => {
    return await $fetch<LiveStream[]>("/api/shop/live/streams/upcoming")
  }

  const getStreamStats = async (streamId: string): Promise<{
    totalViewers: number
    uniqueViewers: number
    peakViewers: number
    totalSales: number
    revenue: number
    avgWatchTime: number
  }> => {
    return await $fetch(`/api/shop/live/streams/${streamId}/stats`)
  }

  onMounted(() => {
    fetchActiveStreams()
  })

  onUnmounted(() => {
    disconnectFromStream()
  })

  return {
    currentStream: computed(() => currentStream.value),
    activeStreams: computed(() => activeStreams.value),
    isLive: computed(() => isLive.value),
    viewerCount: computed(() => viewerCount.value),
    chatMessages: computed(() => chatMessages.value),
    connectToStream,
    disconnectFromStream,
    sendChatMessage,
    buyFromStream,
    scheduleStream,
    startStream,
    endStream,
    addProductToStream,
    highlightProduct,
    startFlashSale,
    fetchActiveStreams,
    fetchUpcomingStreams,
    getStreamStats,
  }
}
