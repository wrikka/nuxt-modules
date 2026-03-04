<script setup lang="ts">
import ABComparison from "~/components/audio-editor/ABComparison.vue";
import AIMastering from "~/components/audio-editor/AIMastering.vue";
import AudioAligner from "~/components/audio-editor/AudioAligner.vue";
import AudioCalculator from "~/components/audio-editor/AudioCalculator.vue";
import AudioControls from "~/components/audio-editor/AudioControls.vue";
import AudioEffectsAdvanced from "~/components/audio-editor/AudioEffectsAdvanced.vue";
import AudioEffectsPanel from "~/components/audio-editor/AudioEffectsPanel.vue";
import AudioExport from "~/components/audio-editor/AudioExport.vue";
import AudioLibrary from "~/components/audio-editor/AudioLibrary.vue";
import AudioTimeline from "~/components/audio-editor/AudioTimeline.vue";
import BatchProcessor from "~/components/audio-editor/BatchProcessor.vue";
import BeatMaker from "~/components/audio-editor/BeatMaker.vue";
import ClipGroupsPanel from "~/components/audio-editor/ClipGroupsPanel.vue";
import ClipTrimmer from "~/components/audio-editor/ClipTrimmer.vue";
import CloudExport from "~/components/audio-editor/CloudExport.vue";
import CollaborativeCursors from "~/components/audio-editor/CollaborativeCursors.vue";
import CrossfadeEditor from "~/components/audio-editor/CrossfadeEditor.vue";
import LoudnessMeter from "~/components/audio-editor/LoudnessMeter.vue";
import MarkersPanel from "~/components/audio-editor/MarkersPanel.vue";
import MidiEditor from "~/components/audio-editor/MidiEditor.vue";
import NoiseReductionPanel from "~/components/audio-editor/NoiseReductionPanel.vue";
import NormalizationPanel from "~/components/audio-editor/NormalizationPanel.vue";
import ProjectControls from "~/components/audio-editor/ProjectControls.vue";
import SidechainPanel from "~/components/audio-editor/SidechainPanel.vue";
import SoundDetector from "~/components/audio-editor/SoundDetector.vue";
import SpectralAnalyzer from "~/components/audio-editor/SpectralAnalyzer.vue";
import SpectrumEQ from "~/components/audio-editor/SpectrumEQ.vue";
import StemSeparationPanel from "~/components/audio-editor/StemSeparationPanel.vue";
import TemplatesPanel from "~/components/audio-editor/TemplatesPanel.vue";
import TranscriptionPanel from "~/components/audio-editor/TranscriptionPanel.vue";
import TransportControls from "~/components/audio-editor/TransportControls.vue";
import VersionHistory from "~/components/audio-editor/VersionHistory.vue";
import VideoSyncPanel from "~/components/audio-editor/VideoSyncPanel.vue";
import VoiceChanger from "~/components/audio-editor/VoiceChanger.vue";
import VSTPluginPanel from "~/components/audio-editor/VSTPluginPanel.vue";
import WaveformViewer from "~/components/audio-editor/WaveformViewer.vue";

