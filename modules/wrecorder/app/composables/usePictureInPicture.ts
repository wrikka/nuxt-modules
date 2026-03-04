export type PipPosition =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right"
	| "center"
	| "custom";

export interface PipOptions {
	position?: PipPosition;
	customX?: number;
	customY?: number;
	width?: number;
	height?: number;
	borderRadius?: number;
	border?: boolean;
	borderColor?: string;
	shadow?: boolean;
	opacity?: number;
}

export interface PictureInPictureState {
	isActive: boolean;
	isSupported: boolean;
	position: PipPosition;
	x: number;
	y: number;
	width: number;
	height: number;
	isDragging: boolean;
}

export const usePictureInPicture = (options: PipOptions = {}) => {
	const {
		position = "bottom-right",
		width = 240,
		height = 180,
		borderRadius = 12,
		border = true,
		borderColor = "#ffffff",
		shadow = true,
		opacity = 1,
	} = options;

	const state = reactive<PictureInPictureState>({
		isActive: false,
		isSupported: "pictureInPictureEnabled" in document,
		position,
		x: 0,
		y: 0,
		width,
		height,
		isDragging: false,
	});

	const webcamStream = ref<MediaStream | null>(null);
	const webcamVideo = ref<HTMLVideoElement | null>(null);
	const containerRef = ref<HTMLDivElement | null>(null);

	let dragOffset = { x: 0, y: 0 };

	const calculatePosition = (): { x: number; y: number } => {
		const container = containerRef.value;
		if (!container) return { x: 0, y: 0 };

		const parentRect = container.parentElement?.getBoundingClientRect();
		if (!parentRect) return { x: 0, y: 0 };

		const padding = 16;

		switch (state.position) {
			case "top-left":
				return { x: padding, y: padding };
			case "top-right":
				return { x: parentRect.width - width - padding, y: padding };
			case "bottom-left":
				return { x: padding, y: parentRect.height - height - padding };
			case "bottom-right":
				return {
					x: parentRect.width - width - padding,
					y: parentRect.height - height - padding,
				};
			case "center":
				return {
					x: (parentRect.width - width) / 2,
					y: (parentRect.height - height) / 2,
				};
			case "custom":
				return { x: options.customX ?? padding, y: options.customY ?? padding };
			default:
				return { x: padding, y: padding };
		}
	};

	const startWebcam = async (): Promise<void> => {
		try {
			webcamStream.value = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 640 },
					height: { ideal: 480 },
				},
				audio: false,
			});

			if (webcamVideo.value) {
				webcamVideo.value.srcObject = webcamStream.value;
				await webcamVideo.value.play();
			}
		} catch (error) {
			throw new Error(
				`Failed to start webcam: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	const stopWebcam = (): void => {
		if (webcamStream.value) {
			webcamStream.value.getTracks().forEach((track) => track.stop());
			webcamStream.value = null;
		}
		if (webcamVideo.value) {
			webcamVideo.value.srcObject = null;
		}
	};

	const activate = async (): Promise<void> => {
		if (!state.isSupported) {
			throw new Error("Picture-in-Picture is not supported in this browser");
		}

		await startWebcam();

		const pos = calculatePosition();
		state.x = pos.x;
		state.y = pos.y;
		state.isActive = true;
	};

	const deactivate = (): void => {
		stopWebcam();
		state.isActive = false;
	};

	const toggle = async (): Promise<void> => {
		if (state.isActive) {
			deactivate();
		} else {
			await activate();
		}
	};

	const setPosition = (newPosition: PipPosition): void => {
		state.position = newPosition;
		if (state.isActive) {
			const pos = calculatePosition();
			state.x = pos.x;
			state.y = pos.y;
		}
	};

	const startDrag = (event: MouseEvent | TouchEvent): void => {
		if (!containerRef.value) return;

		const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
		const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

		dragOffset = {
			x: clientX - state.x,
			y: clientY - state.y,
		};

		state.isDragging = true;
		state.position = "custom";

		document.addEventListener("mousemove", onDrag);
		document.addEventListener("mouseup", stopDrag);
		document.addEventListener("touchmove", onDrag);
		document.addEventListener("touchend", stopDrag);
	};

	const onDrag = (event: MouseEvent | TouchEvent): void => {
		if (!state.isDragging) return;

		const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
		const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

		const container = containerRef.value?.parentElement;
		if (!container) return;

		const parentRect = container.getBoundingClientRect();

		let newX = clientX - dragOffset.x;
		let newY = clientY - dragOffset.y;

		newX = Math.max(0, Math.min(newX, parentRect.width - state.width));
		newY = Math.max(0, Math.min(newY, parentRect.height - state.height));

		state.x = newX;
		state.y = newY;
	};

	const stopDrag = (): void => {
		state.isDragging = false;
		document.removeEventListener("mousemove", onDrag);
		document.removeEventListener("mouseup", stopDrag);
		document.removeEventListener("touchmove", onDrag);
		document.removeEventListener("touchend", stopDrag);
	};

	const resize = (newWidth: number, newHeight: number): void => {
		state.width = newWidth;
		state.height = newHeight;
	};

	const containerStyle = computed(() => ({
		position: "absolute" as const,
		left: `${state.x}px`,
		top: `${state.y}px`,
		width: `${state.width}px`,
		height: `${state.height}px`,
		borderRadius: `${borderRadius}px`,
		overflow: "hidden" as const,
		border: border ? `2px solid ${borderColor}` : "none",
		boxShadow: shadow
			? "0 4px 20px rgba(0, 0, 0, 0.3)"
			: "none",
		opacity,
		cursor: state.isDragging ? "grabbing" : "grab",
		zIndex: 100,
		backgroundColor: "#000",
	}));

	const videoStyle = computed(() => ({
		width: "100%",
		height: "100%",
		objectFit: "cover" as const,
		borderRadius: `${borderRadius}px`,
		transform: "scaleX(-1)",
	}));

	onUnmounted(() => {
		stopWebcam();
		stopDrag();
	});

	return {
		state,
		webcamStream,
		webcamVideo,
		containerRef,
		containerStyle,
		videoStyle,
		activate,
		deactivate,
		toggle,
		setPosition,
		startDrag,
		resize,
		calculatePosition,
	};
};
