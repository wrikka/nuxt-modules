<script setup lang="ts">
// wvideo-editor components (from @wrikka/wvideo-editor)
import { VideoBatchExport, VideoExportDialog, VideoTrimEditor } from "@wrikka/wvideo-editor";
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
import MusicAudioLibrary from "./MusicAudioLibrary.vue";
import ThumbnailGenerator from "./ThumbnailGenerator.vue";

import { useVideoRecording } from "~/composables/useVideoRecording";
import { useVideoRecordingFeatures } from "~/composables/useVideoRecordingFeatures";
import { useVideoRecordingShortcuts } from "~/composables/useVideoRecordingShortcuts";
import { useVideoEditor, type Recording } from "@wrikka/wvideo-editor";

const annotationsRef = ref<InstanceType<typeof RecordingAnnotations> | null>(null);

const recording = useVideoRecording({
	onRecordingStop: (rec) => {
		// Add recording to editor when stopped
		editor.addRecording(rec);
	},
	onRecordingError: (error) => {
		console.error("Recording error:", error);
		alert("Failed to start recording. Please check your permissions.");
	},
});

const features = useVideoRecordingFeatures();
const editor = useVideoEditor();

onMounted(() => {
	editor.loadAllRecordings();
});

const applyPreset = (preset: {
	resolution: number;
	fps: number;
	bitrate: number;
	audioEnabled: boolean;
	virtualBackground: boolean;
}) => {
	recording.videoResolution.value = preset.resolution;
	recording.videoBitrate.value = preset.bitrate;
	recording.audioEnabled.value = preset.audioEnabled;
	features.virtualBackgroundEnabled.value = preset.virtualBackground;
};

const startWithCountdown = async () => {
	await recording.startCountdown(3);
	await recording.startRecording();
};

useVideoRecordingShortcuts({
	onStart: () => {
		if (!recording.isRecording.value && !recording.isCountingDown.value) {
			startWithCountdown();
		}
	},
	onStop: () => {
		if (recording.isRecording.value) {
			recording.stopRecording();
		}
	},
	onTogglePause: () => {
		if (recording.isRecording.value) {
			if (recording.isPaused.value) recording.resumeRecording();
			else recording.pauseRecording();
		}
	},
	enabled: computed(() => !recording.isCountingDown.value),
});

const handleExport = async (rec: Recording, options: import("@wrikka/wvideo-editor").RecordingExportOptions) => {
	await editor.handleExport(rec, options);
};

const handleTrimSave = async (blob: Blob, name: string) => {
	await editor.handleTrimSave(blob, name);
};