// 24 New Components
import AudioCompareTool from "~/components/audio-editor/AudioCompareTool.vue";
import AudioReactiveVisuals from "~/components/audio-editor/AudioReactiveVisuals.vue";
import AudioRestorationAI from "~/components/audio-editor/AudioRestorationAI.vue";
import AudioStatsDashboard from "~/components/audio-editor/AudioStatsDashboard.vue";
import AudioWatermarking from "~/components/audio-editor/AudioWatermarking.vue";
import BatchMetadataEditor from "~/components/audio-editor/BatchMetadataEditor.vue";
import ClipAutoAlign from "~/components/audio-editor/ClipAutoAlign.vue";
import ConvolutionReverb from "~/components/audio-editor/ConvolutionReverb.vue";
import DynamicCompressorVisualizer from "~/components/audio-editor/DynamicCompressorVisualizer.vue";
import DynamicEQ from "~/components/audio-editor/DynamicEQ.vue";
import LiveMonitoringPanel from "~/components/audio-editor/LiveMonitoringPanel.vue";
import LoopLibraryBrowser from "~/components/audio-editor/LoopLibraryBrowser.vue";
import LufsNormalizationPanel from "~/components/audio-editor/LufsNormalizationPanel.vue";
import MidiToAudioPanel from "~/components/audio-editor/MidiToAudioPanel.vue";
import MultiChannelExport from "~/components/audio-editor/MultiChannelExport.vue";
import PluginChainPresets from "~/components/audio-editor/PluginChainPresets.vue";
import PodcastChapterMarkers from "~/components/audio-editor/PodcastChapterMarkers.vue";
import ScriptingMacrosPanel from "~/components/audio-editor/ScriptingMacrosPanel.vue";
import SmartSilenceDetector from "~/components/audio-editor/SmartSilenceDetector.vue";
import SpectralSelectionTool from "~/components/audio-editor/SpectralSelectionTool.vue";
import TimeStretchPanel from "~/components/audio-editor/TimeStretchPanel.vue";
import TrackFreezePanel from "~/components/audio-editor/TrackFreezePanel.vue";
import VirtualCablePanel from "~/components/audio-editor/VirtualCablePanel.vue";
import VoiceEnhancementSuite from "~/components/audio-editor/VoiceEnhancementSuite.vue";

const { audioBuffer } = useAudioEditor();

useAudioKeyboardShortcuts();

const activeTab = ref<
	| "edit"
	| "effects"
	| "ai"
	| "analysis"
	| "sync"
	| "collab"
	| "export"
	| "advanced"
>("edit");
const showBatchProcessor = ref(false);
const showCloudExport = ref(false);
const showAudioCalculator = ref(false);

// State for new components
const projectName = ref("Untitled Project");
const midiTracks = ref<
	{ id: string; name: string; instrument: string; isArmed: boolean }[]
>([]);
const tracksForFreeze = ref<
	{
		id: string;
		name: string;
		effects: string[];
		cpuUsage: number;
		originalColor: string;
		isFrozen: boolean;
	}[]
>([]);

// Audio context and state for components
const audioContext = ref<AudioContext | null>(null);
const audioDuration = ref(0);
const activePlugins = ref<any[]>([]);
const versions = ref<any[]>([]);
</script>

