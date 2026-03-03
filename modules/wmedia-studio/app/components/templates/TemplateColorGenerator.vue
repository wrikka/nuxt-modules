<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "apply", palette: ColorPalette): void;
}>();

interface ColorPalette {
	id: string;
	name: string;
	colors: string[];
	type: "extracted" | "generated" | "harmony";
}

const activeTab = ref("extract");
const extractedColors = ref<string[]>([]);
const selectedColors = ref<string[]>([]);
const isExtracting = ref(false);

// Mock extracted colors from template
const extractColors = async () => {
	isExtracting.value = true;
	await new Promise(r => setTimeout(r, 1500));
	extractedColors.value = [
		"#3B82F6",
		"#10B981",
		"#F59E0B",
		"#EF4444",
		"#8B5CF6",
		"#EC4899",
		"#6366F1",
		"#14B8A6",
	];
	isExtracting.value = false;
};

const harmonyTypes = [
	"Complementary",
	"Triadic",
	"Analogous",
	"Split-Complementary",
	"Tetradic",
];
const selectedHarmony = ref("Complementary");
const baseColor = ref("#3B82F6");

const generatedPalettes = computed(() => {
	return [
		{
			id: "1",
			name: "Ocean Breeze",
			colors: ["#0EA5E9", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE"],
			type: "generated",
		},
		{
			id: "2",
			name: "Sunset Glow",
			colors: ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"],
			type: "generated",
		},
		{
			id: "3",
			name: "Forest Mist",
			colors: ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
			type: "generated",
		},
		{
			id: "4",
			name: "Berry Crush",
			colors: ["#BE185D", "#DB2777", "#F472B6", "#FBCFE8", "#FCE7F3"],
			type: "generated",
		},
	] as ColorPalette[];
});

const harmonyPalettes = computed(() => {
	// Generate harmony colors based on baseColor and selectedHarmony
	return [
		{
			id: "h1",
			name: selectedHarmony.value,
			colors: [baseColor.value, "#10B981", "#F59E0B", "#8B5CF6"],
			type: "harmony",
		},
	] as ColorPalette[];
});

const toggleColor = (color: string) => {
	const index = selectedColors.value.indexOf(color);
	if (index > -1) {
		selectedColors.value.splice(index, 1);
	} else {
		selectedColors.value.push(color);
	}
};

const applyPalette = (palette: ColorPalette) => {
	emit("apply", palette);
};

const copyToClipboard = (color: string) => {
	navigator.clipboard.writeText(color);
};

// Color blindness simulation
const colorBlindModes = [
	"Normal",
	"Protanopia",
	"Deuteranopia",
	"Tritanopia",
	"Achromatopsia",
];
const selectedColorBlind = ref("Normal");
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-palette text-pink-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Color Palette Generator
							</h2>
							<p class="text-sm text-gray-500">
								Extract or create beautiful color schemes
							</p>
						</div>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Tabs -->
				<div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
					<div class="flex gap-2">
						<button
							v-for='tab in ["extract", "generate", "harmony", "accessibility"]'
							:key="tab"
							class="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
							:class="activeTab === tab
							? 'bg-blue-600 text-white'
							: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
							@click="activeTab = tab"
						>
							{{ tab }}
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left Panel -->
					<div class="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
						<!-- Extract Tab -->
						<div v-if="activeTab === 'extract'" class="space-y-4">
							<button
								class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
								:disabled="isExtracting"
								@click="extractColors"
							>
								<i
									:class="isExtracting
									? 'i-mdi-loading animate-spin'
									: 'i-mdi-auto-fix'"
									class="mr-1"
								/>
								{{
									isExtracting
									? "Extracting..."
									: "Extract Colors from Template"
								}}
							</button>

							<div v-if="extractedColors.length > 0" class="space-y-2">
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
									Extracted Colors:
								</p>
								<div class="grid grid-cols-4 gap-2">
									<button
										v-for="color in extractedColors"
										:key="color"
										class="aspect-square rounded-lg border-2 transition-all"
										:class="selectedColors.includes(color)
										? 'border-white ring-2 ring-blue-500 scale-110'
										: 'border-transparent'"
										:style="`background-color: ${color}`"
										:title="color"
										@click="toggleColor(color)"
									/>
								</div>
							</div>

							<div
								v-if="selectedColors.length > 0"
								class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
							>
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Selected Palette:
								</p>
								<div class="flex gap-1">
									<div
										v-for="color in selectedColors"
										:key="color"
										class="w-8 h-8 rounded-lg"
										:style="`background-color: ${color}`"
									/>
								</div>
								<button
									class="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
									@click="applyPalette({
										id: 'custom',
										name: 'Custom Palette',
										colors: selectedColors,
										type: 'extracted',
									})"
								>
									Apply Palette
								</button>
							</div>
						</div>

						<!-- Generate Tab -->
						<div v-if="activeTab === 'generate'" class="space-y-4">
							<p class="text-sm text-gray-600 dark:text-gray-400">
								Choose from our curated color palettes:
							</p>
							<div class="space-y-3">
								<button
									v-for="palette in generatedPalettes"
									:key="palette.id"
									class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 transition-colors text-left"
									@click="applyPalette(palette)"
								>
									<p class="font-medium text-gray-900 dark:text-white">
										{{ palette.name }}
									</p>
									<div class="flex gap-1 mt-2">
										<div
											v-for="color in palette.colors"
											:key="color"
											class="w-6 h-6 rounded"
											:style="`background-color: ${color}`"
										/>
									</div>
								</button>
							</div>
						</div>

						<!-- Harmony Tab -->
						<div v-if="activeTab === 'harmony'" class="space-y-4">
							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Base Color</label>
								<div class="flex gap-2">
									<input
										v-model="baseColor"
										type="color"
										class="w-12 h-10 rounded-lg"
									/>
									<input
										v-model="baseColor"
										type="text"
										class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
									/>
								</div>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Harmony Type</label>
								<select
									v-model="selectedHarmony"
									class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
								>
									<option
										v-for="type in harmonyTypes"
										:key="type"
										:value="type"
									>
										{{ type }}
									</option>
								</select>
							</div>

							<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Generated Harmony:
								</p>
								<div class="flex gap-1">
									<div
										v-for="color in harmonyPalettes[0]?.colors"
										:key="color"
										class="flex-1 h-12 rounded-lg"
										:style="`background-color: ${color}`"
									/>
								</div>
								<button
									class="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
									@click="applyPalette(harmonyPalettes[0]!)"
								>
									Apply Harmony
								</button>
							</div>
						</div>

						<!-- Accessibility Tab -->
						<div v-if="activeTab === 'accessibility'" class="space-y-4">
							<p class="text-sm text-gray-600 dark:text-gray-400">
								Check how your colors appear to color-blind users:
							</p>
							<select
								v-model="selectedColorBlind"
								class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
							>
								<option
									v-for="mode in colorBlindModes"
									:key="mode"
									:value="mode"
								>
									{{ mode }}
								</option>
							</select>

							<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<p class="text-sm font-medium mb-2">Preview:</p>
								<div class="grid grid-cols-2 gap-2">
									<div
										v-for="color in extractedColors.slice(0, 4)"
										:key="color"
										class="h-16 rounded-lg flex items-center justify-center text-white text-xs font-mono"
										:style="`background-color: ${color}`"
									>
										{{ color }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Template Preview -->
					<div class="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
						<h3 class="font-medium text-gray-900 dark:text-white mb-4">
							Template Preview
						</h3>
						<div class="max-w-2xl mx-auto">
							<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
								<img
									:src="props.template!.thumbnail"
									class="w-full aspect-video object-cover"
								/>
								<div class="p-6">
									<div class="flex gap-2 mb-4">
										<div
											v-for='color in selectedColors.length > 0
											? selectedColors
											: ["#3B82F6", "#10B981", "#F59E0B"]'
											:key="color"
											class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow"
											:style="`background-color: ${color}`"
										/>
									</div>
									<h4 class="font-semibold text-gray-900 dark:text-white">
										{{ props.template!.name }}
									</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
										Preview with selected colors
									</p>
								</div>
							</div>

							<!-- Color Codes -->
							<div
								v-if="selectedColors.length > 0"
								class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl"
							>
								<h4 class="font-medium text-gray-900 dark:text-white mb-3">
									Color Codes
								</h4>
								<div class="space-y-2">
									<div
										v-for="color in selectedColors"
										:key="color"
										class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
									>
										<div class="flex items-center gap-3">
											<div
												class="w-8 h-8 rounded"
												:style="`background-color: ${color}`"
											/>
											<span class="font-mono text-sm">{{ color }}</span>
										</div>
										<button
											class="p-1.5 text-gray-400 hover:text-gray-600"
											@click="copyToClipboard(color)"
										>
											<i class="i-mdi-content-copy" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
