import { reactive, readonly, computed } from "vue";

export interface ThreeSixtyRecordingState {
	isSupported: boolean;
	isRecording: boolean;
	cameraPositions: { x: number; y: number; z: number; rx: number; ry: number; rz: number }[];
	currentView: number;
	stitchedFrame?: string;
}

export const useThreeSixtyRecording = () => {
	const state = reactive<ThreeSixtyRecordingState>({
		isSupported: false,
		isRecording: false,
		cameraPositions: [],
		currentView: 0,
	});

	let mediaRecorders: MediaRecorder[] = [];
	let streams: MediaStream[] = [];
	let recordedChunks: Blob[][] = [];

	const checkSupport = (): boolean => {
		// 360 recording requires multiple cameras or specialized hardware
		// For browser-based, we simulate with multiple getDisplayMedia calls
		state.isSupported = typeof navigator.mediaDevices !== "undefined" &&
			"getDisplayMedia" in navigator.mediaDevices;
		return state.isSupported;
	};

	const setupCameraPositions = () => {
		// Define 6 camera positions for a cubic 360 view
		state.cameraPositions = [
			{ x: 0, y: 0, z: 1, rx: 0, ry: 0, rz: 0 },      // Front
			{ x: 0, y: 0, z: -1, rx: 0, ry: 180, rz: 0 },  // Back
			{ x: -1, y: 0, z: 0, rx: 0, ry: -90, rz: 0 },  // Left
			{ x: 1, y: 0, z: 0, rx: 0, ry: 90, rz: 0 },    // Right
			{ x: 0, y: 1, z: 0, rx: -90, ry: 0, rz: 0 },   // Top
			{ x: 0, y: -1, z: 0, rx: 90, ry: 0, rz: 0 },   // Bottom
		];
	};

	const startRecording360 = async (): Promise<boolean> => {
		if (!state.isSupported) return false;

		try {
			setupCameraPositions();
			state.isRecording = true;
			state.currentView = 0;

			// Get display media for the first view
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: { width: 1920, height: 1080 },
				audio: true,
			});

			streams.push(stream);

			const recorder = new MediaRecorder(stream);
			const chunks: Blob[] = [];

			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunks.push(e.data);
				}
			};

			recorder.start();
			mediaRecorders.push(recorder);
			recordedChunks.push(chunks);

			return true;
		} catch {
			return false;
		}
	};

	const stopRecording360 = async (): Promise<Blob | null> => {
		state.isRecording = false;

		return new Promise((resolve) => {
			const recorder = mediaRecorders[0];
			if (!recorder) {
				resolve(null);
				return;
			}

			recorder.onstop = () => {
				const blob = new Blob(recordedChunks[0], { type: "video/webm" });

				// Cleanup
				streams.forEach(s => s.getTracks().forEach(t => t.stop()));
				mediaRecorders = [];
				streams = [];
				recordedChunks = [];

				resolve(blob);
			};

			recorder.stop();
		});
	};

	const switchView = (viewIndex: number) => {
		if (viewIndex >= 0 && viewIndex < state.cameraPositions.length) {
			state.currentView = viewIndex;
		}
	};

	const nextView = () => {
		state.currentView = (state.currentView + 1) % state.cameraPositions.length;
	};

	const previousView = () => {
		state.currentView = (state.currentView - 1 + state.cameraPositions.length) % state.cameraPositions.length;
	};

	const generateStitchedPreview = async (blobs: Blob[]): Promise<string | null> => {
		// In production, this would use a 360 stitching algorithm
		// For now, return a placeholder
		if (blobs.length === 0) return null;

		const url = URL.createObjectURL(blobs[0]);
		state.stitchedFrame = url;
		return url;
	};

	onMounted(() => {
		checkSupport();
	});

	return {
		state: readonly(state),
		checkSupport,
		setupCameraPositions,
		startRecording360,
		stopRecording360,
		switchView,
		nextView,
		previousView,
		generateStitchedPreview,
	};
};
