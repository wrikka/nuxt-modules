import { ref } from "vue";

export interface VideoRecordingFeatures {
	// AI Features
	aiAutoFramingEnabled: Ref<boolean>;
	aiFramingMode: Ref<"center" | "upper-body" | "headshot" | "dynamic">;
	aiEyeContactEnabled: Ref<boolean>;
	aiSilenceRemovalEnabled: Ref<boolean>;
	aiHighlightDetectionEnabled: Ref<boolean>;
	thumbnailGeneratorEnabled: Ref<boolean>;
	// Collaboration Features
	liveStreamingEnabled: Ref<boolean>;
	liveChatOverlayEnabled: Ref<boolean>;
	guestRecordingEnabled: Ref<boolean>;
	// Production Features
	multiCameraEnabled: Ref<boolean>;
	sceneTransitionsEnabled: Ref<boolean>;
	lowerThirdsEnabled: Ref<boolean>;
	audioDuckingEnabled: Ref<boolean>;
	voiceModulationEnabled: Ref<boolean>;
	videoFiltersEnabled: Ref<boolean>;
	clickVisualizerEnabled: Ref<boolean>;
	// Virtual Background
	virtualBackgroundEnabled: Ref<boolean>;
	virtualBackgroundType: Ref<"blur" | "color" | "image">;
	blurAmount: Ref<number>;
	backgroundColor: Ref<string>;
	backgroundImage: Ref<string>;
	// PiP & Zoom
	pipLayout: Ref<string>;
	isZoomEnabled: Ref<boolean>;
	zoomLevel: Ref<number>;
	panX: Ref<number>;
	panY: Ref<number>;
	// Drawing & Watermark
	isDrawingEnabled: Ref<boolean>;
	watermarkText: Ref<string>;
	// Presets & Templates
	selectedPreset: Ref<string>;
	selectedTemplate: Ref<string>;
	// Workflow Features
	smartFileNamingEnabled: Ref<boolean>;
	isScheduled: Ref<boolean>;
	// Accessibility Features
	autoSubtitlesEnabled: Ref<boolean>;	signLanguageEnabled: Ref<boolean>;
	cloudBackupEnabled: Ref<boolean>;
	// Analytics Features
	speakingPaceEnabled: Ref<boolean>;
	fillerWordsEnabled: Ref<boolean>;
	// Chapter Markers
	chapterMarkers: Ref<{ time: number; label: string }[]>;
}

export const useVideoRecordingFeatures = (): VideoRecordingFeatures => {
	// AI Features
	const aiAutoFramingEnabled = ref(false);
	const aiFramingMode = ref<"center" | "upper-body" | "headshot" | "dynamic">("center");
	const aiEyeContactEnabled = ref(false);
	const aiSilenceRemovalEnabled = ref(false);
	const aiHighlightDetectionEnabled = ref(false);
	const thumbnailGeneratorEnabled = ref(false);

	// Collaboration Features
	const liveStreamingEnabled = ref(false);
	const liveChatOverlayEnabled = ref(false);
	const guestRecordingEnabled = ref(false);

	// Production Features
	const multiCameraEnabled = ref(false);
	const sceneTransitionsEnabled = ref(false);
	const lowerThirdsEnabled = ref(false);
	const audioDuckingEnabled = ref(false);
	const voiceModulationEnabled = ref(false);
	const videoFiltersEnabled = ref(false);
	const clickVisualizerEnabled = ref(false);

	// Virtual Background
	const virtualBackgroundEnabled = ref(false);
	const virtualBackgroundType = ref<"blur" | "color" | "image">("blur");
	const blurAmount = ref(10);
	const backgroundColor = ref("#000000");
	const backgroundImage = ref("");

	// PiP & Zoom
	const pipLayout = ref("bottom-right");
	const isZoomEnabled = ref(false);
	const zoomLevel = ref(1);
	const panX = ref(0);
	const panY = ref(0);

	// Drawing & Watermark
	const isDrawingEnabled = ref(false);
	const watermarkText = ref("");

	// Presets & Templates
	const selectedPreset = ref("youtube-1080");
	const selectedTemplate = ref("default");

	// Workflow Features
	const smartFileNamingEnabled = ref(false);
	const isScheduled = ref(false);

	// Accessibility Features
	const autoSubtitlesEnabled = ref(false);
	const signLanguageEnabled = ref(false);
	const cloudBackupEnabled = ref(false);

	// Analytics Features
	const speakingPaceEnabled = ref(false);
	const fillerWordsEnabled = ref(false);

	// Chapter Markers
	const chapterMarkers = ref<{ time: number; label: string }[]>([]);

	return {
		// AI Features
		aiAutoFramingEnabled,
		aiFramingMode,
		aiEyeContactEnabled,
		aiSilenceRemovalEnabled,
		aiHighlightDetectionEnabled,
		thumbnailGeneratorEnabled,
		// Collaboration Features
		liveStreamingEnabled,
		liveChatOverlayEnabled,
		guestRecordingEnabled,
		// Production Features
		multiCameraEnabled,
		sceneTransitionsEnabled,
		lowerThirdsEnabled,
		audioDuckingEnabled,
		voiceModulationEnabled,
		videoFiltersEnabled,
		clickVisualizerEnabled,
		// Virtual Background
		virtualBackgroundEnabled,
		virtualBackgroundType,
		blurAmount,
		backgroundColor,
		backgroundImage,
		// PiP & Zoom
		pipLayout,
		isZoomEnabled,
		zoomLevel,
		panX,
		panY,
		// Drawing & Watermark
		isDrawingEnabled,
		watermarkText,
		// Presets & Templates
		selectedPreset,
		selectedTemplate,
		// Workflow Features
		smartFileNamingEnabled,
		isScheduled,
		// Accessibility Features
		autoSubtitlesEnabled,
		signLanguageEnabled,
		cloudBackupEnabled,
		// Analytics Features
		speakingPaceEnabled,
		fillerWordsEnabled,
		// Chapter Markers
		chapterMarkers,
	};
};
