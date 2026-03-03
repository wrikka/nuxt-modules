<script setup lang="ts">
interface Preset {
	id: string;
	name: string;
	category: string;
	effects: string[];
	isBuiltIn: boolean;
}

const presets = ref<Preset[]>([
	{
		id: "1",
		name: "Warm Vocal",
		category: "Vocals",
		effects: ["EQ", "Compressor", "De-esser", "Reverb"],
		isBuiltIn: true,
	},
	{
		id: "2",
		name: "Radio Voice",
		category: "Vocals",
		effects: ["EQ", "Compressor", "Limiter"],
		isBuiltIn: true,
	},
	{
		id: "3",
		name: "Punchy Drums",
		category: "Drums",
		effects: ["EQ", "Compressor", "Transient Shaper"],
		isBuiltIn: true,
	},
	{
		id: "4",
		name: "Bass Boost",
		category: "Bass",
		effects: ["EQ", "Saturation", "Compressor"],
		isBuiltIn: true,
	},
	{
		id: "5",
		name: "Acoustic Guitar",
		category: "Guitar",
		effects: ["EQ", "Compressor", "Reverb"],
		isBuiltIn: true,
	},
	{
		id: "6",
		name: "Electronic Mix",
		category: "Mix",
		effects: ["EQ", "Compressor", "Limiter", "Stereo Widener"],
		isBuiltIn: true,
	},
]);

const customPresets = ref<Preset[]>([]);
const searchQuery = ref("");
const selectedCategory = ref("All");
const showSaveDialog = ref(false);
const newPresetName = ref("");
const newPresetCategory = ref("Custom");

const categories = [
	"All",
	"Vocals",
	"Drums",
	"Bass",
	"Guitar",
	"Mix",
	"Custom",
];

const filteredPresets = computed(() => {
	let result = [...presets.value, ...customPresets.value];

	if (selectedCategory.value !== "All") {
		result = result.filter(p => p.category === selectedCategory.value);
	}

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(p =>
			p.name.toLowerCase().includes(query)
			|| p.effects.some(e => e.toLowerCase().includes(query))
		);
	}

	return result;
});

const applyPreset = (preset: Preset) => {
	console.log("Applying preset:", preset.name);
};

const savePreset = () => {
	if (!newPresetName.value.trim()) return;

	const preset: Preset = {
		id: Date.now().toString(),
		name: newPresetName.value,
		category: newPresetCategory.value,
		effects: ["EQ", "Compressor"], // Would come from current chain
		isBuiltIn: false,
	};

	customPresets.value.push(preset);
	newPresetName.value = "";
	showSaveDialog.value = false;
};

const deletePreset = (preset: Preset) => {
	if (preset.isBuiltIn) return;
	customPresets.value = customPresets.value.filter(p => p.id !== preset.id);
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
					/>
				</svg>
				Plugin Chain Presets
			</h3>
			<button
				@click="showSaveDialog = true"
				class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
			>
				Save Current
			</button>
		</div>

		<!-- Search & Filter -->
		<div class="space-y-2">
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search presets..."
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
			/>

			<div class="flex gap-1 overflow-x-auto pb-1">
				<button
					v-for="cat in categories"
					:key="cat"
					@click="selectedCategory = cat"
					:class="[
						'px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
						selectedCategory === cat
							? 'bg-purple-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
				>
					{{ cat }}
				</button>
			</div>
		</div>

		<!-- Presets List -->
		<div class="max-h-64 overflow-y-auto space-y-2">
			<div
				v-for="preset in filteredPresets"
				:key="preset.id"
				class="group p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors cursor-pointer"
				@click="applyPreset(preset)"
			>
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="font-medium text-white">{{ preset.name }}</span>
							<span
								v-if="preset.isBuiltIn"
								class="px-1.5 py-0.5 bg-blue-900/50 text-blue-400 text-xs rounded"
							>
								Built-in
							</span>
							<span
								v-else
								class="px-1.5 py-0.5 bg-purple-900/50 text-purple-400 text-xs rounded"
							>
								Custom
							</span>
						</div>
						<div class="text-xs text-gray-500 mt-1">{{ preset.category }}</div>
						<div class="flex flex-wrap gap-1 mt-2">
							<span
								v-for="effect in preset.effects"
								:key="effect"
								class="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
							>
								{{ effect }}
							</span>
						</div>
					</div>
					<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							@click.stop="applyPreset(preset)"
							class="p-1.5 text-purple-400 hover:bg-purple-900/30 rounded transition-colors"
							title="Apply"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</button>
						<button
							v-if="!preset.isBuiltIn"
							@click.stop="deletePreset(preset)"
							class="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors"
							title="Delete"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div
				v-if="filteredPresets.length === 0"
				class="text-center py-8 text-gray-500 text-sm"
			>
				No presets found
			</div>
		</div>

		<!-- Save Dialog -->
		<div
			v-if="showSaveDialog"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-gray-900 rounded-lg p-6 w-96 space-y-4">
				<h4 class="text-lg font-semibold text-white">Save Preset</h4>

				<div class="space-y-3">
					<div>
						<label class="text-xs text-gray-400 block mb-1">Preset Name</label>
						<input
							v-model="newPresetName"
							type="text"
							placeholder="My Custom Chain"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
							@keyup.enter="savePreset"
						/>
					</div>

					<div>
						<label class="text-xs text-gray-400 block mb-1">Category</label>
						<select
							v-model="newPresetCategory"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
						>
							<option value="Custom">Custom</option>
							<option value="Vocals">Vocals</option>
							<option value="Drums">Drums</option>
							<option value="Bass">Bass</option>
							<option value="Guitar">Guitar</option>
							<option value="Mix">Mix</option>
						</select>
					</div>
				</div>

				<div class="flex gap-2">
					<button
						@click="showSaveDialog = false"
						class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
					>
						Cancel
					</button>
					<button
						@click="savePreset"
						:disabled="!newPresetName.trim()"
						class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
