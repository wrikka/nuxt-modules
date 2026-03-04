<script setup lang="ts">
import { useVideoEditorShortcuts } from "~/composables/useVideoEditorShortcuts";

const {
	shortcuts,
	updateShortcut,
	resetToDefaults,
	isRecording,
	startRecording,
	stopRecording,
} = useVideoEditorShortcuts();

const emit = defineEmits<{
	close: [];
}>();

const searchQuery = ref("");
const selectedCategory = ref("all");
const recordingKey = ref<string | null>(null);

const categories = [
	{ id: "all", label: "All Shortcuts" },
	{ id: "playback", label: "Playback" },
	{ id: "editing", label: "Editing" },
	{ id: "timeline", label: "Timeline" },
	{ id: "navigation", label: "Navigation" },
];

const filteredShortcuts = computed(() => {
	let result = shortcuts.value;
	if (selectedCategory.value !== "all") {
		result = result.filter(s => s.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(s =>
			s.action.toLowerCase().includes(query)
			|| s.description.toLowerCase().includes(query)
			|| s.keys.join("+").toLowerCase().includes(query)
		);
	}
	return result;
});

const startRecordingShortcut = (shortcutId: string) => {
	recordingKey.value = shortcutId;
	startRecording(shortcutId);
};

const handleKeyDown = (e: KeyboardEvent) => {
	if (!recordingKey.value || !isRecording.value) return;

	e.preventDefault();
	const keys: string[] = [];
	if (e.ctrlKey) keys.push("Ctrl");
	if (e.altKey) keys.push("Alt");
	if (e.shiftKey) keys.push("Shift");
	if (e.metaKey) keys.push("Cmd");
	if (!["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
		keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
	}

	updateShortcut(recordingKey.value, keys);
	recordingKey.value = null;
	stopRecording();
};

const formatKeys = (keys: string[]) => {
	return keys.map(key => {
		const icons: Record<string, string> = {
			Ctrl: "⌃",
			Alt: "⌥",
			Shift: "⇧",
			Cmd: "⌘",
			Enter: "↵",
			Backspace: "⌫",
			Delete: "⌦",
			ArrowLeft: "←",
			ArrowRight: "→",
			ArrowUp: "↑",
			ArrowDown: "↓",
			Space: "␣",
		};
		return icons[key] || key;
	}).join(" + ");
};

onMounted(() => {
	window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
	<div
		class="shortcuts-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-96 max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700"
		:class="{ 'recording': isRecording }"
	>
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:keyboard" class="w-5 h-5 text-blue-500" />
				Keyboard Shortcuts
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Search -->
		<div class="relative mb-4">
			<Icon
				name="mdi:magnify"
				class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
			/>
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search shortcuts..."
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
			>
		</div>

		<!-- Categories -->
		<div class="flex gap-2 mb-4 overflow-x-auto pb-2">
			<button
				v-for="cat in categories"
				:key="cat.id"
				class="px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors"
				:class="selectedCategory === cat.id
				? 'bg-blue-600 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="selectedCategory = cat.id"
			>
				{{ cat.label }}
			</button>
		</div>

		<!-- Recording Indicator -->
		<div
			v-if="isRecording"
			class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500 rounded-lg flex items-center gap-3 animate-pulse"
		>
			<Icon name="mdi:circle" class="w-5 h-5 text-red-500" />
			<span class="text-red-600 dark:text-red-400 text-sm"
			>Press key combination to set shortcut...</span>
			<button
				class="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
				@click="stopRecording();
				recordingKey = null;"
			>
				Cancel
			</button>
		</div>

		<!-- Shortcuts List -->
		<div class="flex-1 overflow-y-auto space-y-1">
			<div
				v-for="shortcut in filteredShortcuts"
				:key="shortcut.id"
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
			>
				<div class="flex-1 min-w-0">
					<div class="text-gray-900 dark:text-white text-sm font-medium">
						{{ shortcut.action }}
					</div>
					<div class="text-gray-500 dark:text-gray-400 text-xs">
						{{ shortcut.description }}
					</div>
				</div>
				<div class="flex items-center gap-2">
					<div
						class="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm font-mono"
						:class="recordingKey === shortcut.id ? 'ring-2 ring-blue-500' : ''"
					>
						<kbd
							v-for="(key, i) in shortcut.keys"
							:key="i"
							class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs"
						>
							{{ formatKeys([key]) }}
						</kbd>
					</div>
					<button
						class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-500 transition-all"
						:class="{ 'opacity-100': recordingKey === shortcut.id }"
						@click="startRecordingShortcut(shortcut.id)"
					>
						<Icon name="mdi:pencil" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
			<button
				class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm flex items-center gap-2"
				@click="resetToDefaults"
			>
				<Icon name="mdi:rotate-left" class="w-4 h-4" />
				Reset to Defaults
			</button>
			<div class="text-gray-500 text-xs">
				{{ filteredShortcuts.length }} shortcuts
			</div>
		</div>
	</div>
</template>

<style scoped>
.recording {
	outline: 2px solid rgba(239, 68, 68, 0.5);
}
</style>
