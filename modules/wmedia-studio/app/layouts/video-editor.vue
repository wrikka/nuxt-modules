<script setup lang="ts">
import { useVideoEditor } from "~/composables/useVideoEditor";
import { useVideoProjectManagement } from "~/composables/useVideoProjectManagement";
import { useCollaborationStore } from "~/stores/collaboration";
import { useVideoStore } from "~/stores/video";

const videoStore = useVideoStore();
const collaborationStore = useCollaborationStore();
const { enableAutoSave, markAsUnsaved } = useVideoProjectManagement();
const { addVideoClip, addImageClip, addAudioClip } = useVideoEditor();

const route = useRoute();

// Additional panel visibility states
const showMediaBin = ref(true);
const showEffects = ref(false);
const showColorGrading = ref(false);
const showChromaKey = ref(false);
const showStabilization = ref(false);
const showMotionTracking = ref(false);
const showSpeedRamping = ref(false);
const showTransitions = ref(false);
const showTextOverlay = ref(false);
const showCaptions = ref(false);
const showAudioMixer = ref(false);
const showAudioDucking = ref(false);
const showExport = ref(false);
const showHistory = ref(false);
const showMarkers = ref(false);
const showComments = ref(false);
const showScreenRecord = ref(false);
const showProxyMedia = ref(false);
const showBackgroundRender = ref(false);
const showSmartReframe = ref(false);
const showNestedSequences = ref(false);
const showMultiCamera = ref(false);
const showSceneDetection = ref(false);
const showTranscription = ref(false);
const showSubtitleBurnIn = ref(false);
const showVersionCompare = ref(false);
const showWaveformSync = ref(false);
const showVoiceOver = ref(false);
const showBatchExport = ref(false);
const showLUT = ref(false);
const showKeyboardShortcuts = ref(false);
const showTemplates = ref(false);
const showAudioEffects = ref(false);
const showMasking = ref(false);
const showCompoundClip = ref(false);
const showCollaboration = ref(false);

const handleMediaAssetDrop = async (
	asset: MediaAsset,
	trackId: string,
	startTime: number,
) => {
	if (asset.type === "video") {
		await addVideoClipFromAsset(asset, trackId, startTime);
	} else if (asset.type === "image") {
		await addImageClipFromAsset(asset, trackId, startTime);
	} else if (asset.type === "audio") {
		await addAudioClipFromAsset(asset, trackId, startTime);
	}
};

const addVideoClipFromAsset = async (
	asset: MediaAsset,
	trackId: string,
	startTime: number,
) => {
	// Implementation would use the existing addVideoClip logic
	console.log("Adding video clip from asset:", asset.name);
};

const addImageClipFromAsset = async (
	asset: MediaAsset,
	trackId: string,
	startTime: number,
) => {
	console.log("Adding image clip from asset:", asset.name);
};

const addAudioClipFromAsset = async (
	asset: MediaAsset,
	trackId: string,
	startTime: number,
) => {
	console.log("Adding audio clip from asset:", asset.name);
};

onMounted(async () => {
	const projectId = route.params.id as string;
	if (projectId) {
		await videoStore.loadProject(projectId);
		await collaborationStore.connect(projectId);
		enableAutoSave(30000);
	}
});

onUnmounted(() => {
	collaborationStore.disconnect();
});

watch(
	() => videoStore.currentVideoProject,
	() => {
		markAsUnsaved();
	},
	{ deep: true },
);
</script>