const tabs = ["settings", "ai", "collaboration", "production", "workflow", "accessibility", "analytics", "shortcuts"] as const;
const activeTab = ref<(typeof tabs)[number]>("settings");
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
					<RecordingPresets v-model="features.selectedPreset.value" @apply="applyPreset" />
					<RecordingSettings
						v-model:source="recording.recordingSource.value"
						v-model:audioEnabled="recording.audioEnabled.value"
						v-model:cameraEnabled="recording.cameraEnabled.value"
						v-model:selectedAudioDevice="recording.selectedAudioDevice.value"
						v-model:videoResolution="recording.videoResolution.value"
						v-model:videoBitrate="recording.videoBitrate.value"
						v-model:virtualBackgroundEnabled="features.virtualBackgroundEnabled.value"
						v-model:virtualBackgroundType="features.virtualBackgroundType.value"
						v-model:blurAmount="features.blurAmount.value"
						v-model:backgroundColor="features.backgroundColor.value"
						v-model:backgroundImage="features.backgroundImage.value"
						@start="startWithCountdown"
					/>
					<CountdownCustomizer />
					<RecordingPreview
						v-if="recording.mediaStream.value"
						:stream="recording.mediaStream.value"
						:is-recording="recording.isRecording.value"
						:is-counting-down="recording.isCountingDown.value"
						:countdown-value="recording.countdownValue.value"
						:recording-time="recording.recordingTime.value"
						:virtual-background-enabled="features.virtualBackgroundEnabled.value"
						:virtual-background-type="features.virtualBackgroundType.value"
						:blur-amount="features.blurAmount.value"
						:background-color="features.backgroundColor.value"
						:background-image="features.backgroundImage.value"
					/>
					<RecordingControls
						:is-recording="recording.isRecording.value"
						:is-paused="recording.isPaused.value"
						:has-stream="!!recording.mediaStream.value"
						:recordings="editor.recordings.value"
						@start="recording.startRecording"
						@stop="recording.stopRecording"
						@pause="recording.pauseRecording"
						@resume="recording.resumeRecording"
						@download="editor.downloadRecording"
						@upload="editor.uploadRecording"
						@delete="editor.deleteRecording"
					/>
				</div>

				<!-- AI Tab -->
				<div v-if="activeTab === 'ai'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AIAutoFraming v-model:enabled="features.aiAutoFramingEnabled.value" v-model:framingMode="features.aiFramingMode.value" />
						<AIEyeContact v-model:enabled="features.aiEyeContactEnabled.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AISilenceRemoval v-model:enabled="features.aiSilenceRemovalEnabled.value" />
						<AIHighlightDetection v-model:enabled="features.aiHighlightDetectionEnabled.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ThumbnailGenerator v-model:enabled="features.thumbnailGeneratorEnabled.value" />
					</div>
				</div>

				<!-- Collaboration Tab -->
				<div v-if="activeTab === 'collaboration'" class="space-y-6">
					<LiveStreaming v-model:enabled="features.liveStreamingEnabled.value" />
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<LiveChatOverlay v-model:enabled="features.liveChatOverlayEnabled.value" />
						<GuestRecording v-model:enabled="features.guestRecordingEnabled.value" />
					</div>
				</div>

				<!-- Production Tab -->
				<div v-if="activeTab === 'production'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<MultiCamera v-model:enabled="features.multiCameraEnabled.value" />
						<SceneTransitions v-model:enabled="features.sceneTransitionsEnabled.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<LowerThirds v-model:enabled="features.lowerThirdsEnabled.value" />
						<AudioDucking v-model:enabled="features.audioDuckingEnabled.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<VoiceModulation v-model:enabled="features.voiceModulationEnabled.value" />
						<VideoFilters v-model:enabled="features.videoFiltersEnabled.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<GreenScreenPresets />
						<PiPLayouts v-model="features.pipLayout.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ChromaKey />
						<Watermark v-model="features.watermarkText.value" />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<NoiseSuppression />
						<ClickVisualizer v-model:enabled="features.clickVisualizerEnabled.value" />
					</div>
					<DrawingTools :canvas="null" />
					<Teleprompter />
					<EmojiReactions recording-id="current" @select="console.log" />
					<ChapterMarkers recording-id="current" @add="(t, l) => features.chapterMarkers.value.push({ time: t, label: l })" />
				</div>

				<!-- Workflow Tab -->
				<div v-if="activeTab === 'workflow'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<RecordingTemplates v-model="features.selectedTemplate.value" />
						<RecordingProjects />
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SmartFileNaming v-model:enabled="features.smartFileNamingEnabled.value" />
						<RecordingCalendar />
					</div>
					<ScheduledRecording v-model:isScheduled="features.isScheduled.value" @schedule="console.log('Scheduled')" @cancel="console.log('Cancelled')" />
					<MobileCamera />
				</div>

				<!-- Accessibility Tab -->
				<div v-if="activeTab === 'accessibility'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AutoSubtitles v-model:enabled="features.autoSubtitlesEnabled.value" />
						<SignLanguageWindow v-model:enabled="features.signLanguageEnabled.value" />
					</div>
					<Transcription />
					<AutoCloudBackup v-model:enabled="features.cloudBackupEnabled.value" />
				</div>

				<!-- Analytics Tab -->
				<div v-if="activeTab === 'analytics'" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SpeakingPaceAnalysis v-model:enabled="features.speakingPaceEnabled.value" />
						<FillerWordsDetection v-model:enabled="features.fillerWordsEnabled.value" />
					</div>
				</div>

				<!-- Shortcuts Tab -->
				<div v-if="activeTab === 'shortcuts'" class="space-y-6">
					<HotkeyCustomizer />
				</div>

				<RecordingAnnotations ref="annotationsRef" />
			</div>

			<div class="lg:col-span-1 space-y-6">
				<RecordingStats :recordings="editor.recordings.value" />
				<VideoRecordingsList
					:recordings="editor.recordings.value"
					@preview="editor.previewRecording"
					@edit="editor.openTrimEditor"
					@export="editor.openExportDialog"
					@delete="editor.deleteRecording"
				/>
				<VideoBatchExport :recordings="editor.recordings.value" @export="console.log" />
			</div>
		</div>

		<!-- Export Dialog -->
		<VideoExportDialog
			v-if="editor.selectedRecording.value"
			:is-open="editor.showExportDialog.value"
			:recording="editor.selectedRecording.value"
			@close="editor.showExportDialog.value = false"
			@export="handleExport(editor.selectedRecording.value!, $event)"
		/>

		<!-- Trim Editor -->
		<VideoTrimEditor
			v-if="editor.selectedRecording.value"
			:is-open="editor.showTrimEditor.value"
			:recording="editor.selectedRecording.value"
			@close="editor.showTrimEditor.value = false"
			@save="handleTrimSave"
		/>
	</div>
</template>
