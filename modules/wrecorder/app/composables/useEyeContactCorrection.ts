export interface EyeContactState {
	isActive: boolean;
	isProcessing: boolean;
	faceDetected: boolean;
	gazeDirection: { x: number; y: number };
	correctionStrength: number;
	webcamElement?: HTMLVideoElement;
	outputCanvas?: HTMLCanvasElement;
}

export const useEyeContactCorrection = () => {
	const state = reactive<EyeContactState>({
		isActive: false,
		isProcessing: false,
		faceDetected: false,
		gazeDirection: { x: 0, y: 0 },
		correctionStrength: 0.5,
	});

	let animationFrame: number | null = null;
	let faceDetector: FaceDetector | null = null;

	interface FaceDetector {
		detectFaces: (video: HTMLVideoElement) => Promise<Array<{ boundingBox: DOMRect; landmarks: Array<{ x: number; y: number }> }>>;
	}

	const initialize = async (webcam: HTMLVideoElement, canvas: HTMLCanvasElement) => {
		state.webcamElement = webcam;
		state.outputCanvas = canvas;

		// Check for Face Detection API support
		if ("FaceDetector" in window) {
			try {
				faceDetector = new (window as unknown as { FaceDetector: new () => FaceDetector }).FaceDetector();
			} catch {
				// Fallback to simple eye tracking
			}
		}

		return true;
	};

	const detectGaze = async (): Promise<{ x: number; y: number } | null> => {
		if (!state.webcamElement || !faceDetector) return null;

		try {
			const faces = await faceDetector.detectFaces(state.webcamElement);
			if (faces.length === 0) {
				state.faceDetected = false;
				return null;
			}

			state.faceDetected = true;
			const face = faces[0];

			// Use eye landmarks if available
			const leftEye = face.landmarks?.find((_, i) => i === 0);
			const rightEye = face.landmarks?.find((_, i) => i === 1);

			if (leftEye && rightEye) {
				const gazeX = (leftEye.x + rightEye.x) / 2 / state.webcamElement.videoWidth;
				const gazeY = (leftEye.y + rightEye.y) / 2 / state.webcamElement.videoHeight;
				return { x: gazeX, y: gazeY };
			}

			return null;
		} catch {
			return null;
		}
	};

	const applyCorrection = () => {
		if (!state.webcamElement || !state.outputCanvas || !state.isActive) return;

		const ctx = state.outputCanvas.getContext("2d")!;
		const width = state.outputCanvas.width;
		const height = state.outputCanvas.height;

		ctx.drawImage(state.webcamElement, 0, 0, width, height);

		if (state.faceDetected) {
			// Apply subtle face transformation to simulate eye contact
			// This is a simplified version - real implementation would use ML models
			const centerX = width / 2;
			const centerY = height / 2;
			const offsetX = (0.5 - state.gazeDirection.x) * state.correctionStrength * 20;
			const offsetY = (0.5 - state.gazeDirection.y) * state.correctionStrength * 10;

			// Draw subtle overlay to simulate gaze correction
			ctx.save();
			ctx.globalAlpha = 0.1 * state.correctionStrength;
			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.ellipse(centerX + offsetX, centerY + offsetY, 50, 60, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	};

	const start = () => {
		if (!state.webcamElement || !state.outputCanvas) return;

		state.isActive = true;

		const process = async () => {
			if (!state.isActive) return;

			state.isProcessing = true;
			const gaze = await detectGaze();
			if (gaze) {
				state.gazeDirection = gaze;
			}
			applyCorrection();
			state.isProcessing = false;

			animationFrame = requestAnimationFrame(process);
		};

		process();
	};

	const stop = () => {
		state.isActive = false;
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	};

	const setCorrectionStrength = (strength: number) => {
		state.correctionStrength = Math.max(0, Math.min(1, strength));
	};

	onUnmounted(() => {
		stop();
	});

	return {
		state: readonly(state),
		initialize,
		start,
		stop,
		setCorrectionStrength,
	};
};
