<script setup lang="ts">
import { useVideoStore } from "~/stores/video";

const videoStore = useVideoStore();
const { history, historyIndex, canUndo, canRedo } = storeToRefs(videoStore);

const emit = defineEmits<{
	close: [];
}>();

const handleUndo = () => {
	videoStore.undo();
};

const handleRedo = () => {
	videoStore.redo();
};

const jumpToState = (index: number) => {
	videoStore.jumpToHistoryState(index);
};

const getActionIcon = (action: string): string => {
	const icons: Record<string, string> = {
		addClip: "i-ph-film-strip-plus",
		removeClip: "i-ph-film-strip-minus",
		trimClip: "i-ph-scissors",
		splitClip: "i-ph-split-horizontal",
		moveClip: "i-ph-arrows-out-cardinal",
		addTrack: "i-ph-stack-plus",
		removeTrack: "i-ph-stack-minus",
		addKeyframe: "i-ph-key",
		updateColor: "i-ph-palette",
		addTransition: "i-ph-arrows-left-right",
		default: "i-ph-clock-counter-clockwise",
	};
	return icons[action] ?? icons.default ?? "i-ph-clock-counter-clockwise";
};

const getActionLabel = (action: string): string => {
	const labels: Record<string, string> = {
		addClip: "Add Clip",
		removeClip: "Remove Clip",
		trimClip: "Trim Clip",
		splitClip: "Split Clip",
		moveClip: "Move Clip",
		addTrack: "Add Track",
		removeTrack: "Remove Track",
		addKeyframe: "Add Keyframe",
		updateColor: "Update Color",
		addTransition: "Add Transition",
	};
	return labels[action] ?? action ?? "Unknown Action";
};
</script>

<template>
	<div class="history-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-80 max-h-96 overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:history" class="w-5 h-5 text-blue-500" />
				History
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Undo/Redo Controls -->
		<div class="flex gap-2 mb-4">
			<button
				class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors"
				:class="canUndo
				? 'bg-blue-600 hover:bg-blue-700 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
				:disabled="!canUndo"
				@click="handleUndo"
			>
				<Icon name="mdi:undo" class="w-4 h-4" />
				Undo
			</button>
			<button
				class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors"
				:class="canRedo
				? 'bg-blue-600 hover:bg-blue-700 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
				:disabled="!canRedo"
				@click="handleRedo"
			>
				Redo
				<Icon name="mdi:redo" class="w-4 h-4" />
			</button>
		</div>

		<!-- History List -->
		<div class="flex-1 overflow-y-auto space-y-1">
			<div
				v-for="(state, index) in history"
				:key="state.id"
				class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
				:class="{
					'bg-blue-600 text-white': index === historyIndex,
					'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300':
						index !== historyIndex,
					'opacity-50': index > historyIndex,
				}"
				@click="jumpToState(index)"
			>
				<span :class="[getActionIcon(state.action), 'w-4 h-4 flex-shrink-0']" />
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium truncate">
						{{ getActionLabel(state.action) }}
					</div>
					<div class="text-xs opacity-75">
						{{ new Date(state.timestamp).toLocaleTimeString() }}
					</div>
				</div>
				<Icon
					v-if="index === historyIndex"
					name="mdi:check-circle"
					class="w-4 h-4 flex-shrink-0"
				/>
			</div>
		</div>

		<!-- Branch Indicator -->
		<div
			v-if="historyIndex < history.length - 1"
			class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-600/50 rounded-lg"
		>
			<div class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm">
				<Icon name="mdi:source-branch" class="w-4 h-4" />
				<span>Branch point - redoing will create alternate history</span>
			</div>
		</div>
	</div>
</template>
