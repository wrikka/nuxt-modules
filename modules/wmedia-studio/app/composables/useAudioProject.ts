import type { AudioMarker, AudioProject, AudioRegion } from "#shared/types/audio";
import { nanoid } from "nanoid";
import { ref } from "vue";

export interface UseAudioProjectOptions {
	onProjectChange?: () => void;
}

export const useAudioProject = (options: UseAudioProjectOptions = {}) => {
	const markers = ref<AudioMarker[]>([]);
	const regions = ref<AudioRegion[]>([]);
	const masterVolume = ref(1);
	const bpm = ref(120);
	const timeSignature = ref({ numerator: 4, denominator: 4 });
	const snapToGrid = ref(false);
	const gridSize = ref(0.25);

	const projectId = ref<string>(nanoid());
	const projectName = ref<string>("Untitled Project");

	const addMarker = (name: string, time: number): AudioMarker => {
		const marker: AudioMarker = {
			id: nanoid(),
			name,
			time,
			color: `hsl(${Math.random() * 360}, 70%, 50%)`,
		};
		markers.value.push(marker);
		options.onProjectChange?.();
		return marker;
	};

	const removeMarker = (markerId: string): boolean => {
		const index = markers.value.findIndex((m) => m.id === markerId);
		if (index === -1) return false;
		markers.value = markers.value.filter((m) => m.id !== markerId);
		options.onProjectChange?.();
		return true;
	};

	const addRegion = (name: string, startTime: number, endTime: number): AudioRegion => {
		const region: AudioRegion = {
			id: nanoid(),
			name,
			startTime,
			endTime,
			color: `hsl(${Math.random() * 360}, 70%, 50%)`,
		};
		regions.value.push(region);
		options.onProjectChange?.();
		return region;
	};

	const removeRegion = (regionId: string): boolean => {
		const index = regions.value.findIndex((r) => r.id === regionId);
		if (index === -1) return false;
		regions.value = regions.value.filter((r) => r.id !== regionId);
		options.onProjectChange?.();
		return true;
	};

	const saveProject = (tracks: unknown[]): AudioProject => {
		const project: AudioProject = {
			id: projectId.value,
			name: projectName.value,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			tracks: tracks as any[],
			markers: markers.value,
			regions: regions.value,
			masterVolume: masterVolume.value,
			bpm: bpm.value,
			timeSignature: timeSignature.value,
			snapToGrid: snapToGrid.value,
			gridSize: gridSize.value,
		};

		const json = JSON.stringify(project);
		localStorage.setItem("audio-editor-project", json);

		return project;
	};

	const loadProject = (project: AudioProject, setTracks: (tracks: unknown[]) => void) => {
		projectId.value = project.id || nanoid();
		projectName.value = project.name || "Untitled Project";
		setTracks(project.tracks || []);
		markers.value = project.markers || [];
		regions.value = project.regions || [];
		masterVolume.value = project.masterVolume ?? 1;
		bpm.value = project.bpm ?? 120;
		timeSignature.value = project.timeSignature ?? { numerator: 4, denominator: 4 };
		snapToGrid.value = project.snapToGrid ?? false;
		gridSize.value = project.gridSize ?? 0.25;
		options.onProjectChange?.();
	};

	const loadProjectFromStorage = (): AudioProject | null => {
		const json = localStorage.getItem("audio-editor-project");
		if (!json) return null;

		try {
			return JSON.parse(json) as AudioProject;
		} catch {
			return null;
		}
	};

	const exportProject = (tracks: unknown[]) => {
		const project = saveProject(tracks);
		const json = JSON.stringify(project, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${project.name}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const importProject = async (file: File): Promise<AudioProject | null> => {
		try {
			const json = await file.text();
			return JSON.parse(json) as AudioProject;
		} catch {
			return null;
		}
	};

	const setBPM = (newBPM: number) => {
		bpm.value = newBPM;
		options.onProjectChange?.();
	};

	const setTimeSignature = (numerator: number, denominator: number) => {
		timeSignature.value = { numerator, denominator };
		options.onProjectChange?.();
	};

	const toggleSnapToGrid = () => {
		snapToGrid.value = !snapToGrid.value;
		options.onProjectChange?.();
	};

	const setGridSize = (size: number) => {
		gridSize.value = size;
		options.onProjectChange?.();
	};

	const snapToGridValue = (value: number): number => {
		if (!snapToGrid.value) return value;
		return Math.round(value / gridSize.value) * gridSize.value;
	};

	return {
		markers,
		regions,
		masterVolume,
		bpm,
		timeSignature,
		snapToGrid,
		gridSize,
		projectId,
		projectName,
		addMarker,
		removeMarker,
		addRegion,
		removeRegion,
		saveProject,
		loadProject,
		loadProjectFromStorage,
		exportProject,
		importProject,
		setBPM,
		setTimeSignature,
		toggleSnapToGrid,
		setGridSize,
		snapToGridValue,
	};
};
