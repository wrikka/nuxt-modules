import type { Task } from "~/shared/types/task"

/**
 * Composable for PWA / Mobile Companion
 */
export const usePWA = () => {
	const { $toast } = useNuxtApp()

	const isInstalled = useState<boolean>("pwa-installed", () => false)
	const isOnline = useState<boolean>("online-status", () => true)
	const deferredPrompt = useState<BeforeInstallPromptEvent | null>("deferred-prompt", () => null)
	const syncQueue = useState<{ id: string; action: string; data: unknown }[]>("sync-queue", () => [])

	/**
	 * Initialize PWA features
	 */
	const init = () => {
		if (typeof window === "undefined") return

		// Check online status
		isOnline.value = navigator.onLine
		window.addEventListener("online", () => isOnline.value = true)
		window.addEventListener("offline", () => isOnline.value = false)

		// Listen for beforeinstallprompt
		window.addEventListener("beforeinstallprompt", (e) => {
			e.preventDefault()
			deferredPrompt.value = e as BeforeInstallPromptEvent
		})

		// Check if already installed
		if (window.matchMedia("(display-mode: standalone)").matches) {
			isInstalled.value = true
		}
	}

	/**
	 * Install PWA
	 */
	const install = async () => {
		if (!deferredPrompt.value) {
			$toast.info("App already installed or not available")
			return
		}

		deferredPrompt.value.prompt()
		const { outcome } = await deferredPrompt.value.userChoice

		if (outcome === "accepted") {
			isInstalled.value = true
			$toast.success("App installed!")
		}

		deferredPrompt.value = null
	}

	/**
	 * Add to sync queue for offline support
	 */
	const queueForSync = (action: string, data: unknown) => {
		const item = {
			id: crypto.randomUUID(),
			action,
			data,
			timestamp: new Date().toISOString(),
		}

		syncQueue.value.push(item)

		// Store in localStorage for persistence
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("sync-queue", JSON.stringify(syncQueue.value))
		}
	}

	/**
	 * Process sync queue when back online
	 */
	const processSyncQueue = async () => {
		if (!isOnline.value || syncQueue.value.length === 0) return

		const queue = [...syncQueue.value]
		syncQueue.value = []

		for (const item of queue) {
			try {
				await useFetch("/api/sync", {
					method: "POST",
					body: item,
				})
			} catch {
				// Re-queue on failure
				syncQueue.value.push(item)
			}
		}

		if (syncQueue.value.length === 0) {
			$toast.success("All changes synced")
		}
	}

	/**
	 * Quick capture for mobile
	 */
	const quickCapture = async (text: string, type: "task" | "note" = "task") => {
		const data = {
			type,
			text,
			createdAt: new Date().toISOString(),
		}

		if (isOnline.value) {
			const { error } = await useFetch("/api/quick-capture", {
				method: "POST",
				body: data,
			})

			if (!error.value) {
				$toast.success("Captured!")
				return true
			}
		}

		// Queue for later if offline
		queueForSync("quick-capture", data)
		$toast.success("Saved for later sync")
		return true
	}

	/**
	 * Request notification permission
	 */
	const requestNotificationPermission = async () => {
		if (!("Notification" in window)) {
			$toast.error("Notifications not supported")
			return false
		}

		const permission = await Notification.requestPermission()
		return permission === "granted"
	}

	/**
	 * Show local notification
	 */
	const showNotification = (title: string, options?: NotificationOptions) => {
		if (!("Notification" in window) || Notification.permission !== "granted") return

		new Notification(title, {
			icon: "/icon-192x192.png",
			badge: "/icon-192x192.png",
			...options,
		})
	}

	/**
	 * Get battery level (mobile)
	 */
	const getBatteryLevel = async (): Promise<number | null> => {
		if (!("getBattery" in navigator)) return null

		try {
			const battery = await (navigator as Navigator & { getBattery(): Promise<{ level: number }> }).getBattery()
			return battery.level
		} catch {
			return null
		}
	}

	return {
		isInstalled,
		isOnline,
		deferredPrompt,
		syncQueue,
		init,
		install,
		queueForSync,
		processSyncQueue,
		quickCapture,
		requestNotificationPermission,
		showNotification,
		getBatteryLevel,
	}
}

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}
