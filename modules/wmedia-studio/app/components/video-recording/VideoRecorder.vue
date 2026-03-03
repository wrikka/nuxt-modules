<script setup lang="ts">
import BatchExport from "./BatchExport.vue";
import ChapterMarkers from "./ChapterMarkers.vue";
import ChromaKey from "./ChromaKey.vue";
import ClickVisualizer from "./ClickVisualizer.vue";
import CloudUpload from "./CloudUpload.vue";
import CountdownCustomizer from "./CountdownCustomizer.vue";
import DrawingTools from "./DrawingTools.vue";
import EmojiReactions from "./EmojiReactions.vue";
import ExportDialog from "./ExportDialog.vue";
import HotkeyCustomizer from "./HotkeyCustomizer.vue";
import MobileCamera from "./MobileCamera.vue";
import NoiseSuppression from "./NoiseSuppression.vue";
import PiPLayouts from "./PiPLayouts.vue";
import RecordingAnnotations from "./RecordingAnnotations.vue";
import RecordingPresets from "./RecordingPresets.vue";
import RecordingStats from "./RecordingStats.vue";
import ScheduledRecording from "./ScheduledRecording.vue";
import Teleprompter from "./Teleprompter.vue";
import Transcription from "./Transcription.vue";
import TrimEditor from "./TrimEditor.vue";
import Watermark from "./Watermark.vue";
import ZoomPan from "./ZoomPan.vue";
// AI Features
import AIAutoFraming from "./AIAutoFraming.vue";
import AIEyeContact from "./AIEyeContact.vue";
import AIHighlightDetection from "./AIHighlightDetection.vue";
import AISilenceRemoval from "./AISilenceRemoval.vue";
// Collaboration Features
import GuestRecording from "./GuestRecording.vue";
import LiveChatOverlay from "./LiveChatOverlay.vue";
import LiveStreaming from "./LiveStreaming.vue";
// Production Features
import AudioDucking from "./AudioDucking.vue";
import GreenScreenPresets from "./GreenScreenPresets.vue";
import LowerThirds from "./LowerThirds.vue";
import MultiCamera from "./MultiCamera.vue";
import SceneTransitions from "./SceneTransitions.vue";
import VideoFilters from "./VideoFilters.vue";
import VoiceModulation from "./VoiceModulation.vue";
// Workflow Features
import RecordingCalendar from "./RecordingCalendar.vue";
import RecordingProjects from "./RecordingProjects.vue";
import RecordingTemplates from "./RecordingTemplates.vue";
import SmartFileNaming from "./SmartFileNaming.vue";
// Accessibility Features
import AutoCloudBackup from "./AutoCloudBackup.vue";
import AutoSubtitles from "./AutoSubtitles.vue";
import SignLanguageWindow from "./SignLanguageWindow.vue";
// Analytics Features
import FillerWordsDetection from "./FillerWordsDetection.vue";
import SpeakingPaceAnalysis from "./SpeakingPaceAnalysis.vue";
// Extra Features
import type { RecordingExportOptions } from "~/composables/useVideoExport";
import MusicAudioLibrary from "./MusicAudioLibrary.vue";
import ThumbnailGenerator from "./ThumbnailGenerator.vue";
import type { Recording, RecordingSource } from "./types";

const { initDB, saveRecording, loadRecordings, deleteRecording: deleteFromDB } =
	useIndexedDB();
const { applyVirtualBackground } = useVirtualBackground();
const { exportRecording } = useVideoExport();

const annotationsRef = ref<InstanceType<typeof RecordingAnnotations> | null>(
	null,
);

const mediaStream = ref<MediaStream | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
const recordings = ref<Recording[]>([]);
const isRecording = ref(false);
const isPaused = ref(false);
const isCountingDown = ref(false);
const countdownValue = ref(0);
const recordingTime = ref(0);
const recordingSource = ref<RecordingSource>("screen");
const audioEnabled = ref(true);
const cameraEnabled = ref(false);
const selectedAudioDevice = ref("");
const videoResolution = ref(1080);
const videoBitrate = ref(5000);
const currentMimeType = ref("");
const virtualBackgroundEnabled = ref(false);
const virtualBackgroundType = ref<"blur" | "color" | "image">("blur");
const blurAmount = ref(10);
const backgroundColor = ref("#000000");
const backgroundImage = ref("");
const autoSaveInterval = ref(30);
const lastAutoSaveTime = ref(0);

