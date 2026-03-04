export interface MobileCapabilities {
	supportsRecording: boolean;
	supportsScreenCapture: boolean;
	supportsCamera: boolean;
	supportsMicrophone: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
	orientation: "portrait" | "landscape";
	touchEnabled: boolean;
	batteryLevel?: number;
	isCharging?: boolean;
	availableStorage?: number;
}

export interface MobileState {
	isMobile: boolean;
	capabilities: MobileCapabilities;
	isRecording: boolean;
	recordingQuality: "low" | "medium" | "high";
	optimizeForMobile: boolean;
}

export const useMobileSupport = () => {
	const state = reactive<MobileState>({
		isMobile: false,
		capabilities: {
			supportsRecording: false,
			supportsScreenCapture: false,
			supportsCamera: false,
			supportsMicrophone: false,
			isLandscape: false,
			isPortrait: true,
			orientation: "portrait",
			touchEnabled: false,
		},
		isRecording: false,
		recordingQuality: "medium",
		optimizeForMobile: true,
	});

	const detectMobile = (): boolean => {
		const userAgent = navigator.userAgent.toLowerCase();
		const mobileKeywords = [
			"android", "webos", "iphone", "ipad", "ipod",
			"blackberry", "windows phone", "iemobile", "opera mini",
		];
		return mobileKeywords.some(keyword => userAgent.includes(keyword));
	};

	const checkCapabilities = async (): Promise<MobileCapabilities> => {
		const capabilities: MobileCapabilities = {
			supportsRecording: typeof MediaRecorder !== "undefined",
			supportsScreenCapture: "getDisplayMedia" in navigator.mediaDevices,
			supportsCamera: "getUserMedia" in navigator.mediaDevices,
			supportsMicrophone: "getUserMedia" in navigator.mediaDevices,
			isLandscape: window.innerWidth > window.innerHeight,
			isPortrait: window.innerHeight > window.innerWidth,
			orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
			touchEnabled: "ontouchstart" in window || navigator.maxTouchPoints > 0,
		};

		// Check battery status
		if ("getBattery" in navigator) {
			try {
				const battery = await (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean }> }).getBattery();
				capabilities.batteryLevel = battery.level * 100;
				capabilities.isCharging = battery.charging;
			} catch {
				// Battery API not available
			}
		}

		// Check storage
		if ("storage" in navigator && "estimate" in navigator.storage) {
			try {
				const estimate = await navigator.storage.estimate();
				if (estimate.usage && estimate.quota) {
					capabilities.availableStorage = estimate.quota - estimate.usage;
				}
			} catch {
				// Storage API not available
			}
		}

		return capabilities;
	};

	const initialize = async () => {
		state.isMobile = detectMobile();
		state.capabilities = await checkCapabilities();

		// Set up orientation listener
		window.addEventListener("orientationchange", handleOrientationChange);
		window.addEventListener("resize", handleOrientationChange);
	};

	const handleOrientationChange = () => {
		const isLandscape = window.innerWidth > window.innerHeight;
		state.capabilities.isLandscape = isLandscape;
		state.capabilities.isPortrait = !isLandscape;
		state.capabilities.orientation = isLandscape ? "landscape" : "portrait";
	};

	const getOptimizedSettings = () => {
		const quality = state.recordingQuality;
		
		switch (quality) {
			case "low":
				return {
					video: { width: 640, height: 360, frameRate: 24 },
					audio: { sampleRate: 22050, channels: 1 },
					bitrate: 500000,
				};
			case "high":
				return {
					video: { width: 1920, height: 1080, frameRate: 30 },
					audio: { sampleRate: 48000, channels: 2 },
					bitrate: 2500000,
				};
			default: // medium
				return {
					video: { width: 1280, height: 720, frameRate: 30 },
					audio: { sampleRate: 44100, channels: 2 },
					bitrate: 1500000,
				};
		}
	};

	const checkBatteryBeforeRecording = async (): Promise<boolean> => {
		if (!state.capabilities.batteryLevel) return true;
		
		// แจ้งเตือนถ้า battery ต่ำกว่า 20% และไม่ได้ชาร์จ
		if (state.capabilities.batteryLevel < 20 && !state.capabilities.isCharging) {
			return confirm("Battery is low. Continue recording?");
		}
		
		return true;
	};

	const checkStorageBeforeRecording = async (estimatedSizeMB: number): Promise<boolean> => {
		if (!state.capabilities.availableStorage) return true;
		
		const availableMB = state.capabilities.availableStorage / (1024 * 1024);
		
		if (availableMB < estimatedSizeMB) {
			alert(`Not enough storage. Need ${estimatedSizeMB}MB but only ${Math.floor(availableMB)}MB available.`);
			return false;
		}
		
		return true;
	};

	const setRecordingQuality = (quality: "low" | "medium" | "high") => {
		state.recordingQuality = quality;
	};

	const enableMobileOptimization = () => {
		state.optimizeForMobile = true;
	};

	const disableMobileOptimization = () => {
		state.optimizeForMobile = false;
	};

	// Touch gesture handlers
	const setupTouchControls = (element: HTMLElement, handlers: {
		onDoubleTap?: () => void;
		onLongPress?: () => void;
		onSwipeLeft?: () => void;
		onSwipeRight?: () => void;
	}) => {
		let touchStartX = 0;
		let touchStartY = 0;
		let touchStartTime = 0;
		let longPressTimer: ReturnType<typeof setTimeout> | null = null;

		const onTouchStart = (e: TouchEvent) => {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchStartTime = Date.now();

			if (handlers.onLongPress) {
				longPressTimer = setTimeout(() => {
					handlers.onLongPress?.();
				}, 500);
			}
		};

		const onTouchMove = () => {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
			}
		};

		const onTouchEnd = (e: TouchEvent) => {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
			}

			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const touchDuration = Date.now() - touchStartTime;
			const deltaX = touchEndX - touchStartX;
			const deltaY = touchEndY - touchStartY;

			// Double tap detection
			if (touchDuration < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
				handlers.onDoubleTap?.();
			}

			// Swipe detection
			if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
				if (deltaX > 0) {
					handlers.onSwipeRight?.();
				} else {
					handlers.onSwipeLeft?.();
				}
			}
		};

		element.addEventListener("touchstart", onTouchStart, { passive: true });
		element.addEventListener("touchmove", onTouchMove, { passive: true });
		element.addEventListener("touchend", onTouchEnd);

		return () => {
			element.removeEventListener("touchstart", onTouchStart);
			element.removeEventListener("touchmove", onTouchMove);
			element.removeEventListener("touchend", onTouchEnd);
		};
	};

	onMounted(() => {
		initialize();
	});

	onUnmounted(() => {
		window.removeEventListener("orientationchange", handleOrientationChange);
		window.removeEventListener("resize", handleOrientationChange);
	});

	return {
		state: readonly(state),
		isMobile: computed(() => state.isMobile),
		capabilities: computed(() => state.capabilities),
		initialize,
		getOptimizedSettings,
		checkBatteryBeforeRecording,
		checkStorageBeforeRecording,
		setRecordingQuality,
		enableMobileOptimization,
		disableMobileOptimization,
		setupTouchControls,
	};
};
