import type { LocationMessage, LocationShare, LiveLocation } from '../types'

// Location Sharing - Real-time + static
export const useLocationSharing = () => {
  const config = useRuntimeConfig()
  const isSharing = ref(false)
  const currentLocation = ref<GeolocationPosition | null>(null)
  const watchId = ref<number | null>(null)
  const liveLocations = ref<Map<string, LiveLocation>>(new Map())
  const mapCenter = ref<{ lat: number; lng: number } | null>(null)
  const zoom = ref(15)

  // Get current position (one-time)
  const getCurrentPosition = async (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation.value = position
          mapCenter.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          resolve(position)
        },
        (error) => reject(error),
        { enableHighAccuracy: true }
      )
    })
  }

  // Send static location
  const sendLocation = async (
    chatId: string,
    position?: GeolocationPosition
  ): Promise<LocationMessage | null> => {
    if (!config.public.wchat?.enableLocationSharing) return null

    const pos = position || await getCurrentPosition()
    if (!pos) return null

    return await $fetch<LocationMessage>('/api/chat/messages/location', {
      method: 'POST',
      body: {
        chatId,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        name: 'My Location'
      }
    })
  }

  // Send location with venue name
  const sendVenue = async (
    chatId: string,
    venue: {
      name: string
      address: string
      latitude: number
      longitude: number
    }
  ): Promise<LocationMessage | null> => {
    if (!config.public.wchat?.enableLocationSharing) return null

    return await $fetch<LocationMessage>('/api/chat/messages/location', {
      method: 'POST',
      body: {
        chatId,
        ...venue
      }
    })
  }

  // Start sharing live location
  const startLiveLocation = async (
    chatId: string,
    duration: number = 900 // 15 minutes default
  ): Promise<LiveLocation | null> => {
    if (!config.public.wchat?.enableLocationSharing) return null

    // Get initial position
    const position = await getCurrentPosition()
    if (!position) return null

    // Start watching
    watchId.value = navigator.geolocation.watchPosition(
      (pos) => {
        currentLocation.value = pos
        updateLiveLocation(chatId, pos)
      },
      null,
      { enableHighAccuracy: true, maximumAge: 10000 }
    )

    isSharing.value = true

    // Send start message
    const liveLocation = await $fetch<LiveLocation>('/api/chat/live-location/start', {
      method: 'POST',
      body: {
        chatId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        duration,
        expiresAt: new Date(Date.now() + duration * 1000)
      }
    })

    liveLocations.value.set(chatId, liveLocation)

    // Auto stop after duration
    setTimeout(() => {
      stopLiveLocation(chatId)
    }, duration * 1000)

    return liveLocation
  }

  // Update live location
  const updateLiveLocation = async (
    chatId: string,
    position: GeolocationPosition
  ): Promise<void> => {
    await $fetch('/api/chat/live-location/update', {
      method: 'POST',
      body: {
        chatId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed
      }
    })
  }

  // Stop sharing live location
  const stopLiveLocation = async (chatId: string): Promise<void> => {
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }

    await $fetch(`/api/chat/live-location/${chatId}/stop`, { method: 'POST' })

    liveLocations.value.delete(chatId)
    isSharing.value = false
  }

  // Get nearby places
  const getNearbyPlaces = async (
    lat: number,
    lng: number,
    radius: number = 1000
  ): Promise<Array<{
    name: string
    address: string
    latitude: number
    longitude: number
    type: string
  }>> => {
    return await $fetch('/api/chat/location/nearby', {
      params: { lat, lng, radius }
    })
  }

  // Search places
  const searchPlaces = async (
    query: string,
    lat?: number,
    lng?: number
  ): Promise<Array<{
    name: string
    address: string
    latitude: number
    longitude: number
  }>> => {
    return await $fetch('/api/chat/location/search', {
      params: { q: query, lat, lng }
    })
  }

  // Get directions
  const getDirections = async (
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): Promise<{
    distance: string
    duration: string
    steps: Array<{
      instruction: string
      distance: string
    }>
  } | null> => {
    try {
      return await $fetch('/api/chat/location/directions', {
        method: 'POST',
        body: { from, to }
      })
    } catch {
      return null
    }
  }

  // Open in maps app
  const openInMaps = (lat: number, lng: number, label?: string): void => {
    const url = label
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`
      : `https://www.google.com/maps?q=${lat},${lng}`
    window.open(url, '_blank')
  }

  // Calculate distance
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371e3 // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Format distance
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(1)} km`
  }

  return {
    isSharing: readonly(isSharing),
    currentLocation: readonly(currentLocation),
    liveLocations: readonly(liveLocations),
    mapCenter: readonly(mapCenter),
    zoom: readonly(zoom),
    getCurrentPosition,
    sendLocation,
    sendVenue,
    startLiveLocation,
    stopLiveLocation,
    getNearbyPlaces,
    searchPlaces,
    getDirections,
    openInMaps,
    calculateDistance,
    formatDistance
  }
}

// Live location viewer
export const useLiveLocationViewer = (chatId: string) => {
  const locations = ref<Map<string, GeolocationPosition>>(new Map())
  const isTracking = ref(false)

  const startTracking = async (): Promise<void> => {
    isTracking.value = true

    // Poll for updates
    const poll = async () => {
      if (!isTracking.value) return

      const updates = await $fetch<Array<{
        userId: string
        latitude: number
        longitude: number
        accuracy: number
        updatedAt: string
      }>>(`/api/chat/live-location/${chatId}/updates`)

      updates.forEach(update => {
        locations.value.set(update.userId, {
          coords: {
            latitude: update.latitude,
            longitude: update.longitude,
            accuracy: update.accuracy,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: new Date(update.updatedAt).getTime()
        } as GeolocationPosition)
      })

      setTimeout(poll, 5000) // Poll every 5 seconds
    }

    poll()
  }

  const stopTracking = (): void => {
    isTracking.value = false
  }

  onUnmounted(stopTracking)

  return {
    locations: readonly(locations),
    isTracking: readonly(isTracking),
    startTracking,
    stopTracking
  }
}