<template>
	<div class="flex-1 flex flex-col overflow-hidden bg-gray-950">
		<!-- Top: Project Controls -->
		<div class="border-b border-gray-800">
			<ProjectControls />
			<MarkersPanel />
		</div>

		<!-- Tabs -->
		<div class="flex gap-2 border-b border-gray-800 px-4 py-2 bg-gray-900">
			<button
				v-for='tab in [
					"edit",
					"effects",
					"ai",
					"analysis",
					"sync",
					"collab",
					"export",
					"advanced",
				]'
				:key="tab"
				@click="activeTab = tab as any"
				:class="[
					'px-4 py-1 text-sm font-medium capitalize transition-colors',
					activeTab === tab
						? 'text-purple-400 border-b-2 border-purple-400'
						: 'text-gray-400 hover:text-gray-200',
				]"
			>
				{{ tab }}
			</button>
			<button
				@click="showBatchProcessor = true"
				class="ml-auto px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
			>
				Batch Process
			</button>
		</div>

		<!-- Main Workspace -->
		<div class="flex-1 flex overflow-hidden">
			<!-- Main Area -->
			<div class="flex-1 flex flex-col overflow-hidden">
				<WaveformViewer />
				<TransportControls />

				<div
					v-if="!audioBuffer"
					class="flex-1 flex flex-col items-center justify-center text-gray-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-16 w-16 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
						/>
					</svg>
					<p class="text-lg mb-2">No audio loaded</p>
					<p class="text-sm">Import an audio file to start editing</p>
				</div>

				<div v-else class="flex-1 overflow-auto p-4 space-y-4">
					<div v-if="activeTab === 'edit'" class="space-y-4">
						<AudioTimeline />
						<ClipTrimmer />
						<CrossfadeEditor :tracks="[]" :selectedTrackId="null" />
						<MidiEditor :tracks="[]" />
						<SmartSilenceDetector :audio-buffer="audioBuffer" />
						<TimeStretchPanel :audio-buffer="audioBuffer" />
						<PluginChainPresets />
						<SpectralSelectionTool :audio-buffer="audioBuffer" />
						<AudioCompareTool :audio-buffer="audioBuffer" />
						<ClipGroupsPanel :clips="[]" :groups="[]" />
					</div>
					<div v-if="activeTab === 'effects'" class="space-y-4">
						<AudioEffectsAdvanced />
						<AudioEffectsPanel />
						<SpectrumEQ />
						<SidechainPanel :tracks="[]" :currentTrackId="null" />
						<NoiseReductionPanel :audio-buffer="audioBuffer" />
						<NormalizationPanel :targetLoudness="-16" :truePeakLimit="-1" />
						<VoiceEnhancementSuite :audio-buffer="audioBuffer" />
						<DynamicCompressorVisualizer :audio-context="audioContext" />
						<DynamicEQ :audio-context="audioContext" />
						<ConvolutionReverb :audio-context="audioContext" />
						<LoopLibraryBrowser :project-bpm="120" />
					</div>
					<div v-if="activeTab === 'ai'" class="space-y-4">
						<AIMastering :audio-buffer="audioBuffer" />
						<StemSeparationPanel :audio-buffer="audioBuffer" />
						<VoiceChanger :audio-buffer="audioBuffer" />
						<TranscriptionPanel :audio-buffer="audioBuffer" />
						<AudioRestorationAI :audio-buffer="audioBuffer" />
						<ClipAutoAlign :tracks="[]" />
					</div>
					<div v-if="activeTab === 'analysis'" class="space-y-4">
						<SpectralAnalyzer :audio-context="audioContext" />
						<LoudnessMeter :audio-context="audioContext" />
						<SoundDetector :audio-buffer="audioBuffer" />
						<AudioStatsDashboard
							:audio-context="audioContext"
							:audio-buffer="audioBuffer"
						/>
						<LiveMonitoringPanel :audio-context="audioContext" />
					</div>
					<div v-if="activeTab === 'sync'" class="space-y-4">
						<VideoSyncPanel :audio-duration="audioDuration" />
						<AudioAligner :tracks="[]" :audio-buffers="new Map()" />
						<BeatMaker />
						<VirtualCablePanel />
					</div>
					<div v-if="activeTab === 'collab'" class="space-y-4">
						<CollaborativeCursors :cursors="[]" current-user-id="" />
						<VersionHistory :versions="versions" />
						<ScriptingMacrosPanel />
					</div>
					<div v-if="activeTab === 'export'" class="space-y-4">
						<CloudExport :project-name="projectName" :audio-blob="null" />
						<AudioCalculator />
						<MultiChannelExport
							:audio-buffer="audioBuffer"
							:project-name="projectName"
						/>
						<BatchMetadataEditor />
						<LufsNormalizationPanel :audio-buffer="audioBuffer" />
						<PodcastChapterMarkers :audio-duration="audioDuration" />
						<AudioWatermarking :audio-buffer="audioBuffer" />
					</div>
					<div v-if="activeTab === 'advanced'" class="space-y-4">
						<MidiToAudioPanel :midi-tracks="midiTracks" />
						<TrackFreezePanel :tracks="tracksForFreeze" />
						<AudioReactiveVisuals :audio-context="audioContext" />
					</div>
				</div>
			</div>

			<!-- Side Panels -->
			<div class="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto p-4 space-y-4">
				<AudioLibrary />
				<AudioControls />
				<TemplatesPanel />
				<VSTPluginPanel :plugins="activePlugins" />
				<AudioCalculator />
			</div>
		</div>

		<!-- Bottom: Export -->
		<div class="border-t border-gray-800">
			<AudioExport />
		</div>

		<!-- Dialogs -->
		<BatchProcessor
			v-if="showBatchProcessor"
			:clips="[]"
			@process="showBatchProcessor = false"
		/>
	</div>
</template>