// New feature states
const selectedRecording = ref<Recording | null>(null);
const showExportDialog = ref(false);
const showTrimEditor = ref(false);
const pipLayout = ref("bottom-right");
const isZoomEnabled = ref(false);
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
const isDrawingEnabled = ref(false);
const selectedPreset = ref("youtube-1080");
const selectedTemplate = ref<string>("default");
const watermarkText = ref("");
const chapterMarkers = ref<{ time: number; label: string }[]>([]);
const activeTab = ref<
	| "settings"
	| "ai"
	| "collaboration"
	| "production"
	| "workflow"
	| "accessibility"
	| "analytics"
	| "shortcuts"
>("settings");
const isScheduled = ref(false);

// AI Feature States
const aiAutoFramingEnabled = ref(false);
const aiFramingMode = ref<"center" | "upper-body" | "headshot" | "dynamic">(
	"center",
);
const aiEyeContactEnabled = ref(false);
const aiSilenceRemovalEnabled = ref(false);
const aiHighlightDetectionEnabled = ref(false);
const thumbnailGeneratorEnabled = ref(false);

// Collaboration Feature States
const liveStreamingEnabled = ref(false);
const liveChatOverlayEnabled = ref(false);
const guestRecordingEnabled = ref(false);

// Production Feature States
const multiCameraEnabled = ref(false);
const sceneTransitionsEnabled = ref(false);
const lowerThirdsEnabled = ref(false);
const audioDuckingEnabled = ref(false);
const voiceModulationEnabled = ref(false);
const videoFiltersEnabled = ref(false);
const clickVisualizerEnabled = ref(false);

// Workflow Feature States
const smartFileNamingEnabled = ref(false);

// Accessibility Feature States
const autoSubtitlesEnabled = ref(false);
const signLanguageEnabled = ref(false);
const cloudBackupEnabled = ref(false);

// Analytics Feature States
const speakingPaceEnabled = ref(false);
const fillerWordsEnabled = ref(false);

const tabs = [
	"settings",
	"ai",
	"collaboration",
	"production",
	"workflow",
	"accessibility",
	"analytics",
	"shortcuts",
] as const;

const applyPreset = (
	preset: {
		resolution: number;
		fps: number;
		bitrate: number;
		audioEnabled: boolean;
		virtualBackground: boolean;
	},
) => {
	videoResolution.value = preset.resolution;
	videoBitrate.value = preset.bitrate;
	audioEnabled.value = preset.audioEnabled;
	virtualBackgroundEnabled.value = preset.virtualBackground;
	virtualBackgroundEnabled.value = preset.virtualBackground;
};

