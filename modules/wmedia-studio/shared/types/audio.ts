export interface AudioClip {
	id: string;
	name: string;
	url: string;
	duration: number;
	startTime: number;
	endTime: number;
	offset: number;
	volume: number;
	fadeIn: number;
	fadeOut: number;
	effects: {
		reverb: number;
		delay: number;
		eq: { low: number; mid: number; high: number };
		compressor?: number;
		limiter?: number;
		chorus?: number;
		noiseGate?: number;
		phaser?: number;
		tremolo?: number;
		distortion?: number;
	};
	groupId?: string;
	normalized?: boolean;
	targetLoudness?: number;
}

export interface AudioTrack {
	id: string;
	name: string;
	clips: AudioClip[];
	volume: number;
	muted: boolean;
	solo: boolean;
	color: string;
	pan?: number;
	sidechainSource?: string;
}

export interface AudioMarker {
	id: string;
	name: string;
	time: number;
	color: string;
	duration?: number;
	type?: "beat" | "cue" | "loop" | "transcription";
	transcriptionText?: string;
}

export interface AudioRegion {
	id: string;
	name: string;
	startTime: number;
	endTime: number;
	color: string;
	type?: "verse" | "chorus" | "bridge" | "intro" | "outro" | "silence" | "voice" | "music";
	confidence?: number;
}

export interface AudioProject {
	id: string;
	name: string;
	createdAt: number;
	updatedAt: number;
	tracks: AudioTrack[];
	markers: AudioMarker[];
	regions: AudioRegion[];
	masterVolume: number;
	bpm: number;
	timeSignature: { numerator: number; denominator: number };
	snapToGrid: boolean;
	gridSize: number;
	template?: string;
	version?: number;
}

export interface AudioEditorState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isLooping: boolean;
	zoomLevel: number;
	tracks: AudioTrack[];
	selectedClipId: string | null;
	selectedTrackId: string | null;
	markers: AudioMarker[];
	regions: AudioRegion[];
	masterVolume: number;
	bpm: number;
	timeSignature: { numerator: number; denominator: number };
	snapToGrid: boolean;
	gridSize: number;
	clipboard: { clip: AudioClip; trackId: string } | null;
}

export interface AudioHistoryAction {
	type:
		| "addTrack"
		| "removeTrack"
		| "addClip"
		| "removeClip"
		| "updateClip"
		| "moveClip"
		| "trimClip"
		| "addMarker"
		| "removeMarker"
		| "addRegion"
		| "removeRegion"
		| "updateSettings";
	timestamp: number;
	data: any;
	previousData?: any;
}

export interface AutomationPoint {
	id: string;
	time: number;
	value: number;
}

export interface AutomationTrack {
	id: string;
	trackId: string;
	parameter: "volume" | "pan" | "reverb" | "delay" | "eqLow" | "eqMid" | "eqHigh";
	points: AutomationPoint[];
}

export interface RecordingState {
	isRecording: boolean;
	startTime: number;
	trackId: string | null;
}

export interface MetronomeSettings {
	enabled: boolean;
	volume: number;
	sound: "click" | "beep" | "wood" | "hihat";
}

export interface SpectralData {
	frequencies: Float32Array;
	magnitudes: Float32Array;
	peakFrequency: number;
	peakMagnitude: number;
}

export interface LoudnessData {
	integrated: number;
	momentary: number;
	shortTerm: number;
	peak: number;
	truePeak: number;
	lra: number;
}

export interface StemSeparationResult {
	vocals?: string;
	drums?: string;
	bass?: string;
	other?: string;
	piano?: string;
}

export interface NoiseProfile {
	threshold: number;
	reduction: number;
	attack: number;
	release: number;
	sample?: Float32Array;
}

export interface BatchProcessJob {
	id: string;
	clipIds: string[];
	effect: string;
	params: Record<string, number>;
	status: "pending" | "processing" | "completed" | "failed";
	progress: number;
}

export interface TranscriptionSegment {
	id: string;
	startTime: number;
	endTime: number;
	text: string;
	confidence: number;
	speaker?: string;
}

export interface ClipGroup {
	id: string;
	name: string;
	color: string;
	clipIds: string[];
	collapsed: boolean;
}

export interface SidechainSettings {
	sourceTrackId: string;
	threshold: number;
	ratio: number;
	attack: number;
	release: number;
	makeupGain: number;
}

export interface BeatPattern {
	id: string;
	name: string;
	bpm: number;
	steps: boolean[][];
	sounds: string[];
}

export interface SoundDetectionResult {
	regions: AudioRegion[];
	silenceThreshold: number;
	voiceConfidence: number;
	musicConfidence: number;
}

export interface MasteringSettings {
	targetLoudness: number;
	maxTruePeak: number;
	stereoWidth: number;
	bassEnhancement: number;
	presenceBoost: number;
}

export interface MidiNote {
	id: string;
	pitch: number;
	velocity: number;
	startTime: number;
	duration: number;
}

export interface MidiTrack {
	id: string;
	name: string;
	instrument: string;
	notes: MidiNote[];
	volume: number;
}

export interface AudioAlignmentResult {
	trackId: string;
	offset: number;
	confidence: number;
	waveform: Float32Array;
}

export interface AudioProjectVersion {
	id: string;
	timestamp: number;
	name: string;
	thumbnail?: string;
	changes: string[];
}

export interface VideoSyncInfo {
	videoUrl?: string;
	videoDuration: number;
	linked: boolean;
	videoOffset: number;
}

export interface VoiceEffect {
	id: string;
	name: string;
	params: {
		pitch: number;
		formant: number;
		robot: number;
		whisper: number;
	};
}

export interface AudioProjectTemplate {
	id: string;
	name: string;
	category: "podcast" | "music" | "voiceover" | "soundtrack" | "custom";
	description: string;
	defaultTracks: string[];
	defaultEffects: string[];
}

export interface AudioCursorPosition {
	userId: string;
	userName: string;
	color: string;
	x: number;
	y: number;
	timestamp: number;
}

export interface VSTPlugin {
	id: string;
	name: string;
	vendor: string;
	version: string;
	parameters: VSTParameter[];
	enabled: boolean;
}

export interface VSTParameter {
	id: string;
	name: string;
	value: number;
	min: number;
	max: number;
	default: number;
}

export interface CloudExportSettings {
	platform: "soundcloud" | "youtube" | "spotify" | "custom" | "podcast";
	title: string;
	description: string;
	tags: string[];
	privacy: "public" | "private" | "unlisted";
}

export interface AudioCalculatorData {
	bpm: number;
	sampleRate: number;
	delayTimes: {
		whole: number;
		half: number;
		quarter: number;
		eighth: number;
		sixteenth: number;
	};
	frequency: {
		low: number;
		mid: number;
		high: number;
	};
}

export interface CrossfadeSettings {
	clipAId: string;
	clipBId: string;
	trackId: string;
	fadeInDuration: number;
	fadeOutDuration: number;
	curve: "linear" | "equal_power" | "s_curve";
	overlapTime: number;
}

export interface AudioEffect {
	id: string;
	name: string;
	type:
		| "reverb"
		| "delay"
		| "eq"
		| "compressor"
		| "limiter"
		| "chorus"
		| "noiseGate"
		| "phaser"
		| "tremolo"
		| "distortion";
	enabled: boolean;
	params: Record<string, number>;
}

export interface NoiseReductionSettings {
	threshold: number;
	reduction: number;
	attack: number;
	release: number;
}

export interface StemSeparationSettings {
	vocals: boolean;
	drums: boolean;
	bass: boolean;
	other: boolean;
	quality: "low" | "medium" | "high";
}
