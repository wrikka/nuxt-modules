<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [settings: ChromaKeySettings];
}>();

interface ChromaKeySettings {
	enabled: boolean;
	color: string;
	tolerance: number;
	feather: number;
	spillSuppression: number;
	opacity: number;
}

const settings = ref<ChromaKeySettings>({
	enabled: true,
	color: "#00ff00",
	tolerance: 30,
	feather: 5,
	spillSuppression: 50,
	opacity: 100,
});

const presets = [
	{ name: "Green Screen", color: "#00ff00", tolerance: 30 },
	{ name: "Blue Screen", color: "#0000ff", tolerance: 35 },
	{ name: "White BG", color: "#ffffff", tolerance: 20 },
];

const isProcessing = ref(false);
const showColorPicker = ref(false);

const loadPreset = (preset: typeof presets[0]) => {
	settings.value.color = preset.color;
	settings.value.tolerance = preset.tolerance;
};

const handleApply = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("apply", settings.value);
	}, 300);
};
</script>

<template>
	<div class="chroma-key-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:format-color-fill" class="w-5 h-5 text-blue-500" />
				Chroma Key
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Enable Toggle -->
		<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
			<span class="text-gray-900 dark:text-white text-sm font-medium"
			>Enable Chroma Key</span>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="settings.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="settings.enabled = !settings.enabled"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="settings.enabled ? 'left-7' : 'left-1'"
				/>
			</button>
		</div>

		<!-- Color Picker -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Key Color</label>
			<div class="flex gap-2">
				<button
					class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all"
					:style="{ backgroundColor: settings.color }"
					@click="showColorPicker = !showColorPicker"
				/>
				<div class="flex-1 flex gap-2">
					<button
						v-for="preset in presets"
						:key="preset.name"
						class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors"
						:style="{ backgroundColor: preset.color + '20' }"
						@click="loadPreset(preset)"
					>
						{{ preset.name }}
					</button>
				</div>
			</div>
			<input
				v-if="showColorPicker"
				v-model="settings.color"
				type="color"
				class="w-full mt-2 h-8 rounded cursor-pointer border-0"
			>
		</div>

		<!-- Tolerance -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Tolerance</label>
				<span class="text-blue-500 text-sm font-mono">{{
					settings.tolerance
				}}</span>
			</div>
			<input
				v-model="settings.tolerance"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Feather -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm">Feather</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.feather
					}}px</span>
			</div>
			<input
				v-model="settings.feather"
				type="range"
				min="0"
				max="20"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Spill Suppression -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Spill Suppression</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.spillSuppression
					}}%</span>
			</div>
			<input
				v-model="settings.spillSuppression"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Opacity -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm">Opacity</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.opacity
					}}%</span>
			</div>
			<input
				v-model="settings.opacity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Preview -->
		<div class="mb-4 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-500 dark:text-gray-400 text-xs">Preview</span>
				<div class="flex gap-2">
					<button class="w-4 h-4 rounded bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzMzIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzMzMiLz4KPC9zdmc+')]" />
					<button class="w-4 h-4 rounded bg-black" />
				</div>
			</div>
			<div class="aspect-video bg-white dark:bg-gray-800 rounded flex items-center justify-center">
				<div
					class="w-32 h-24 rounded border-2 flex items-center justify-center text-gray-500 text-xs"
					:style="{
						backgroundColor: settings.enabled ? 'transparent' : settings.color,
						borderColor: settings.color,
					}"
				>
					<span v-if="settings.enabled">Transparent</span>
					<span v-else>Original</span>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				:disabled="isProcessing || !settings.enabled"
				@click="handleApply"
			>
				<Icon
					v-if="isProcessing"
					name="mdi:loading"
					class="w-4 h-4 animate-spin"
				/>
				<Icon v-else name="mdi:check" class="w-4 h-4" />
				Apply Chroma Key
			</button>
		</div>
	</div>
</template>