const handleExport = async (
	recording: Recording,
	options: RecordingExportOptions,
) => {
	try {
		const exportedBlob = await exportRecording(
			recording.blob,
			options,
			(progress) => {
				console.log(`Export progress: ${progress.percentage}%`);
			},
		);

		// Download the exported file
		const url = URL.createObjectURL(exportedBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${recording.name}.${options.format}`;
		a.click();
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Export failed:", error);
		alert("Export failed. Please try again.");
	}
};

const openExportDialog = (recording: Recording) => {
	selectedRecording.value = recording;
	showExportDialog.value = true;
};

const openTrimEditor = (recording: Recording) => {
	selectedRecording.value = recording;
	showTrimEditor.value = true;
};

const handleTrimSave = async (blob: Blob, name: string) => {
	const recording: Recording = {
		id: crypto.randomUUID(),
		blob,
		url: URL.createObjectURL(blob),
		duration: 0, // Would need to get actual duration
		timestamp: Date.now(),
		name,
	};
	recordings.value.unshift(recording);
	await saveRecording(recording, blob.type);
	showTrimEditor.value = false;
};
let autoSaveTimer: NodeJS.Timeout | null = null;
let recordingInterval: NodeJS.Timeout | null = null;

const startCountdown = async () => {
	isCountingDown.value = true;
	countdownValue.value = 3;

	for (let i = 3; i > 0; i--) {
		countdownValue.value = i;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	isCountingDown.value = false;
	await startRecording();
};

const startRecording = async () => {
	try {
		let stream: MediaStream;

		if (recordingSource.value === "screen") {
			const audioConstraints = audioEnabled.value
				? { deviceId: selectedAudioDevice.value || undefined }
				: false;
			stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					cursor: "always" as any,
					height: { ideal: videoResolution.value },
					frameRate: { ideal: 30 },
				} as any,
				audio: audioConstraints,
			});
		} else if (recordingSource.value === "camera") {
			const audioConstraints = audioEnabled.value
				? { deviceId: selectedAudioDevice.value || undefined }
				: false;
			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					height: { ideal: videoResolution.value },
					frameRate: { ideal: 30 },
				},
				audio: audioConstraints,
			});
		} else {
			const screenStream = await navigator.mediaDevices.getDisplayMedia({
				video: { cursor: "always" } as any,
				audio: false,
			});
			const audioConstraints = audioEnabled.value
				? { deviceId: selectedAudioDevice.value || undefined }
				: false;
			const cameraStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					height: { ideal: videoResolution.value },
					frameRate: { ideal: 30 },
				},
				audio: audioConstraints,
			});

			stream = new MediaStream([
				...screenStream.getVideoTracks(),
				...cameraStream.getAudioTracks(),
			]);
		}

		mediaStream.value = stream;

		const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
			? "video/webm;codecs=vp9"
			: "video/webm";

		currentMimeType.value = mimeType;

		mediaRecorder.value = new MediaRecorder(stream, {
			mimeType,
			videoBitsPerSecond: videoBitrate.value * 1000,
		});
		recordedChunks.value = [];

		mediaRecorder.value.ondataavailable = (event) => {
			if (event.data.size > 0) {
				recordedChunks.value.push(event.data);
			}
		};

		mediaRecorder.value.onstop = async () => {
			const blob = new Blob(recordedChunks.value, { type: mimeType });
			const url = URL.createObjectURL(blob);
			const recording: Recording = {
				id: crypto.randomUUID(),
				blob,
				url,
				duration: recordingTime.value,
				timestamp: Date.now(),
				name: `Recording ${recordings.value.length + 1}`,
			};

			recordings.value.unshift(recording);
			recordingTime.value = 0;

			try {
				await saveRecording(recording, mimeType);
			} catch (error) {
				console.error("Failed to save recording to IndexedDB:", error);
			}
		};

		mediaRecorder.value.start(1000);
		isRecording.value = true;
		lastAutoSaveTime.value = Date.now();

		recordingInterval = setInterval(() => {
			recordingTime.value++;

			const now = Date.now();
			const elapsedSinceLastSave = (now - lastAutoSaveTime.value) / 1000;

			if (elapsedSinceLastSave >= autoSaveInterval.value && !isPaused.value) {
				savePartialRecording();
				lastAutoSaveTime.value = now;
			}
		}, 1000);

		stream.getTracks().forEach((track) => {
			track.onended = () => {
				if (isRecording.value) {
					stopRecording();
				}
			};
		});
	} catch (error) {
		console.error("Error starting recording:", error);
		alert("Failed to start recording. Please check your permissions.");
	}
};

const pauseRecording = () => {
	if (mediaRecorder.value && isRecording.value && !isPaused.value) {
		mediaRecorder.value.pause();
		isPaused.value = true;

		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null;
		}
	}
};

const resumeRecording = () => {
	if (mediaRecorder.value && isRecording.value && isPaused.value) {
		mediaRecorder.value.resume();
		isPaused.value = false;

		recordingInterval = setInterval(() => {
			recordingTime.value++;
		}, 1000);
	}
};

const savePartialRecording = async () => {
	if (!mediaRecorder.value || recordedChunks.value.length === 0) return;

	try {
		const blob = new Blob(recordedChunks.value, {
			type: currentMimeType.value,
		});
		const url = URL.createObjectURL(blob);
		const recording: Recording = {
			id: crypto.randomUUID(),
			blob,
			url,
			duration: recordingTime.value,
			timestamp: Date.now(),
			name: `Auto-save ${new Date().toLocaleTimeString()}`,
		};

		recordings.value.unshift(recording);

		try {
			await saveRecording(recording, currentMimeType.value);
		} catch (error) {
			console.error("Failed to save partial recording to IndexedDB:", error);
		}
	} catch (error) {
		console.error("Error saving partial recording:", error);
	}
};

const stopRecording = () => {
	if (mediaRecorder.value && isRecording.value) {
		if (isPaused.value) {
			mediaRecorder.value.resume();
		}
		mediaRecorder.value.stop();
		isRecording.value = false;
		isPaused.value = false;

		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null;
		}

		if (autoSaveTimer) {
			clearTimeout(autoSaveTimer);
			autoSaveTimer = null;
		}

		if (mediaStream.value) {
			mediaStream.value.getTracks().forEach((track) => track.stop());
			mediaStream.value = null;
		}
	}
};

const downloadRecording = (recording: Recording) => {
	const a = document.createElement("a");
	a.href = recording.url;
	a.download = `${recording.name}.webm`;
	a.click();
};

const uploadRecording = async (recording: Recording) => {
	try {
		const formData = new FormData();
		formData.append("file", recording.blob, `${recording.name}.webm`);

		const response = await $fetch("/api/video/upload", {
			method: "POST",
			body: formData,
		});

		alert("Video uploaded successfully!");
		console.log("Upload response:", response);
	} catch (error) {
		console.error("Error uploading video:", error);
		alert("Failed to upload video. Please try again.");
	}
};

const deleteRecording = async (recording: Recording) => {
	const index = recordings.value.findIndex((r) => r.id === recording.id);
	if (index > -1) {
		URL.revokeObjectURL(recording.url);
		recordings.value.splice(index, 1);
		try {
			await deleteFromDB(recording.id);
		} catch (error) {
			console.error("Failed to delete recording from IndexedDB:", error);
		}
	}
};

const previewRecording = (recording: Recording) => {
	window.open(recording.url, "_blank");
};

onMounted(async () => {
	try {
		await initDB();
		const savedRecordings = await loadRecordings();
		recordings.value = savedRecordings;
	} catch (error) {
		console.error("Failed to load recordings from IndexedDB:", error);
	}
});

onKeyStroke("r", (e) => {
	if (!isCountingDown.value) {
		e.preventDefault();
		if (!isRecording.value) {
			startCountdown();
		}
	}
});

onKeyStroke("s", (e) => {
	if (!isCountingDown.value) {
		e.preventDefault();
		if (isRecording.value) {
			stopRecording();
		}
	}
});

onKeyStroke("p", (e) => {
	if (!isCountingDown.value) {
		e.preventDefault();
		if (isRecording.value) {
			if (isPaused.value) {
				resumeRecording();
			} else {
				pauseRecording();
			}
		}
	}
});

onUnmounted(() => {
	if (recordingInterval) {
		clearInterval(recordingInterval);
	}
	if (mediaStream.value) {
		mediaStream.value.getTracks().forEach((track) => track.stop());
	}
	recordings.value.forEach((recording) => {
		URL.revokeObjectURL(recording.url);
	});
});
</script>

<template>
	<div class="space-y-6">
		<!-- Tabs -->
		<div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
			<button
				v-for="tab in tabs"
				:key="tab"
				:class="[
					'px-4 py-2 text-sm font-medium transition-colors capitalize',
					activeTab === tab
						? 'text-purple-600 border-b-2 border-purple-600'
						: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
				]"
				@click="activeTab = tab"
			>
				{{ tab }}
			</button>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 space-y-6">
				<!-- Settings Tab -->
				<div v-if="activeTab === 'settings'" class="space-y-6">
					<RecordingPresets v-model="selectedPreset" @apply="applyPreset" />

					<RecordingSettings
						v-model:source="recordingSource"
						v-model:audioEnabled="audioEnabled"
						v-model:cameraEnabled="cameraEnabled"
						v-model:selectedAudioDevice="selectedAudioDevice"
						v-model:videoResolution="videoResolution"
						v-model:videoBitrate="videoBitrate"
						v-model:virtualBackgroundEnabled="virtualBackgroundEnabled"
						v-model:virtualBackgroundType="virtualBackgroundType"
						v-model:blurAmount="blurAmount"
						v-model:backgroundColor="backgroundColor"
						v-model:backgroundImage="backgroundImage"
						@start="startCountdown"
					/>

					<CountdownCustomizer />

					<RecordingPreview
						v-if="mediaStream"
						:stream="mediaStream"
						:is-recording="isRecording"
						:is-counting-down="isCountingDown"
						:countdown-value="countdownValue"
						:recording-time="recordingTime"
						:virtual-background-enabled="virtualBackgroundEnabled"
						:virtual-background-type="virtualBackgroundType"
						:blur-amount="blurAmount"
						:background-color="backgroundColor"
						:background-image="backgroundImage"
					/>

					<RecordingControls
						:is-recording="isRecording"
						:is-paused="isPaused"
						:has-stream="!!mediaStream"
						:recordings="recordings"
						@start="startRecording"
						@stop="stopRecording"
						@pause="pauseRecording"
						@resume="resumeRecording"
						@download="downloadRecording"
						@upload="uploadRecording"
						@delete="deleteRecording"
					/>
				</div>

				<!-- AI Tab -->
				<div v-if="activeTab === 'ai'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AIAutoFraming
							v-model:enabled="aiAutoFramingEnabled"
							v-model:framingMode="aiFramingMode"
						/>
						<AIEyeContact v-model:enabled="aiEyeContactEnabled" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AISilenceRemoval v-model:enabled="aiSilenceRemovalEnabled" />
						<AIHighlightDetection
							v-model:enabled="aiHighlightDetectionEnabled"
						/>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ThumbnailGenerator v-model:enabled="thumbnailGeneratorEnabled" />
					</div>
				</div>

				<!-- Collaboration Tab -->
				<div v-if="activeTab === 'collaboration'" class="space-y-6">
					<LiveStreaming v-model:enabled="liveStreamingEnabled" />
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<LiveChatOverlay v-model:enabled="liveChatOverlayEnabled" />
						<GuestRecording v-model:enabled="guestRecordingEnabled" />
					</div>
				</div>

				<!-- Production Tab -->
				<div v-if="activeTab === 'production'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<MultiCamera v-model:enabled="multiCameraEnabled" />
						<SceneTransitions v-model:enabled="sceneTransitionsEnabled" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<LowerThirds v-model:enabled="lowerThirdsEnabled" />
						<AudioDucking v-model:enabled="audioDuckingEnabled" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<VoiceModulation v-model:enabled="voiceModulationEnabled" />
						<VideoFilters v-model:enabled="videoFiltersEnabled" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<GreenScreenPresets />
						<PiPLayouts
							:modelValue="pipLayout"
							@update:modelValue="pipLayout = $event"
						/>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ChromaKey />
						<Watermark v-model="watermarkText" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<NoiseSuppression />
						<ClickVisualizer v-model:enabled="clickVisualizerEnabled" />
					</div>
					<DrawingTools :canvas="null" />
					<Teleprompter />
					<EmojiReactions recording-id="current" @select="console.log" />
					<ChapterMarkers
						recording-id="current"
						@add="(t, l) => chapterMarkers.push({ time: t, label: l })"
					/>
				</div>

				<!-- Workflow Tab -->
				<div v-if="activeTab === 'workflow'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<RecordingTemplates v-model="selectedTemplate" />
						<RecordingProjects />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SmartFileNaming v-model:enabled="smartFileNamingEnabled" />
						<RecordingCalendar />
					</div>
					<ScheduledRecording
						v-model:isScheduled="isScheduled"
						@schedule="console.log('Scheduled')"
						@cancel="console.log('Cancelled')"
					/>
					<MobileCamera />
				</div>

				<!-- Accessibility Tab -->
				<div v-if="activeTab === 'accessibility'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AutoSubtitles v-model:enabled="autoSubtitlesEnabled" />
						<SignLanguageWindow v-model:enabled="signLanguageEnabled" />
					</div>
					<Transcription />
					<AutoCloudBackup v-model:enabled="cloudBackupEnabled" />
				</div>

				<!-- Analytics Tab -->
				<div v-if="activeTab === 'analytics'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SpeakingPaceAnalysis v-model:enabled="speakingPaceEnabled" />
						<FillerWordsDetection v-model:enabled="fillerWordsEnabled" />
					</div>
				</div>

				<!-- Shortcuts Tab -->
				<div v-if="activeTab === 'shortcuts'" class="space-y-6">
					<HotkeyCustomizer />
				</div>

				<RecordingAnnotations ref="annotationsRef" />
			</div>

			<div class="lg:col-span-1 space-y-6">
				<RecordingStats :recordings="recordings" />

				<RecordingsList
					:recordings="recordings"
					@preview="previewRecording"
					@download="downloadRecording"
					@upload="uploadRecording"
					@delete="deleteRecording"
				/>

				<BatchExport :recordings="recordings" @export="console.log" />
			</div>
		</div>

		<!-- Export Dialog -->
		<ExportDialog
			v-if="selectedRecording"
			v-model:isOpen="showExportDialog"
			:recording="selectedRecording"
			@export="handleExport(selectedRecording, $event)"
		/>

		<!-- Trim Editor -->
		<TrimEditor
			v-if="selectedRecording"
			v-model:isOpen="showTrimEditor"
			:recording="selectedRecording"
			@save="handleTrimSave"
		/>
	</div>
</template>
