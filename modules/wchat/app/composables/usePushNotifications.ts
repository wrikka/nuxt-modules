import type { PushSubscription, NotificationPayload } from '../types'

// Push Notifications (FCM/APNs) - Reliable cross-platform push
export const usePushNotifications = () => {
  const config = useRuntimeConfig()
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const subscription = ref<PushSubscription | null>(null)
  const isEnabled = useLocalStorage('wchat:push:enabled', true)
  const notificationSound = useLocalStorage('wchat:push:sound', true)
  const notificationPreview = useLocalStorage('wchat:push:preview', true)
  const notificationCount = ref(0)

  // Check support
  const checkSupport = (): boolean => {
    isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window
    return isSupported.value
  }

  // Request permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) return false

    const result = await Notification.requestPermission()
    permission.value = result
    return result === 'granted'
  }

  // Subscribe to push
  const subscribe = async (): Promise<PushSubscription | null> => {
    if (!isSupported.value || permission.value !== 'granted') return null

    try {
      const registration = await navigator.serviceWorker.ready
      const existing = await registration.pushManager.getSubscription()

      if (existing) {
        subscription.value = existing
        return existing
      }

      // Get VAPID key from server
      const { vapidKey } = await $fetch<{ vapidKey: string }>('/api/chat/push/vapid-key')

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      })

      // Send to server
      await $fetch('/api/chat/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(newSubscription)
      })

      subscription.value = newSubscription
      isEnabled.value = true
      return newSubscription
    } catch {
      return null
    }
  }

  // Unsubscribe
  const unsubscribe = async (): Promise<void> => {
    if (!subscription.value) return

    await subscription.value.unsubscribe()
    await $fetch('/api/chat/push/unsubscribe', {
      method: 'POST',
      body: { endpoint: subscription.value.endpoint }
    })

    subscription.value = null
    isEnabled.value = false
  }

  // Show local notification
  const showNotification = async (payload: NotificationPayload): Promise<void> => {
    if (!isEnabled.value || permission.value !== 'granted') return

    const registration = await navigator.serviceWorker.ready

    const options: NotificationOptions = {
      body: notificationPreview.value ? payload.body : 'New message',
      icon: payload.icon || '/icon.png',
      badge: '/badge.png',
      tag: payload.tag || 'wchat-message',
      requireInteraction: payload.requireInteraction ?? false,
      actions: payload.actions || [
        { action: 'reply', title: 'Reply' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      data: payload.data,
      silent: !notificationSound.value
    }

    await registration.showNotification(payload.title, options)
    notificationCount.value++
  }

  // Clear all notifications
  const clearAll = async (): Promise<void> => {
    const registration = await navigator.serviceWorker.ready
    const notifications = await registration.getNotifications()
    notifications.forEach(n => n.close())
    notificationCount.value = 0
  }

  // Toggle notifications
  const toggle = async (enabled: boolean): Promise<void> => {
    isEnabled.value = enabled
    if (enabled) {
      await subscribe()
    } else {
      await unsubscribe()
    }
  }

  // Set sound
  const setSound = (enabled: boolean): void => {
    notificationSound.value = enabled
  }

  // Set preview
  const setPreview = (enabled: boolean): void => {
    notificationPreview.value = enabled
  }

  // Mark all as read
  const markAllRead = async (): Promise<void> => {
    await clearAll()
    await $fetch('/api/chat/notifications/mark-read', { method: 'POST' })
  }

  // Helper: Convert base64 to Uint8Array
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Initialize on mount
  onMounted(() => {
    checkSupport()
    if (isEnabled.value && permission.value === 'granted') {
      subscribe()
    }
  })

  return {
    isSupported: readonly(isSupported),
    permission: readonly(permission),
    subscription: readonly(subscription),
    isEnabled: readonly(isEnabled),
    notificationSound: readonly(notificationSound),
    notificationPreview: readonly(notificationPreview),
    notificationCount: readonly(notificationCount),
    checkSupport,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    clearAll,
    toggle,
    setSound,
    setPreview,
    markAllRead
  }
}

// Notification settings per chat
export const useChatNotifications = (chatId: string) => {
  const settings = useLocalStorage(`wchat:notifications:${chatId}`, {
    enabled: true,
    sound: true,
    preview: true,
    muteDuration: 0 // 0 = forever, timestamp = until when
  })

  const isMuted = computed(() => {
    if (!settings.value.enabled) return true
    if (settings.value.muteDuration === 0) return true
    if (settings.value.muteDuration > Date.now()) return true
    return false
  })

  const mute = (duration?: number): void => {
    settings.value.enabled = false
    settings.value.muteDuration = duration || 0
  }

  const unmute = (): void => {
    settings.value.enabled = true
    settings.value.muteDuration = 0
  }

  return {
    settings: readonly(settings),
    isMuted,
    mute,
    unmute
  }
}

// Custom notification sounds
export const notificationSounds = [
  { name: 'Default', value: 'default' },
  { name: 'Telegram', value: 'telegram' },
  { name: 'iOS', value: 'ios' },
  { name: 'Android', value: 'android' },
  { name: 'None', value: 'none' }
]
