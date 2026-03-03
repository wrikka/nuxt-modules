import { ref, computed, onMounted, onUnmounted, readonly } from "vue";

/**
 * Device type
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Touch gesture type
 */
export type TouchGesture =
	| "tap"
	| "double-tap"
	| "long-press"
	| "swipe-left"
	| "swipe-right"
	| "swipe-up"
	| "swipe-down"
	| "pinch-in"
	| "pinch-out"
	| "pan";

/**
 * Mobile optimization options
 */
export interface MobileOptions {
	enableTouchGestures?: boolean;
	enablePinchZoom?: boolean;
	enableSwipeNavigation?: boolean;
	responsiveBreakpoints?: {
		mobile: number;
		tablet: number;
		desktop: number;
	};
	touchSensitivity?: number;
	gestureCooldown?: number;
}

/**
 * Mobile gesture event
 */
export interface MobileGestureEvent {
	type: TouchGesture;
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	deltaX: number;
	deltaY: number;
	scale?: number;
	velocity?: number;
	timestamp: number;
}

/**
 * Composable for mobile-specific chart optimizations
 */
export function useChartMobileOptimization(
	elementRef: any,
	options: MobileOptions = {},
) {
	const {
		enableTouchGestures = true,
		enablePinchZoom = true,
		enableSwipeNavigation = true,
		responsiveBreakpoints = {
			mobile: 768,
			tablet: 1024,
			desktop: 9999,
		},
		touchSensitivity = 10,
		gestureCooldown = 300,
	} = options;

	// Device detection
	const deviceType = ref<DeviceType>("desktop");
	const screenWidth = ref(window.innerWidth);
	const screenHeight = ref(window.innerHeight);
	const isMobile = computed(() => deviceType.value === "mobile");
	const isTablet = computed(() => deviceType.value === "tablet");
	const isDesktop = computed(() => deviceType.value === "desktop");

	// Touch state
	const touchStart = ref<{ x: number; y: number; time: number } | null>(null);
	const lastGesture = ref<MobileGestureEvent | null>(null);
	const gestureCooldownTimer = ref<number | null>(null);

	// Responsive state
	const responsiveConfig = computed(() => {
		if (screenWidth.value < responsiveBreakpoints.mobile) {
			return {
				device: "mobile" as DeviceType,
				fontSize: 12,
				padding: 8,
				legendPosition: "bottom" as const,
				showGrid: false,
				maxSeries: 3,
				chartHeight: 200,
			};
		} else if (screenWidth.value < responsiveBreakpoints.tablet) {
			return {
				device: "tablet" as DeviceType,
				fontSize: 14,
				padding: 12,
				legendPosition: "right" as const,
				showGrid: true,
				maxSeries: 5,
				chartHeight: 300,
			};
		} else {
			return {
				device: "desktop" as DeviceType,
				fontSize: 16,
				padding: 16,
				legendPosition: "right" as const,
				showGrid: true,
				maxSeries: 10,
				chartHeight: 400,
			};
		}
	});

	/**
	 * Update device type based on screen size
	 */
	const updateDeviceType = () => {
		screenWidth.value = window.innerWidth;
		screenHeight.value = window.innerHeight;

		if (screenWidth.value < responsiveBreakpoints.mobile) {
			deviceType.value = "mobile";
		} else if (screenWidth.value < responsiveBreakpoints.tablet) {
			deviceType.value = "tablet";
		} else {
			deviceType.value = "desktop";
		}
	};

	/**
	 * Handle touch start
	 */
	const handleTouchStart = (event: TouchEvent) => {
		if (!enableTouchGestures) return;

		const touch = event.touches[0];
		touchStart.value = {
			x: touch.clientX,
			y: touch.clientY,
			time: Date.now(),
		};
	};

	/**
	 * Handle touch move
	 */
	const handleTouchMove = (event: TouchEvent) => {
		if (!enableTouchGestures || !touchStart.value) return;

		event.preventDefault(); // Prevent scrolling

		const touch = event.touches[0];
		const deltaX = touch.clientX - touchStart.value.x;
		const deltaY = touch.clientY - touchStart.value.y;

		// Handle pan gestures for swipe navigation
		if (enableSwipeNavigation && Math.abs(deltaX) > touchSensitivity) {
			const gesture: MobileGestureEvent = {
				type: deltaX > 0 ? "swipe-right" : "swipe-left",
				startX: touchStart.value.x,
				startY: touchStart.value.y,
				endX: touch.clientX,
				endY: touch.clientY,
				deltaX,
				deltaY,
				timestamp: Date.now(),
			};
			emitGesture(gesture);
		}
	};

	/**
	 * Handle touch end
	 */
	const handleTouchEnd = (event: TouchEvent) => {
		if (!enableTouchGestures || !touchStart.value) return;

		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - touchStart.value.x;
		const deltaY = touch.clientY - touchStart.value.y;
		const duration = Date.now() - touchStart.value.time;

		// Determine gesture type
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);
		const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / duration;

		let gestureType: TouchGesture;

		if (
			duration < 300 &&
			absDeltaX < touchSensitivity &&
			absDeltaY < touchSensitivity
		) {
			gestureType = "tap";
		} else if (absDeltaX > absDeltaY) {
			gestureType = deltaX > 0 ? "swipe-right" : "swipe-left";
		} else {
			gestureType = deltaY > 0 ? "swipe-down" : "swipe-up";
		}

		const gesture: MobileGestureEvent = {
			type: gestureType,
			startX: touchStart.value.x,
			startY: touchStart.value.y,
			endX: touch.clientX,
			endY: touch.clientY,
			deltaX,
			deltaY,
			velocity,
			timestamp: Date.now(),
		};

		emitGesture(gesture);
		touchStart.value = null;
	};

	/**
	 * Handle pinch gestures (for zoom)
	 */
	const handleGestureStart = (event: any) => {
		if (!enablePinchZoom) return;
		// Prevent default behavior
		event.preventDefault();
	};

	const handleGestureChange = (event: any) => {
		if (!enablePinchZoom) return;

		const scale = event.scale;
		if (scale > 1.2) {
			emitGesture({
				type: "pinch-out",
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
				deltaX: 0,
				deltaY: 0,
				scale,
				timestamp: Date.now(),
			});
		} else if (scale < 0.8) {
			emitGesture({
				type: "pinch-in",
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
				deltaX: 0,
				deltaY: 0,
				scale,
				timestamp: Date.now(),
			});
		}
	};

	/**
	 * Emit gesture event
	 */
	const emitGesture = (gesture: MobileGestureEvent) => {
		// Prevent rapid-fire gestures
		if (gestureCooldownTimer.value) return;

		lastGesture.value = gesture;

		// Trigger cooldown
		gestureCooldownTimer.value = window.setTimeout(() => {
			gestureCooldownTimer.value = null;
		}, gestureCooldown);

		// Emit event to parent component
		const event = new CustomEvent("chart-gesture", {
			detail: gesture,
			bubbles: true,
		});
		elementRef.value?.dispatchEvent(event);
	};

	/**
	 * Get mobile-optimized chart configuration
	 */
	const getMobileConfig = () => {
		return {
			...responsiveConfig.value,
			// Additional mobile-specific settings
			enableTouch: isMobile.value,
			simplifiedLegend: isMobile.value,
			reducedAnimation: isMobile.value,
			compactTooltips: isMobile.value,
			gestureNavigation: isMobile.value && enableSwipeNavigation,
		};
	};

	/**
	 * Optimize data for mobile display
	 */
	const optimizeDataForMobile = (data: any[]) => {
		if (!isMobile.value) return data;

		// Reduce data points for performance
		const maxPoints = 20;
		if (data.length > maxPoints) {
			const step = Math.floor(data.length / maxPoints);
			return data.filter((_, index) => index % step === 0);
		}

		return data;
	};

	/**
	 * Get touch-friendly interaction hints
	 */
	const getInteractionHints = () => {
		if (!isMobile.value) return [];

		const hints = [
			"Tap to select data points",
			"Swipe to navigate between charts",
		];

		if (enablePinchZoom) {
			hints.push("Pinch to zoom in/out");
		}

		return hints;
	};

	/**
	 * Setup event listeners
	 */
	const setupEventListeners = () => {
		const element = elementRef.value;
		if (!element) return;

		// Touch events
		if (enableTouchGestures) {
			element.addEventListener("touchstart", handleTouchStart, {
				passive: false,
			});
			element.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			element.addEventListener("touchend", handleTouchEnd, { passive: false });
		}

		// Gesture events (for pinch zoom)
		if (enablePinchZoom && "ongesturestart" in window) {
			(element as any).addEventListener("gesturestart", handleGestureStart, {
				passive: false,
			});
			(element as any).addEventListener("gesturechange", handleGestureChange, {
				passive: false,
			});
		}

		// Resize listener
		window.addEventListener("resize", updateDeviceType);
	};

	/**
	 * Cleanup event listeners
	 */
	const cleanupEventListeners = () => {
		const element = elementRef.value;
		if (!element) return;

		element.removeEventListener("touchstart", handleTouchStart);
		element.removeEventListener("touchmove", handleTouchMove);
		element.removeEventListener("touchend", handleTouchEnd);

		if ("ongesturestart" in window) {
			(element as any).removeEventListener("gesturestart", handleGestureStart);
			(element as any).removeEventListener(
				"gesturechange",
				handleGestureChange,
			);
		}

		window.removeEventListener("resize", updateDeviceType);

		if (gestureCooldownTimer.value) {
			clearTimeout(gestureCooldownTimer.value);
		}
	};

	// Initialize
	onMounted(() => {
		updateDeviceType();
		setupEventListeners();
	});

	onUnmounted(() => {
		cleanupEventListeners();
	});

	return {
		// Device detection
		deviceType: readonly(deviceType),
		screenWidth: readonly(screenWidth),
		screenHeight: readonly(screenHeight),
		isMobile,
		isTablet,
		isDesktop,

		// Responsive config
		responsiveConfig,

		// Touch gestures
		lastGesture: readonly(lastGesture),

		// Methods
		getMobileConfig,
		optimizeDataForMobile,
		getInteractionHints,
		setupEventListeners,
		cleanupEventListeners,
	};
}
