import { reactive, readonly, computed } from "vue";

export interface VideoVersion {
	id: string;
	name: string;
	blob: Blob;
	url: string;
	createdAt: number;
	notes?: string;
}

export interface VideoComparisonState {
	versions: VideoVersion[];
	selectedVersionIds: [string?, string?];
	isComparing: boolean;
	syncPlayback: boolean;
	showDifferences: boolean;
	diffThreshold: number;
}

export const useVideoComparison = () => {
	const state = reactive<VideoComparisonState>({
		versions: [],
		selectedVersionIds: [],
		isComparing: false,
		syncPlayback: true,
		showDifferences: false,
		diffThreshold: 0.1,
	});

	let video1Element: HTMLVideoElement | null = null;
	let video2Element: HTMLVideoElement | null = null;

	const addVersion = (name: string, blob: Blob, notes?: string): string => {
		const id = `version-${Date.now()}`;
		const version: VideoVersion = {
			id,
			name,
			blob,
			url: URL.createObjectURL(blob),
			createdAt: Date.now(),
			notes,
		};
		state.versions.push(version);
		return id;
	};

	const removeVersion = (id: string) => {
		const version = state.versions.find(v => v.id === id);
		if (version) {
			URL.revokeObjectURL(version.url);
			state.versions = state.versions.filter(v => v.id !== id);

			// Remove from selection if selected
			state.selectedVersionIds = state.selectedVersionIds.filter(sid => sid !== id) as [string?, string?];
		}
	};

	const selectVersionForComparison = (versionId: string, position: 0 | 1) => {
		state.selectedVersionIds[position] = versionId;
	};

	const startComparison = (video1: HTMLVideoElement, video2: HTMLVideoElement): boolean => {
		if (state.selectedVersionIds.length < 2) return false;

		video1Element = video1;
		video2Element = video2;
		state.isComparing = true;

		// Setup sync playback
		if (state.syncPlayback) {
			video1.addEventListener("play", () => video2.play());
			video1.addEventListener("pause", () => video2.pause());
			video1.addEventListener("seeked", () => {
				video2.currentTime = video1.currentTime;
			});
		}

		return true;
	};

	const stopComparison = () => {
		state.isComparing = false;
		video1Element = null;
		video2Element = null;
	};

	const toggleSyncPlayback = () => {
		state.syncPlayback = !state.syncPlayback;
	};

	const toggleShowDifferences = () => {
		state.showDifferences = !state.showDifferences;
	};

	const setDiffThreshold = (threshold: number) => {
		state.diffThreshold = Math.max(0.01, Math.min(1, threshold));
	};

	const compareFrames = async (time: number): Promise<number> => {
		if (!video1Element || !video2Element) return 0;

		video1Element.currentTime = time;
		video2Element.currentTime = time;

		await new Promise<void>((resolve) => {
			video1Element!.onseeked = () => resolve();
		});

		const canvas1 = document.createElement("canvas");
		const canvas2 = document.createElement("canvas");
		const ctx1 = canvas1.getContext("2d")!;
		const ctx2 = canvas2.getContext("2d")!;

		canvas1.width = video1Element.videoWidth;
		canvas1.height = video1Element.videoHeight;
		canvas2.width = video2Element.videoWidth;
		canvas2.height = video2Element.videoHeight;

		ctx1.drawImage(video1Element, 0, 0);
		ctx2.drawImage(video2Element, 0, 0);

		const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height).data;
		const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data;

		let diff = 0;
		const minLength = Math.min(data1.length, data2.length);

		for (let i = 0; i < minLength; i += 4) {
			diff += Math.abs(data1[i] - data2[i]);
			diff += Math.abs(data1[i + 1] - data2[i + 1]);
			diff += Math.abs(data1[i + 2] - data2[i + 2]);
		}

		return diff / (minLength * 255 / 4);
	};

	const exportComparisonReport = async (): Promise<string> => {
		const report = {
			versions: state.versions.map(v => ({
				id: v.id,
				name: v.name,
				createdAt: v.createdAt,
				size: v.blob.size,
				notes: v.notes,
			})),
			compared: state.selectedVersionIds,
			syncPlayback: state.syncPlayback,
			showDifferences: state.showDifferences,
			generatedAt: new Date().toISOString(),
		};

		return JSON.stringify(report, null, 2);
	};

	const selectedVersions = computed(() => {
		return state.selectedVersionIds
			.map(id => state.versions.find(v => v.id === id))
			.filter(Boolean) as VideoVersion[];
	});

	return {
		state: readonly(state),
		selectedVersions,
		addVersion,
		removeVersion,
		selectVersionForComparison,
		startComparison,
		stopComparison,
		toggleSyncPlayback,
		toggleShowDifferences,
		setDiffThreshold,
		compareFrames,
		exportComparisonReport,
	};
};
