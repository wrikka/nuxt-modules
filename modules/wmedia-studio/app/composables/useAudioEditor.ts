import type {
	AudioClip,
	AudioMarker,
	AudioProject,
	AudioRegion,
	AudioTrack,
	AutomationPoint,
	AutomationTrack,
	MetronomeSettings,
	RecordingState,
} from "#shared/types/audio";
import { nanoid } from "nanoid";
import * as Tone from "tone";
import { computed, onUnmounted, ref, watch } from "vue";
import WaveSurfer from "wavesurfer.js";
import { useAudioHistory } from "./useAudioHistory";
import { useMediaBunny } from "./useMediaBunny";

export const useAudioEditor = () => {
	const audioContext = ref<AudioContext | null>(null);
	const wavesurfer = ref<WaveSurfer | null>(null);
	const audioBuffer = ref<AudioBuffer | null>(null);

	const isPlaying = ref(false);
	const currentTime = ref(0);
	const duration = ref(0);
	const volume = ref(1);
	const isLooping = ref(false);
	const zoomLevel = ref(100);

	const tracks = ref<AudioTrack[]>([]);
	const selectedClipId = ref<string | null>(null);
	const selectedTrackId = ref<string | null>(null);

	const player = ref<Tone.Player | null>(null);
	const reverb = ref<Tone.Reverb | null>(null);
	const delay = ref<Tone.FeedbackDelay | null>(null);
	const eq3 = ref<Tone.EQ3 | null>(null);
	const masterVolumeNode = ref<Tone.Volume | null>(null);

	const markers = ref<AudioMarker[]>([]);
	const regions = ref<AudioRegion[]>([]);
	const masterVolume = ref(1);
	const bpm = ref(120);
	const timeSignature = ref({ numerator: 4, denominator: 4 });
	const snapToGrid = ref(false);
	const gridSize = ref(0.25);
	const clipboard = ref<{ clip: AudioClip; trackId: string } | null>(null);
	const automationTracks = ref<AutomationTrack[]>([]);
	const recordingState = ref<RecordingState>({
		isRecording: false,
		startTime: 0,
		trackId: null,
	});
	const metronomeSettings = ref<MetronomeSettings>({
		enabled: false,
		volume: 0.5,
		sound: "click",
	});

	const compressor = ref<Tone.Compressor | null>(null);
	const limiter = ref<Tone.Limiter | null>(null);
	const chorus = ref<Tone.Chorus | null>(null);
	const metronome = ref<Tone.MembraneSynth | null>(null);
	const metronomeLoop = ref<Tone.Loop | null>(null);

	const { exportAudio: exportAudioWithMediaBunny } = useMediaBunny();
	const {
		canUndo,
		canRedo,
		undo: historyUndo,
		redo: historyRedo,
		addTrackAction,
		_removeTrackAction,
		addClipAction,
		removeClipAction,
		updateClipAction,
		_moveClipAction,
		_trimClipAction,
		addMarkerAction,
		removeMarkerAction,
		addRegionAction,
		removeRegionAction,
		updateSettingsAction,
	} = useAudioHistory();

	const selectedClip = computed(() => {
		if (!selectedClipId.value) return null;
		for (const track of tracks.value) {
			const clip = track.clips.find((c) => c.id === selectedClipId.value);
			if (clip) return clip;
		}
		return null;
	});

	const selectedTrack = computed(() => {
		if (!selectedTrackId.value) return null;
		return tracks.value.find((t) => t.id === selectedTrackId.value) || null;
	});

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		const ms = Math.floor((seconds % 1) * 100);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
	};

	const initializeAudio = async () => {
		if (audioContext.value) return;

		audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();
		await Tone.start();

		reverb.value = new Tone.Reverb({ decay: 2, wet: 0 }).toDestination();
		delay.value = new Tone.FeedbackDelay("8n", 0).toDestination();
		eq3.value = new Tone.EQ3({ low: 0, mid: 0, high: 0 }).toDestination();
		compressor.value = new Tone.Compressor({ threshold: -24, ratio: 12 }).toDestination();
		limiter.value = new Tone.Limiter(-1).toDestination();
		chorus.value = new Tone.Chorus({ frequency: 1.5, delayTime: 2.5, depth: 0.5 }).toDestination();

		metronome.value = new Tone.MembraneSynth({
			pitchDecay: 0.05,
			octaves: 10,
			oscillator: { type: "sine" },
			envelope: {
				attack: 0.001,
				decay: 0.4,
				sustain: 0.01,
				release: 1.4,
			},
		}).toDestination();

		masterVolumeNode.value = new Tone.Volume(0).toDestination();
	};

	const loadAudioFile = async (file: File): Promise<void> => {
		await initializeAudio();

		const arrayBuffer = await file.arrayBuffer();
		audioBuffer.value = await audioContext.value!.decodeAudioData(arrayBuffer);
		duration.value = audioBuffer.value.duration;

		if (wavesurfer.value) {
			wavesurfer.value.destroy();
		}

		wavesurfer.value = WaveSurfer.create({
			container: "#waveform",
			waveColor: "#4a9eff",
			progressColor: "#0066cc",
			cursorColor: "#ffffff",
			barWidth: 2,
			barGap: 3,
			barRadius: 3,
			height: 200,
			normalize: true,
			minPxPerSec: zoomLevel.value,
		});

		const blob = new Blob([arrayBuffer], { type: file.type });
		const url = URL.createObjectURL(blob);
		await wavesurfer.value.load(url);

		wavesurfer.value.on("ready", () => {
			duration.value = wavesurfer.value!.getDuration();
		});

		wavesurfer.value.on("audioprocess", () => {
			currentTime.value = wavesurfer.value!.getCurrentTime();
		});

		wavesurfer.value.on("finish", () => {
			isPlaying.value = false;
			if (isLooping.value) {
				void wavesurfer.value!.play();
				isPlaying.value = true;
			}
		});

		if (player.value) {
			player.value.dispose();
		}

		if (player.value && eq3.value) {
			player.value.connect(eq3.value as any);
			player.value.volume.value = Tone.dbToGain(volume.value * 100 - 100);
		}
	};

	const play = async () => {
		await initializeAudio();
		if (wavesurfer.value) {
			void wavesurfer.value.play();
			isPlaying.value = true;
		}
		if (player.value) {
			player.value.start();
		}
	};

	const pause = () => {
		if (wavesurfer.value) {
			wavesurfer.value.pause();
			isPlaying.value = false;
		}
		if (player.value) {
			player.value.stop();
		}
	};

	const stop = () => {
		if (wavesurfer.value) {
			wavesurfer.value.stop();
			isPlaying.value = false;
			currentTime.value = 0;
		}
		if (player.value) {
			player.value.stop();
		}
	};

	const seek = (time: number) => {
		if (wavesurfer.value) {
			wavesurfer.value.seekTo(time / duration.value);
			currentTime.value = time;
		}
	};

	const setVolume = (vol: number) => {
		volume.value = vol;
		if (masterVolumeNode.value) {
			masterVolumeNode.value.volume.value = Tone.dbToGain(vol * 100 - 100);
		}
		if (player.value) {
			player.value.volume.value = Tone.dbToGain(vol * 100 - 100);
		}
	};

	const setZoom = (zoom: number) => {
		zoomLevel.value = zoom;
		if (wavesurfer.value) {
			wavesurfer.value.zoom(zoom);
		}
	};

	const toggleLoop = () => {
		isLooping.value = !isLooping.value;
	};

	const createTrack = (name: string = "New Track"): AudioTrack => {
		const track: AudioTrack = {
			id: nanoid(),
			name,
			clips: [],
			volume: 1,
			muted: false,
			solo: false,
			color: `hsl(${Math.random() * 360}, 70%, 50%)`,
		};
		tracks.value.push(track);
		addTrackAction(track);
		return track;
	};

	const addClipToTrack = async (file: File, trackId: string) => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return;

		const url = URL.createObjectURL(file);
		const audio = new Audio(url);
		await new Promise((resolve) => {
			audio.onloadedmetadata = resolve;
		});

		const clip: AudioClip = {
			id: nanoid(),
			name: file.name,
			url,
			duration: audio.duration,
			startTime: 0,
			endTime: audio.duration,
			offset: 0,
			volume: 1,
			fadeIn: 0,
			fadeOut: 0,
			effects: {
				reverb: 0,
				delay: 0,
				eq: { low: 0, mid: 0, high: 0 },
				compressor: 0,
				limiter: 0,
				chorus: 0,
			},
		};

		track.clips.push(clip);
		selectedClipId.value = clip.id;
		selectedTrackId.value = trackId;
		addClipAction(clip, trackId);
	};

	const removeClip = (clipId: string, trackId: string) => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return;

		const clipIndex = track.clips.findIndex((c) => c.id === clipId);
		if (clipIndex === -1) return;

		const clip = track.clips[clipIndex];
		if (!clip) return;
		track.clips = track.clips.filter((c) => c.id !== clipId);
		if (selectedClipId.value === clipId) {
			selectedClipId.value = null;
		}
		removeClipAction(clip, trackId, clipIndex);
	};

	const updateClip = (clipId: string, updates: Partial<AudioClip>) => {
		for (const track of tracks.value) {
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
				Object.assign(clip, updates);
				updateClipAction(clipId, track.id, updates, previousData);
				break;
			}
		}
	};

	const applyEffects = (clip: AudioClip) => {
		if (!player.value) return;

		if (reverb.value) {
			reverb.value.wet.value = clip.effects.reverb;
		}
		if (delay.value) {
			delay.value.wet.value = clip.effects.delay;
		}
		if (eq3.value) {
			eq3.value.low.value = clip.effects.eq.low;
			eq3.value.mid.value = clip.effects.eq.mid;
			eq3.value.high.value = clip.effects.eq.high;
		}
	};

	const exportAudio = async (format: "wav" | "mp3" = "wav"): Promise<Blob> => {
		if (!audioBuffer.value) {
			throw new Error("No audio loaded");
		}

		const offlineContext = new OfflineAudioContext(
			audioBuffer.value.numberOfChannels,
			audioBuffer.value.length,
			audioBuffer.value.sampleRate,
		);

		const source = offlineContext.createBufferSource();
		source.buffer = audioBuffer.value;

		if (volume.value !== 1) {
			const gainNode = offlineContext.createGain();
			gainNode.gain.value = volume.value;
			source.connect(gainNode);
			gainNode.connect(offlineContext.destination);
		} else {
			source.connect(offlineContext.destination);
		}

		source.start();
		const renderedBuffer = await offlineContext.startRendering();

		return exportAudioWithMediaBunny(renderedBuffer, { format, quality: "high" });
	};

	const undo = () => {
		const action = historyUndo();
		if (!action) return;

		switch (action.type) {
			case "addTrack": {
				tracks.value = tracks.value.filter((t) => t.id !== action.data.track.id);
				break;
			}
			case "removeTrack": {
				tracks.value.splice(action.data.trackIndex, 0, action.data.track);
				break;
			}
			case "addClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips = track.clips.filter((c) => c.id !== action.data.clip.id);
				}
				break;
			}
			case "removeClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips.splice(action.data.clipIndex, 0, action.data.clip);
				}
				break;
			}
			case "updateClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					const clip = track.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						Object.assign(clip, action.data.previousData);
					}
				}
				break;
			}
			case "moveClip": {
				const fromTrack = tracks.value.find((t) => t.id === action.data.fromTrackId);
				const toTrack = tracks.value.find((t) => t.id === action.data.toTrackId);
				if (fromTrack && toTrack) {
					const clip = fromTrack.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						clip.offset = action.data.previousOffset;
					}
				}
				break;
			}
			case "trimClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					const clip = track.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						clip.startTime = action.data.previousStartTime;
						clip.endTime = action.data.previousEndTime;
					}
				}
				break;
			}
			case "addMarker": {
				markers.value = markers.value.filter((m) => m.id !== action.data.marker.id);
				break;
			}
			case "removeMarker": {
				markers.value.splice(action.data.markerIndex, 0, action.data.marker);
				break;
			}
			case "addRegion": {
				regions.value = regions.value.filter((r) => r.id !== action.data.region.id);
				break;
			}
			case "removeRegion": {
				regions.value.splice(action.data.regionIndex, 0, action.data.region);
				break;
			}
			case "updateSettings": {
				Object.assign({ masterVolume, bpm, timeSignature, snapToGrid, gridSize }, action.data.previousSettings);
				break;
			}
		}
	};

	const redo = () => {
		const action = historyRedo();
		if (!action) return;

		switch (action.type) {
			case "addTrack": {
				tracks.value.push(action.data.track);
				break;
			}
			case "removeTrack": {
				tracks.value = tracks.value.filter((t) => t.id !== action.data.track.id);
				break;
			}
			case "addClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips.push(action.data.clip);
				}
				break;
			}
			case "removeClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					track.clips = track.clips.filter((c: AudioClip) => c.id !== action.data.clipId);
				}
				break;
			}
			case "updateClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					const clip = track.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						Object.assign(clip, action.data.updates);
					}
				}
				break;
			}
			case "moveClip": {
				const fromTrack = tracks.value.find((t) => t.id === action.data.fromTrackId);
				const toTrack = tracks.value.find((t) => t.id === action.data.toTrackId);
				if (fromTrack && toTrack) {
					const clip = fromTrack.clips.find((c: AudioClip) => c.id === action.data.clipId);
					if (clip) {
						clip.offset = action.data.newOffset;
					}
				}
				break;
			}
			case "trimClip": {
				const track = tracks.value.find((t) => t.id === action.data.trackId);
				if (track) {
					const clip = track.clips.find((c) => c.id === action.data.clipId);
					if (clip) {
						clip.startTime = action.data.newStartTime;
						clip.endTime = action.data.newEndTime;
					}
				}
				break;
			}
			case "addMarker": {
				markers.value.push(action.data.marker);
				break;
			}
			case "removeMarker": {
				markers.value = markers.value.filter((m: AudioMarker) => m.id !== action.data.marker.id);
				break;
			}
			case "addRegion": {
				regions.value.push(action.data.region);
				break;
			}
			case "removeRegion": {
				regions.value = regions.value.filter((r: AudioRegion) => r.id !== action.data.region.id);
				break;
			}
			case "updateSettings": {
				Object.assign({ masterVolume, bpm, timeSignature, snapToGrid, gridSize }, action.data.settings);
				break;
			}
		}
	};

	const copyClip = (clipId: string, trackId: string) => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return;

		const clip = track.clips.find((c) => c.id === clipId);
		if (clip) {
			clipboard.value = { clip: { ...clip }, trackId };
		}
	};

	const pasteClip = (targetTrackId: string) => {
		if (!clipboard.value) return;

		const targetTrack = tracks.value.find((t) => t.id === targetTrackId);
		if (!targetTrack) return;

		const newClip: AudioClip = {
			...clipboard.value.clip,
			id: nanoid(),
			name: `${clipboard.value.clip.name} (copy)`,
		};

		targetTrack.clips.push(newClip);
		selectedClipId.value = newClip.id;
		selectedTrackId.value = targetTrackId;
		addClipAction(newClip, targetTrackId);
	};

	const cutClip = (clipId: string, trackId: string) => {
		copyClip(clipId, trackId);
		removeClip(clipId, trackId);
	};

	const deleteClip = (clipId: string, trackId: string) => {
		removeClip(clipId, trackId);
	};

	const addMarker = (name: string, time: number) => {
		const marker: AudioMarker = {
			id: nanoid(),
			name,
			time,
			color: `hsl(${Math.random() * 360}, 70%, 50%)`,
		};
		markers.value.push(marker);
		addMarkerAction(marker);
		return marker;
	};

	const removeMarker = (markerId: string) => {
		const markerIndex = markers.value.findIndex((m) => m.id === markerId);
		if (markerIndex === -1) return;

		const marker = markers.value[markerIndex];
		if (!marker) return;
		markers.value = markers.value.filter((m) => m.id !== markerId);
		removeMarkerAction(marker, markerIndex);
	};

	const addRegion = (name: string, startTime: number, endTime: number) => {
		const region: AudioRegion = {
			id: nanoid(),
			name,
			startTime,
			endTime,
			color: `hsl(${Math.random() * 360}, 70%, 50%)`,
		};
		regions.value.push(region);
		addRegionAction(region);
		return region;
	};

	const removeRegion = (regionId: string) => {
		const regionIndex = regions.value.findIndex((r) => r.id === regionId);
		if (regionIndex === -1) return;

		const region = regions.value[regionIndex];
		if (!region) return;
		regions.value = regions.value.filter((r) => r.id !== regionId);
		removeRegionAction(region, regionIndex);
	};

	const startRecording = async (trackId: string) => {
		await initializeAudio();

		if (recordingState.value.isRecording) return;

		recordingState.value = {
			isRecording: true,
			startTime: Date.now(),
			trackId,
		};

		if (metronomeSettings.value.enabled) {
			startMetronome();
		}
	};

	const stopRecording = async () => {
		if (!recordingState.value.isRecording) return;

		recordingState.value.isRecording = false;

		if (metronomeLoop.value) {
			metronomeLoop.value.dispose();
			metronomeLoop.value = null;
		}

		return recordingState.value;
	};

	const startMetronome = () => {
		if (!metronome.value) return;

		const secondsPerBeat = 60 / bpm.value;

		metronomeLoop.value = new Tone.Loop((time) => {
			metronome.value?.triggerAttackRelease("C4", "32n", time);
		}, secondsPerBeat).start(0);
	};

	const stopMetronome = () => {
		if (metronomeLoop.value) {
			metronomeLoop.value.dispose();
			metronomeLoop.value = null;
		}
	};

	const setBPM = (newBPM: number) => {
		const previousBPM = bpm.value;
		bpm.value = newBPM;
		updateSettingsAction({ bpm: newBPM }, { bpm: previousBPM });
	};

	const setTimeSignature = (numerator: number, denominator: number) => {
		const previousTimeSignature = { ...timeSignature.value };
		timeSignature.value = { numerator, denominator };
		updateSettingsAction(
			{ timeSignature: { numerator, denominator } },
			{ timeSignature: previousTimeSignature },
		);
	};

	const toggleSnapToGrid = () => {
		const previousSnapToGrid = snapToGrid.value;
		snapToGrid.value = !snapToGrid.value;
		updateSettingsAction(
			{ snapToGrid: snapToGrid.value },
			{ snapToGrid: previousSnapToGrid },
		);
	};

	const setGridSize = (newGridSize: number) => {
		const previousGridSize = gridSize.value;
		gridSize.value = newGridSize;
		updateSettingsAction(
			{ gridSize: newGridSize },
			{ gridSize: previousGridSize },
		);
	};

	const snapToGridValue = (value: number) => {
		if (!snapToGrid.value) return value;

		const snapped = Math.round(value / gridSize.value) * gridSize.value;
		return snapped;
	};

	const createAutomationTrack = (trackId: string, parameter: AutomationTrack["parameter"]) => {
		const automationTrack: AutomationTrack = {
			id: nanoid(),
			trackId,
			parameter,
			points: [],
		};
		automationTracks.value.push(automationTrack);
		return automationTrack;
	};

	const addAutomationPoint = (automationTrackId: string, time: number, value: number) => {
		const automationTrack = automationTracks.value.find((at) => at.id === automationTrackId);
		if (!automationTrack) return;

		const point: AutomationPoint = {
			id: nanoid(),
			time,
			value,
		};
		automationTrack.points.push(point);
		automationTrack.points.sort((a, b) => a.time - b.time);
		return point;
	};

	const removeAutomationPoint = (automationTrackId: string, pointId: string) => {
		const automationTrack = automationTracks.value.find((at) => at.id === automationTrackId);
		if (!automationTrack) return;

		automationTrack.points = automationTrack.points.filter((p) => p.id !== pointId);
	};

	const saveProject = () => {
		const project: AudioProject = {
			id: nanoid(),
			name: "Untitled Project",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			tracks: tracks.value,
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

	const loadProject = (project: AudioProject) => {
		tracks.value = project.tracks;
		markers.value = project.markers;
		regions.value = project.regions;
		masterVolume.value = project.masterVolume;
		bpm.value = project.bpm;
		timeSignature.value = project.timeSignature;
		snapToGrid.value = project.snapToGrid;
		gridSize.value = project.gridSize;

		selectedClipId.value = null;
		selectedTrackId.value = null;
	};

	const loadProjectFromStorage = () => {
		const json = localStorage.getItem("audio-editor-project");
		if (!json) return null;

		try {
			const project = JSON.parse(json) as AudioProject;
			loadProject(project);
			return project;
		} catch (error) {
			console.error("Failed to load project:", error);
			return null;
		}
	};

	const exportProject = () => {
		const project = saveProject();
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

	const importProject = async (file: File) => {
		const json = await file.text();
		const project = JSON.parse(json) as AudioProject;
		loadProject(project);
		return project;
	};

	const playMultiTrack = async () => {
		await initializeAudio();

		if (isPlaying.value) {
			pause();
			return;
		}

		Tone.Transport.start();
		isPlaying.value = true;

		Tone.Transport.scheduleRepeat((_time) => {
			currentTime.value = Tone.Transport.seconds;
		}, 0.1);
	};

	const pauseMultiTrack = () => {
		Tone.Transport.pause();
		isPlaying.value = false;
	};

	const stopMultiTrack = () => {
		Tone.Transport.stop();
		isPlaying.value = false;
		currentTime.value = 0;
	};

	const seekMultiTrack = (time: number) => {
		Tone.Transport.seconds = time;
		currentTime.value = time;
	};

	watch(selectedClip, (clip) => {
		if (clip) {
			applyEffects(clip);
		}
	});

	onUnmounted(() => {
		if (wavesurfer.value) {
			wavesurfer.value.destroy();
		}
		if (player.value) {
			player.value.dispose();
		}
		if (reverb.value) {
			reverb.value.dispose();
		}
		if (delay.value) {
			delay.value.dispose();
		}
		if (eq3.value) {
			eq3.value.dispose();
		}
		if (masterVolumeNode.value) {
			masterVolumeNode.value.dispose();
		}
	});

	return {
		audioContext,
		wavesurfer,
		audioBuffer,
		isPlaying,
		currentTime,
		duration,
		volume,
		isLooping,
		zoomLevel,
		tracks,
		selectedClipId,
		selectedTrackId,
		selectedClip,
		selectedTrack,
		markers,
		regions,
		masterVolume,
		bpm,
		timeSignature,
		snapToGrid,
		gridSize,
		clipboard,
		automationTracks,
		recordingState,
		metronomeSettings,
		canUndo,
		canRedo,
		formatTime,
		initializeAudio,
		loadAudioFile,
		play,
		pause,
		stop,
		seek,
		setVolume,
		setZoom,
		toggleLoop,
		createTrack,
		addClipToTrack,
		removeClip,
		updateClip,
		applyEffects,
		exportAudio,
		undo,
		redo,
		copyClip,
		pasteClip,
		cutClip,
		deleteClip,
		addMarker,
		removeMarker,
		addRegion,
		removeRegion,
		startRecording,
		stopRecording,
		startMetronome,
		stopMetronome,
		setBPM,
		setTimeSignature,
		toggleSnapToGrid,
		setGridSize,
		snapToGridValue,
		createAutomationTrack,
		addAutomationPoint,
		removeAutomationPoint,
		saveProject,
		loadProject,
		loadProjectFromStorage,
		exportProject,
		importProject,
		playMultiTrack,
		pauseMultiTrack,
		stopMultiTrack,
		seekMultiTrack,
	};
};
