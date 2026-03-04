import type {
	AudioClip,
	AudioTrack,
} from "#shared/types/audio";
import * as Tone from "tone";
import { computed, onUnmounted } from "vue";
import { useAudioEffects } from "./useAudioEffects";
import { useAudioHistory } from "./useAudioHistory";
import { useAudioPlayback } from "./useAudioPlayback";
import { useAudioProject } from "./useAudioProject";
import { useAudioRecording } from "./useAudioRecording";
import { useAudioTracks } from "./useAudioTracks";
import { useMediaBunny } from "./useMediaBunny";

export const useAudioEditor = () => {
	// Playback
	const playback = useAudioPlayback({
		onPlayStateChange: (isPlaying) => {
			// Handle play state change if needed
		},
	});

	// Tracks & Clips
	const tracksManager = useAudioTracks({
		onTrackChange: () => {
			// Track change callback
		},
		onClipChange: () => {
			// Clip change callback
		},
	});

	// Effects
	const effects = useAudioEffects();

	// History
	const history = useAudioHistory();

	// Project
	const project = useAudioProject({
		onProjectChange: () => {
			// Project change callback
		},
	});

	// Recording
	const recording = useAudioRecording();

	// Media Bunny for export
	const { exportAudio: exportAudioWithMediaBunny } = useMediaBunny();

	// Computed selected clip/track
	const selectedClip = computed(() => tracksManager.selectedClip.value);
	const selectedTrack = computed(() => tracksManager.selectedTrack.value);

	// Playback controls
	const play = async () => {
		await playback.play();
	};

	const pause = () => {
		playback.pause();
	};

	const stop = () => {
		playback.stop();
	};

	const seek = (time: number) => {
		playback.seek(time);
	};

	// Multi-track playback with Tone.js
	const playMultiTrack = async () => {
		await playback.initializeAudio();

		if (playback.isPlaying.value) {
			pause();
			return;
		}

		Tone.Transport.start();
		playback.isPlaying.value = true;

		Tone.Transport.scheduleRepeat((_time) => {
			playback.currentTime.value = Tone.Transport.seconds;
		}, 0.1);
	};

	const pauseMultiTrack = () => {
		Tone.Transport.pause();
		playback.isPlaying.value = false;
	};

	const stopMultiTrack = () => {
		Tone.Transport.stop();
		playback.isPlaying.value = false;
		playback.currentTime.value = 0;
	};

	const seekMultiTrack = (time: number) => {
		Tone.Transport.seconds = time;
		playback.currentTime.value = time;
	};

	// Track & Clip operations
	const createTrack = (name?: string) => {
		const track = tracksManager.createTrack(name);
		history.addTrackAction(track);
		return track;
	};

	const addClipToTrack = async (file: File, trackId: string) => {
		const clip = await tracksManager.addClipToTrack(file, trackId);
		if (clip) {
			history.addClipAction(clip, trackId);
		}
		return clip;
	};

	const removeClip = (clipId: string, trackId: string) => {
		const track = tracksManager.tracks.value.find((t) => t.id === trackId);
		if (!track) return;
		const clipIndex = track.clips.findIndex((c) => c.id === clipId);
		const clip = tracksManager.removeClip(clipId, trackId);
		if (clip) {
			history.removeClipAction(clip, trackId, clipIndex);
		}
	};

	const updateClip = (clipId: string, updates: Partial<AudioClip>) => {
		for (const track of tracksManager.tracks.value) {
			const clip = track.clips.find((c) => c.id === clipId);
			if (clip) {
				const previousData: Partial<AudioClip> = {
					volume: clip.volume,
					startTime: clip.startTime,
					endTime: clip.endTime,
					offset: clip.offset,
					fadeIn: clip.fadeIn,
					fadeOut: clip.fadeOut,
					effects: { ...clip.effects },
				};
				tracksManager.updateClip(clipId, updates);
				history.updateClipAction(clipId, track.id, updates, previousData);
				break;
			}
		}
	};

	const applyEffects = (clip: AudioClip) => {
		effects.applyEffects(clip.effects);
	};

	// Export
	const exportAudio = async (format: "wav" | "mp3" = "wav"): Promise<Blob> => {
		if (!playback.audioBuffer.value) {
			throw new Error("No audio loaded");
		}

		const offlineContext = new OfflineAudioContext(
			playback.audioBuffer.value.numberOfChannels,
			playback.audioBuffer.value.length,
			playback.audioBuffer.value.sampleRate,
		);

		const source = offlineContext.createBufferSource();
		source.buffer = playback.audioBuffer.value;

		if (playback.volume.value !== 1) {
			const gainNode = offlineContext.createGain();
			gainNode.gain.value = playback.volume.value;
			source.connect(gainNode);
			gainNode.connect(offlineContext.destination);
		} else {
			source.connect(offlineContext.destination);
		}

		source.start();
		const renderedBuffer = await offlineContext.startRendering();

		return exportAudioWithMediaBunny(renderedBuffer, { format, quality: "high" });
	};

	// Undo/Redo
	const undo = () => {
		const action = history.undo();
		if (!action) return;

		switch (action.type) {
			case "addTrack": {
				tracksManager.tracks.value = tracksManager.tracks.value.filter(
					(t) => t.id !== action.data.track.id,
				);
				break;
			}
			case "removeTrack": {
				tracksManager.tracks.value.splice(action.data.trackIndex, 0, action.data.track);
				break;
			}
			case "addClip": {
				const track = tracksManager.tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips = track.clips.filter((c) => c.id !== action.data.clip.id);
				}
				break;
			}
			case "removeClip": {
				const track = tracksManager.tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips.splice(action.data.clipIndex, 0, action.data.clip);
				}
				break;
			}
			case "updateClip": {
				const track = tracksManager.tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					const clip = track.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						Object.assign(clip, action.data.previousData);
					}
				}
				break;
			}
			case "addMarker": {
				project.markers.value = project.markers.value.filter(
					(m) => m.id !== action.data.marker.id,
				);
				break;
			}
			case "removeMarker": {
				project.markers.value.splice(action.data.markerIndex, 0, action.data.marker);
				break;
			}
			case "addRegion": {
				project.regions.value = project.regions.value.filter(
					(r) => r.id !== action.data.region.id,
				);
				break;
			}
			case "removeRegion": {
				project.regions.value.splice(action.data.regionIndex, 0, action.data.region);
				break;
			}
			case "updateSettings": {
				Object.assign(
					{
						masterVolume: project.masterVolume,
						bpm: project.bpm,
						timeSignature: project.timeSignature,
						snapToGrid: project.snapToGrid,
						gridSize: project.gridSize,
					},
					action.data.previousSettings,
				);
				break;
			}
		}
	};

	const redo = () => {
		const action = history.redo();
		if (!action) return;

		switch (action.type) {
			case "addTrack": {
				tracksManager.tracks.value.push(action.data.track);
				break;
			}
			case "removeTrack": {
				tracksManager.tracks.value = tracksManager.tracks.value.filter(
					(t) => t.id !== action.data.track.id,
				);
				break;
			}
			case "addClip": {
				const track = tracksManager.tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips.push(action.data.clip);
				}
				break;
			}
			case "removeClip": {
				const track = tracksManager.tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips = track.clips.filter((c: AudioClip) => c.id !== action.data.clipId);
				}
				break;
			}
			case "updateClip": {
				const track = tracksManager.tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					const clip = track.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						Object.assign(clip, action.data.updates);
					}
				}
				break;
			}
			case "addMarker": {
				project.markers.value.push(action.data.marker);
				break;
			}
			case "removeMarker": {
				project.markers.value = project.markers.value.filter(
					(m: { id: string }) => m.id !== action.data.marker.id,
				);
				break;
			}
			case "addRegion": {
				project.regions.value.push(action.data.region);
				break;
			}
			case "removeRegion": {
				project.regions.value = project.regions.value.filter(
					(r: { id: string }) => r.id !== action.data.region.id,
				);
				break;
			}
			case "updateSettings": {
				Object.assign(
					{
						masterVolume: project.masterVolume,
						bpm: project.bpm,
						timeSignature: project.timeSignature,
						snapToGrid: project.snapToGrid,
						gridSize: project.gridSize,
					},
					action.data.settings,
				);
				break;
			}
		}
	};

	// Markers
	const addMarker = (name: string, time: number) => {
		const marker = project.addMarker(name, time);
		history.addMarkerAction(marker);
		return marker;
	};

	const removeMarker = (markerId: string) => {
		const markerIndex = project.markers.value.findIndex((m) => m.id === markerId);
		const marker = project.markers.value.find((m) => m.id === markerId);
		if (marker && project.removeMarker(markerId)) {
			history.removeMarkerAction(marker, markerIndex);
		}
	};

	// Regions
	const addRegion = (name: string, startTime: number, endTime: number) => {
		const region = project.addRegion(name, startTime, endTime);
		history.addRegionAction(region);
		return region;
	};

	const removeRegion = (regionId: string) => {
		const regionIndex = project.regions.value.findIndex((r) => r.id === regionId);
		const region = project.regions.value.find((r) => r.id === regionId);
		if (region && project.removeRegion(regionId)) {
			history.removeRegionAction(region, regionIndex);
		}
	};

	// Recording
	const startRecording = async (trackId: string) => {
		await recording.startRecording(trackId, project.bpm.value);
	};

	const stopRecording = async () => {
		return await recording.stopRecording();
	};

	// Project
	const saveProject = () => {
		return project.saveProject(tracksManager.tracks.value);
	};

	const loadProject = (proj: { tracks: AudioTrack[]; markers: unknown[]; regions: unknown[]; masterVolume: number; bpm: number; timeSignature: { numerator: number; denominator: number }; snapToGrid: boolean; gridSize: number }) => {
		project.loadProject(proj as any, (tracks) => {
			tracksManager.tracks.value = tracks as AudioTrack[];
		});
		tracksManager.selectedClipId.value = null;
		tracksManager.selectedTrackId.value = null;
	};

	const loadProjectFromStorage = () => {
		const proj = project.loadProjectFromStorage();
		if (proj) {
			loadProject(proj);
		}
		return proj;
	};

	const exportProject = () => {
		project.exportProject(tracksManager.tracks.value);
	};

	const importProject = async (file: File) => {
		const proj = await project.importProject(file);
		if (proj) {
			loadProject(proj);
		}
		return proj;
	};

	// BPM & Settings
	const setBPM = (newBPM: number) => {
		const previousBPM = project.bpm.value;
		project.setBPM(newBPM);
		history.updateSettingsAction({ bpm: newBPM }, { bpm: previousBPM });
	};

	const setTimeSignature = (numerator: number, denominator: number) => {
		const previousTimeSignature = { ...project.timeSignature.value };
		project.setTimeSignature(numerator, denominator);
		history.updateSettingsAction(
			{ timeSignature: { numerator, denominator } },
			{ timeSignature: previousTimeSignature },
		);
	};

	const toggleSnapToGrid = () => {
		const previousSnapToGrid = project.snapToGrid.value;
		project.toggleSnapToGrid();
		history.updateSettingsAction(
			{ snapToGrid: project.snapToGrid.value },
			{ snapToGrid: previousSnapToGrid },
		);
	};

	const setGridSize = (newGridSize: number) => {
		const previousGridSize = project.gridSize.value;
		project.setGridSize(newGridSize);
		history.updateSettingsAction({ gridSize: newGridSize }, { gridSize: previousGridSize });
	};

	// Cleanup
	onUnmounted(() => {
		playback.wavesurfer.value?.destroy();
		effects.dispose?.();
		recording.dispose();
	});

	return {
		// Playback
		audioContext: playback.audioContext,
		wavesurfer: playback.wavesurfer,
		audioBuffer: playback.audioBuffer,
		isPlaying: playback.isPlaying,
		currentTime: playback.currentTime,
		duration: playback.duration,
		volume: playback.volume,
		isLooping: playback.isLooping,
		zoomLevel: playback.zoomLevel,
		initializeAudio: playback.initializeAudio,
		loadAudioFile: playback.loadAudioFile,
		play,
		pause,
		stop,
		seek,
		setVolume: playback.setVolume,
		setZoom: playback.setZoom,
		toggleLoop: playback.toggleLoop,
		formatTime: playback.formatTime,

		// Tracks
		tracks: tracksManager.tracks,
		selectedClipId: tracksManager.selectedClipId,
		selectedTrackId: tracksManager.selectedTrackId,
		selectedClip,
		selectedTrack,
		clipboard: tracksManager.clipboard,
		createTrack,
		addClipToTrack,
		removeClip,
		updateClip,
		copyClip: tracksManager.copyClip,
		pasteClip: tracksManager.pasteClip,
		cutClip: tracksManager.cutClip,
		deleteClip: tracksManager.deleteClip,
		selectClip: tracksManager.selectClip,

		// Effects
		applyEffects,
		exportAudio,

		// History
		canUndo: computed(() => history.canUndo.value),
		canRedo: computed(() => history.canRedo.value),
		undo,
		redo,

		// Markers & Regions
		markers: project.markers,
		regions: project.regions,
		addMarker,
		removeMarker,
		addRegion,
		removeRegion,

		// Recording
		recordingState: recording.recordingState,
		metronomeSettings: recording.metronomeSettings,
		startRecording,
		stopRecording,
		startMetronome: () => recording.startMetronome(project.bpm.value),
		stopMetronome: recording.stopMetronome,

		// Project
		masterVolume: project.masterVolume,
		bpm: project.bpm,
		timeSignature: project.timeSignature,
		snapToGrid: project.snapToGrid,
		gridSize: project.gridSize,
		saveProject,
		loadProject,
		loadProjectFromStorage,
		exportProject,
		importProject,
		setBPM,
		setTimeSignature,
		toggleSnapToGrid,
		setGridSize,
		snapToGridValue: project.snapToGridValue,

		// Multi-track playback
		playMultiTrack,
		pauseMultiTrack,
		stopMultiTrack,
		seekMultiTrack,
	};
};
