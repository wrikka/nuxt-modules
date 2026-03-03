<script setup lang="ts">
import type { VSTPlugin } from "#shared/types/audio";

const props = defineProps<{
	plugins: VSTPlugin[];
}>();

const emit = defineEmits<{
	loadPlugin: [pluginPath: string];
	removePlugin: [pluginId: string];
	updateParameter: [pluginId: string, paramId: string, value: number];
	togglePlugin: [pluginId: string];
	bypassPlugin: [pluginId: string];
}>();

const showBrowser = ref(false);
const selectedCategory = ref("all");

const pluginDatabase = [
	{
		id: "fabfilter-pro-q",
		name: "FabFilter Pro-Q 3",
		vendor: "FabFilter",
		category: "eq",
		parameters: [
			{ name: "Frequency", default: 1000, min: 20, max: 20000 },
			{ name: "Gain", default: 0, min: -30, max: 30 },
			{ name: "Q", default: 1, min: 0.1, max: 100 },
		],
	},
	{
		id: "waves-ssl-comp",
		name: "SSL G-Master Buss Compressor",
		vendor: "Waves",
		category: "compressor",
		parameters: [
			{ name: "Threshold", default: 0, min: -20, max: 20 },
			{ name: "Ratio", default: 4, min: 2, max: 10 },
			{ name: "Attack", default: 3, min: 0.1, max: 30 },
			{ name: "Release", default: 0.3, min: 0.1, max: 1.2 },
		],
	},
	{
		id: "valhalla-vintage",
		name: "Valhalla VintageVerb",
		vendor: "Valhalla DSP",
		category: "reverb",
		parameters: [
			{ name: "Mix", default: 30, min: 0, max: 100 },
			{ name: "Decay", default: 2, min: 0.1, max: 20 },
			{ name: "PreDelay", default: 20, min: 0, max: 500 },
		],
	},
];

const categories = [
	{ value: "all", label: "All" },
	{ value: "eq", label: "EQ" },
	{ value: "compressor", label: "Dynamics" },
	{ value: "reverb", label: "Reverb" },
	{ value: "delay", label: "Delay" },
	{ value: "modulation", label: "Modulation" },
	{ value: "distortion", label: "Distortion" },
];

const filteredPlugins = computed(() => {
	if (selectedCategory.value === "all") return pluginDatabase;
	return pluginDatabase.filter(p => p.category === selectedCategory.value);
});

const loadPlugin = (template: typeof pluginDatabase[0]) => {
	emit("loadPlugin", template.id);
	showBrowser.value = false;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">VST Plugins</span>
			<button
				@click="showBrowser = !showBrowser"
				class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
			>
				{{ showBrowser ? "Close" : "Add Plugin" }}
			</button>
		</div>

		<!-- Plugin Chain -->
		<div v-if="props.plugins.length > 0" class="space-y-2 mb-4">
			<div
				v-for="(plugin, index) in props.plugins"
				:key="plugin.id"
				class="bg-gray-800 rounded p-3"
			>
				<div class="flex items-start justify-between mb-2">
					<div class="flex items-center gap-2">
						<span class="text-xs text-gray-500 w-4">{{ index + 1 }}</span>
						<div>
							<div
								class="text-sm font-medium"
								:class="plugin.enabled ? 'text-white' : 'text-gray-500'"
							>
								{{ plugin.name }}
							</div>
							<div class="text-xs text-gray-500">
								{{ plugin.vendor }} v{{ plugin.version }}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-1">
						<button
							@click="emit('togglePlugin', plugin.id)"
							:class="[
								'px-2 py-1 rounded text-xs transition-colors',
								plugin.enabled
									? 'bg-green-600 text-white'
									: 'bg-gray-700 text-gray-400',
							]"
						>
							{{ plugin.enabled ? "ON" : "OFF" }}
						</button>
						<button
							@click="emit('removePlugin', plugin.id)"
							class="p-1 text-gray-400 hover:text-red-400"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Parameters -->
				<div v-if="plugin.enabled" class="space-y-2 pl-6">
					<div
						v-for="param in plugin.parameters"
						:key="param.id"
					>
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-400">{{ param.name }}</span>
							<span class="text-gray-300">{{ param.value.toFixed(1) }}</span>
						</div>
						<input
							type="range"
							:min="param.min"
							:max="param.max"
							:step="(param.max - param.min) / 100"
							:value="param.value"
							@input="e =>
							emit(
								'updateParameter',
								plugin.id,
								param.id,
								parseFloat((e.target as HTMLInputElement).value),
							)"
							class="w-full accent-blue-500"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Plugin Browser -->
		<div v-if="showBrowser" class="bg-gray-800 rounded p-3">
			<div class="flex items-center gap-2 mb-3">
				<span class="text-xs text-gray-400">Category:</span>
				<select
					v-model="selectedCategory"
					class="bg-gray-700 text-white rounded px-2 py-1 text-xs border border-gray-600"
				>
					<option v-for="cat in categories" :key="cat.value" :value="cat.value">
						{{ cat.label }}
					</option>
				</select>
			</div>

			<div class="space-y-2 max-h-48 overflow-y-auto">
				<div
					v-for="plugin in filteredPlugins"
					:key="plugin.id"
					class="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer"
					@click="loadPlugin(plugin)"
				>
					<div>
						<div class="text-sm text-gray-300">{{ plugin.name }}</div>
						<div class="text-xs text-gray-500">{{ plugin.vendor }}</div>
					</div>
					<button class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">
						Load
					</button>
				</div>
			</div>
		</div>

		<p
			v-if="!showBrowser && props.plugins.length === 0"
			class="text-xs text-gray-500 text-center py-4"
		>
			Add VST plugins to enhance your audio processing chain
		</p>
	</div>
</template>