<template>
	<div class="h-screen flex flex-col bg-gray-900 dark:bg-black overflow-hidden">
		<TheVideoHeader
			@show-keyboard-shortcuts="showKeyboardShortcuts = true"
			@show-export="showExport = true"
		/>
		<div class="flex-1 flex overflow-hidden">
			<TheVideoSidebar
				@toggle-media-bin="showMediaBin = !showMediaBin"
				@show-effects="showEffects = true"
				@show-color-grading="showColorGrading = true"
				@show-chroma-key="showChromaKey = true"
				@show-stabilization="showStabilization = true"
				@show-motion-tracking="showMotionTracking = true"
				@show-transitions="showTransitions = true"
				@show-text-overlay="showTextOverlay = true"
				@show-captions="showCaptions = true"
				@show-audio-mixer="showAudioMixer = true"
				@show-markers="showMarkers = true"
				@show-comments="showComments = true"
				@show-screen-record="showScreenRecord = true"
				@show-proxy-media="showProxyMedia = true"
				@show-background-render="showBackgroundRender = true"
				@show-smart-reframe="showSmartReframe = true"
				@show-nested-sequences="showNestedSequences = true"
				@show-multi-camera="showMultiCamera = true"
				@show-scene-detection="showSceneDetection = true"
				@show-transcription="showTranscription = true"
				@show-history="showHistory = true"
				@show-audio-effects="showAudioEffects = true"
				@show-masking="showMasking = true"
				@show-compound-clip="showCompoundClip = true"
				@show-collaboration="showCollaboration = true"
				@show-templates="showTemplates = true"
			/>
			<MediaBin
				v-if="showMediaBin && videoStore.currentVideoProject"
				:assets="videoStore.currentVideoProject.mediaAssets"
				@add-to-timeline="handleMediaAssetDrop"
				@remove="videoStore.removeMediaAsset"
			/>
			<main class="flex-1 flex flex-col overflow-hidden">
				<TheVideoToolbar
					@show-speed-ramping="showSpeedRamping = true"
					@show-audio-ducking="showAudioDucking = true"
					@show-lut="showLUT = true"
				/>
				<div class="flex-1 flex overflow-hidden">
					<TheVideoPlayer />
					<TheVideoPropertiesPanel />
				</div>
				<TheVideoTimeline />
			</main>
			<TheVideoLayersPanel />
		</div>
		<EffectsPanel v-if="showEffects" @close="showEffects = false" />
		<ColorGradingEditor
			v-if="showColorGrading"
			@close="showColorGrading = false"
		/>
		<ChromaKeyPanel v-if="showChromaKey" @close="showChromaKey = false" />
		<StabilizationPanel
			v-if="showStabilization"
			@close="showStabilization = false"
		/>
		<MotionTrackingPanel
			v-if="showMotionTracking"
			@close="showMotionTracking = false"
		/>
		<SpeedRampingPanel
			v-if="showSpeedRamping"
			@close="showSpeedRamping = false"
		/>
		<TransitionPanel v-if="showTransitions" @close="showTransitions = false" />
		<TextOverlayPanel v-if="showTextOverlay" @close="showTextOverlay = false" />
		<CaptionsEditor v-if="showCaptions" @close="showCaptions = false" />
		<AudioMixerPanel v-if="showAudioMixer" @close="showAudioMixer = false" />
		<AudioDuckingPanel
			v-if="showAudioDucking"
			@close="showAudioDucking = false"
		/>
		<ExportPanel v-if="showExport" @close="showExport = false" />
		<HistoryPanel v-if="showHistory" @close="showHistory = false" />
		<MarkersPanel v-if="showMarkers" @close="showMarkers = false" />
		<CommentsPanel
			v-if="showComments"
			:is-open="showComments"
			@close="showComments = false"
		/>
		<ScreenRecordPanel
			v-if="showScreenRecord"
			@close="showScreenRecord = false"
		/>
		<ProxyMediaPanel v-if="showProxyMedia" @close="showProxyMedia = false" />
		<BackgroundRenderPanel
			v-if="showBackgroundRender"
			@close="showBackgroundRender = false"
		/>
		<SmartReframePanel
			v-if="showSmartReframe"
			@close="showSmartReframe = false"
		/>
		<NestedSequencesPanel
			v-if="showNestedSequences"
			@close="showNestedSequences = false"
		/>
		<MultiCameraSyncPanel
			v-if="showMultiCamera"
			@close="showMultiCamera = false"
		/>
		<SceneDetectionPanel
			v-if="showSceneDetection"
			@close="showSceneDetection = false"
		/>
		<TranscriptionExportPanel
			v-if="showTranscription"
			@close="showTranscription = false"
		/>
		<SubtitleBurnInPanel
			v-if="showSubtitleBurnIn"
			@close="showSubtitleBurnIn = false"
		/>
		<VersionComparePanel
			v-if="showVersionCompare"
			@close="showVersionCompare = false"
		/>
		<WaveformSyncPanel
			v-if="showWaveformSync"
			@close="showWaveformSync = false"
		/>
		<VoiceOverPanel v-if="showVoiceOver" @close="showVoiceOver = false" />
		<BatchExportPanel v-if="showBatchExport" @close="showBatchExport = false" />
		<LUTPanel v-if="showLUT" @close="showLUT = false" />
		<KeyboardShortcutsPanel
			v-if="showKeyboardShortcuts"
			@close="showKeyboardShortcuts = false"
		/>
		<TemplatesPanel v-if="showTemplates" @close="showTemplates = false" />
		<AudioEffectsPanel
			v-if="showAudioEffects"
			@close="showAudioEffects = false"
		/>
		<MaskingPanel v-if="showMasking" @close="showMasking = false" />
		<CompoundClipPanel
			v-if="showCompoundClip"
			@close="showCompoundClip = false"
		/>
		<CollaborationPanel
			v-if="showCollaboration"
			@close="showCollaboration = false"
		/>
		<TheCollaborationCursors />
		<PerformancePanel />
		<PluginManager />
	</div>
</template>
