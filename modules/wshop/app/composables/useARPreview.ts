import { ref, computed, onMounted, onUnmounted } from "vue"

export interface ARConfig {
  modelUrl: string
  scale: number
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
}

export interface ARSession {
  id: string
  productId: string
  modelUrl: string
  startedAt: Date
  endedAt?: Date
  interactions: number
}

export const useARPreview = () => {
  const isSupported = ref(false)
  const isSessionActive = ref(false)
  const currentModel = ref<string | null>(null)
  const error = ref<Error | null>(null)
  const session = ref<ARSession | null>(null)
  let hitTestSource: XRHitTestSource | null = null
  let xrSession: XRSession | null = null

  const checkSupport = (): boolean => {
    if (typeof window === "undefined") return false

    const isWebXRSupported = "xr" in navigator
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isModelViewerSupported = "modelViewer" in document.createElement("model-viewer")

    isSupported.value = isWebXRSupported || isMobile || isModelViewerSupported
    return isSupported.value
  }

  const startARSession = async (productId: string, modelUrl: string): Promise<void> => {
    if (!isSupported.value) {
      throw new Error("AR not supported on this device")
    }

    try {
      error.value = null

      // Check for WebXR support
      if ("xr" in navigator) {
        const session = await (navigator as Navigator & { xr: XRSystem }).xr.requestSession("immersive-ar", {
          requiredFeatures: ["hit-test"],
        })
        xrSession = session

        // Initialize WebXR session
        await initializeWebXR(session, modelUrl)
      } else {
        // Fallback to model-viewer
        currentModel.value = modelUrl
      }

      isSessionActive.value = true

      // Track session
      const newSession: ARSession = {
        id: crypto.randomUUID(),
        productId,
        modelUrl,
        startedAt: new Date(),
        interactions: 0,
      }
      session.value = newSession

      // Save to server
      await $fetch("/api/shop/ar/sessions", {
        method: "POST",
        body: newSession,
      })
    } catch (err) {
      error.value = err as Error
      throw err
    }
  }

  const initializeWebXR = async (session: XRSession, modelUrl: string): Promise<void> => {
    // This would initialize the WebXR rendering context
    // Requires a canvas and WebGL renderer
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2", { xrCompatible: true })

    if (!gl) {
      throw new Error("WebGL2 not supported")
    }

    // Set up reference space
    const referenceSpace = await session.requestReferenceSpace("local-floor")

    // Set up hit test source
    const viewerSpace = await session.requestReferenceSpace("viewer")
    hitTestSource = await session.requestHitTestSource({ space: viewerSpace })

    // Start render loop
    session.requestAnimationFrame((time, frame) => {
      onXRFrame(time, frame, referenceSpace, modelUrl)
    })
  }

  const onXRFrame = (time: number, frame: XRFrame, referenceSpace: XRReferenceSpace, modelUrl: string): void => {
    if (!xrSession) return

    const pose = frame.getViewerPose(referenceSpace)
    if (pose) {
      // Get hit test results
      const hitTestResults = frame.getHitTestResults(hitTestSource!)

      if (hitTestResults.length > 0) {
        const hitPose = hitTestResults[0].getPose(referenceSpace)
        if (hitPose) {
          // Model would be placed at hitPose.transform.position
        }
      }
    }

    xrSession.requestAnimationFrame((t, f) => onXRFrame(t, f, referenceSpace, modelUrl))
  }

  const endARSession = async (): Promise<void> => {
    if (xrSession) {
      await xrSession.end()
      xrSession = null
    }

    hitTestSource = null
    isSessionActive.value = false
    currentModel.value = null

    if (session.value) {
      session.value.endedAt = new Date()

      // Update session on server
      await $fetch(`/api/shop/ar/sessions/${session.value.id}`, {
        method: "PUT",
        body: { endedAt: session.value.endedAt },
      })
    }
  }

  const placeModel = (position: { x: number; y: number; z: number }): void => {
    // Place the 3D model at the specified position
    if (session.value) {
      session.value.interactions++
    }
  }

  const rotateModel = (degrees: number): void => {
    // Rotate the model
    if (session.value) {
      session.value.interactions++
    }
  }

  const scaleModel = (scale: number): void => {
    // Scale the model
    if (session.value) {
      session.value.interactions++
    }
  }

  const getARStats = async (productId: string): Promise<{
    totalSessions: number
    avgDuration: number
    conversionRate: number
  }> => {
    return await $fetch(`/api/shop/ar/stats/${productId}`)
  }

  onMounted(() => {
    checkSupport()
  })

  onUnmounted(() => {
    if (isSessionActive.value) {
      endARSession()
    }
  })

  return {
    isSupported: computed(() => isSupported.value),
    isSessionActive: computed(() => isSessionActive.value),
    currentModel: computed(() => currentModel.value),
    error: computed(() => error.value),
    session: computed(() => session.value),
    startARSession,
    endARSession,
    placeModel,
    rotateModel,
    scaleModel,
    getARStats,
  }
}
