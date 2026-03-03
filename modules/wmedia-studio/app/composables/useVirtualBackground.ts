export const useVirtualBackground = () => {
	const isEnabled = ref(false);
	const backgroundType = ref<"blur" | "color" | "image">("blur");
	const blurAmount = ref(10);
	const backgroundColor = ref("#000000");
	const backgroundImage = ref("");

	const applyVirtualBackground = (
		videoElement: HTMLVideoElement,
		canvasElement: HTMLCanvasElement,
	): void => {
		if (!isEnabled.value) {
			return;
		}

		const ctx = canvasElement.getContext("2d");
		if (!ctx) return;

		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;

		if (backgroundType.value === "blur") {
			ctx.filter = `blur(${blurAmount.value}px)`;
			ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
		} else if (backgroundType.value === "color") {
			ctx.fillStyle = backgroundColor.value;
			ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
			ctx.filter = "none";
			ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
		} else if (backgroundType.value === "image" && backgroundImage.value) {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
				ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
			};
			img.src = backgroundImage.value;
		}
	};

	return {
		isEnabled,
		backgroundType,
		blurAmount,
		backgroundColor,
		backgroundImage,
		applyVirtualBackground,
	};
};
