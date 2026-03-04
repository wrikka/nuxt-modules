import { reactive, readonly, computed, ref } from "vue";

export interface TrackedObject {
	id: string;
	type: "face" | "object" | "motion";
	bbox: { x: number; y: number; width: number; height: number };
	confidence: number;
	trail: Array<{ x: number; y: number; timestamp: number }>;
}

export interface MotionTrackingState {
	isActive: boolean;
	trackedObjects: TrackedObject[];
	faceDetectorLoaded: boolean;
	objectDetectorLoaded: boolean;
	showTrails: boolean;
	trailLength: number;
}

export const useMotionTracking = () => {
	const state = reactive<MotionTrackingState>({
		isActive: false,
		trackedObjects: [],
		faceDetectorLoaded: false,
		objectDetectorLoaded: false,
		showTrails: true,
		trailLength: 30,
	});

	let videoElement: HTMLVideoElement | null = null;
	let canvasElement: HTMLCanvasElement | null = null;
	let animationFrame: number | null = null;
	let faceDetector: FaceDetector | null = null;

	interface FaceDetector {
		detect: (video: HTMLVideoElement) => Promise<Array<{ boundingBox: DOMRect }>>;
	}

	const initialize = async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
		videoElement = video;
		canvasElement = canvas;

		// Check for Face Detection API
		if ("FaceDetector" in window) {
			try {
				faceDetector = new (window as unknown as { FaceDetector: new () => FaceDetector }).FaceDetector();
				state.faceDetectorLoaded = true;
			} catch {
				state.faceDetectorLoaded = false;
			}
		}

		return true;
	};

	const start = () => {
		if (!videoElement || !canvasElement) return;
		state.isActive = true;
		track();
	};

	const stop = () => {
		state.isActive = false;
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
		state.trackedObjects = [];
	};

	const track = async () => {
		if (!state.isActive || !videoElement || !canvasElement) return;

		const ctx = canvasElement.getContext("2d")!;
		const width = canvasElement.width;
		const height = canvasElement.height;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Detect faces
		if (faceDetector && state.faceDetectorLoaded) {
			try {
				const faces = await faceDetector.detect(videoElement);

				// Update tracked objects
				state.trackedObjects = faces.map((face, index) => {
					const id = `face-${index}`;
					const existing = state.trackedObjects.find(o => o.id === id);

					const bbox = {
						x: face.boundingBox.x,
						y: face.boundingBox.y,
						width: face.boundingBox.width,
						height: face.boundingBox.height,
					};

					const trail = existing?.trail || [];
					trail.push({
						x: bbox.x + bbox.width / 2,
						y: bbox.y + bbox.height / 2,
						timestamp: Date.now(),
					});

					// Limit trail length
					if (trail.length > state.trailLength) {
						trail.shift();
					}

					return {
						id,
						type: "face" as const,
						bbox,
						confidence: 0.9,
						trail,
					};
				});

				// Draw tracking overlays
				drawTracking(ctx, state.trackedObjects);
			} catch {
				// Detection failed
			}
		}

		animationFrame = requestAnimationFrame(track);
	};

	const drawTracking = (ctx: CanvasRenderingContext2D, objects: TrackedObject[]) => {
		objects.forEach(obj => {
			// Draw bounding box
			ctx.strokeStyle = obj.type === "face" ? "#00ff00" : "#ffff00";
			ctx.lineWidth = 3;
			ctx.strokeRect(obj.bbox.x, obj.bbox.y, obj.bbox.width, obj.bbox.height);

			// Draw label
			ctx.fillStyle = obj.type === "face" ? "#00ff00" : "#ffff00";
			ctx.font = "14px Arial";
			ctx.fillText(`${obj.type} (${Math.round(obj.confidence * 100)}%)`, obj.bbox.x, obj.bbox.y - 5);

			// Draw trail
			if (state.showTrails && obj.trail.length > 1) {
				ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(obj.trail[0].x, obj.trail[0].y);

				for (let i = 1; i < obj.trail.length; i++) {
					ctx.lineTo(obj.trail[i].x, obj.trail[i].y);
				}

				ctx.stroke();
			}
		});
	};

	const toggleTrails = () => {
		state.showTrails = !state.showTrails;
	};

	const setTrailLength = (length: number) => {
		state.trailLength = Math.max(10, Math.min(100, length));
	};

	const getTrackedObjectAt = (x: number, y: number): TrackedObject | undefined => {
		return state.trackedObjects.find(obj =>
			x >= obj.bbox.x &&
			x <= obj.bbox.x + obj.bbox.width &&
			y >= obj.bbox.y &&
			y <= obj.bbox.y + obj.bbox.height
		);
	};

	onUnmounted(() => {
		stop();
	});

	return {
		state: readonly(state),
		trackedObjects: computed(() => state.trackedObjects),
		initialize,
		start,
		stop,
		toggleTrails,
		setTrailLength,
		getTrackedObjectAt,
	};
};
