<script setup lang="ts">
const selectedPreset = defineModel<string>("preset", { default: "blur" });
const blurAmount = defineModel<number>("blur", { default: 10 });
const backgroundColor = defineModel<string>("color", { default: "#00FF00" });
const tolerance = defineModel<number>("tolerance", { default: 30 });

const presets = [
	{
		id: "blur",
		name: "Blur Background",
		icon: "mdi:blur",
		description: "Professional blur effect",
		category: "Effect",
	},
	{
		id: "office",
		name: "Modern Office",
		icon: "mdi:office-building",
		description: "Clean workspace",
		category: "Virtual",
	},
	{
		id: "studio",
		name: "Photo Studio",
		icon: "mdi:camera",
		description: "White seamless",
		category: "Virtual",
	},
	{
		id: "nature",
		name: "Nature View",
		icon: "mdi:tree",
		description: "Peaceful landscape",
		category: "Virtual",
	},
	{
		id: "library",
		name: "Library",
		icon: "mdi:book-open",
		description: "Books background",
		category: "Virtual",
	},
	{
		id: "space",
		name: "Space",
		icon: "mdi:rocket",
		description: "Cosmic backdrop",
		category: "Virtual",
	},
	{
		id: "city",
		name: "City Skyline",
		icon: "mdi:city",
		description: "Urban view",
		category: "Virtual",
	},
	{
		id: "beach",
		name: "Beach",
		icon: "mdi:beach",
		description: "Tropical paradise",
		category: "Virtual",
	},
	{
		id: "gradient",
		name: "Gradient",
		icon: "mdi:gradient",
		description: "Color blend",
		category: "Effect",
	},
	{
		id: "solid",
		name: "Solid Color",
		icon: "mdi:format-color-fill",
		description: "Single color",
		category: "Effect",
	},
	{
		id: "custom",
		name: "Custom Image",
		icon: "mdi:image",
		description: "Upload your own",
		category: "Custom",
	},
] as const;

const categories = ["All", "Virtual", "Effect", "Custom"];
const selectedCategory = ref("All");

const filteredPresets = computed(() => {
	if (selectedCategory.value === "All") return presets;
	return presets.filter(p => p.category === selectedCategory.value);
});

const greenScreenColor = ["#00FF00", "#00B140", "#007A33", "#009933"];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
					<Icon
						name="mdi:green-screen"
						class="w-5 h-5 text-lime-600 dark:text-lime-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Green Screen Presets
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Virtual backgrounds collection
					</p>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="p-3 bg-lime-50 dark:bg-lime-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-lime-600 mt-0.5" />
					<p class="text-xs text-lime-700 dark:text-lime-300">
						Professional virtual backgrounds for green screen recording. Use
						physical green screen or enable AI background removal.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Green Screen Color</label>
				<div class="flex gap-2">
					<button
						v-for="color in greenScreenColor"
						:key="color"
						class="w-10 h-10 rounded-lg border-2 transition-all"
						:class="backgroundColor === color
						? 'border-gray-900 dark:border-white scale-110'
						: 'border-transparent'"
						:style="{ backgroundColor: color }"
						@click="backgroundColor = color"
					/>
					<input
						v-model="backgroundColor"
						type="color"
						class="w-10 h-10 rounded-lg border-0 cursor-pointer"
					>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Key Tolerance</span>
					<span class="text-gray-500">{{ tolerance }}</span>
				</div>
				<input
					v-model.number="tolerance"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-lime-600"
				>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Filter</label>
				<div class="flex flex-wrap gap-1">
					<button
						v-for="cat in categories"
						:key="cat"
						:class="[
							'px-3 py-1 rounded-full text-xs transition-colors',
							selectedCategory === cat
								? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200',
						]"
						@click="selectedCategory = cat"
					>
						{{ cat }}
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="preset in filteredPresets"
					:key="preset.id"
					:class="[
						'p-3 rounded-lg border text-left transition-all',
						selectedPreset === preset.id
							? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
							: 'border-gray-200 dark:border-gray-700 hover:border-lime-300',
					]"
					@click="selectedPreset = preset.id"
				>
					<div class="flex items-center gap-2 mb-1">
						<Icon
							:name="preset.icon"
							class="w-5 h-5"
							:class="selectedPreset === preset.id ? 'text-lime-600' : 'text-gray-500'"
						/>
						<span
							class="text-sm font-medium"
							:class="selectedPreset === preset.id
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600 dark:text-gray-400'"
						>{{ preset.name }}</span>
					</div>
					<p class="text-xs text-gray-500">{{ preset.description }}</p>
				</button>
			</div>

			<div v-if="selectedPreset === 'blur'" class="space-y-3">
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Blur Amount</span>
						<span class="text-gray-500">{{ blurAmount }}px</span>
					</div>
					<input
						v-model.number="blurAmount"
						type="range"
						min="0"
						max="50"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-lime-600"
					>
				</div>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Preview
				</h4>
				<div class="aspect-video rounded-lg overflow-hidden relative">
					<div
						class="absolute inset-0 flex items-center justify-center"
						:class="selectedPreset === 'blur'
						? 'backdrop-blur-xl'
						: selectedPreset === 'office'
						? 'bg-gray-100'
						: selectedPreset === 'nature'
						? 'bg-green-100'
						: selectedPreset === 'space'
						? 'bg-purple-900'
						: 'bg-gradient-to-br from-blue-400 to-purple-500'"
					>
						<Icon
							:name="presets.find(p => p.id === selectedPreset)?.icon || 'mdi:image'"
							class="w-16 h-16 text-white/50"
						/>
					</div>
					<div class="absolute bottom-4 left-4 right-4">
						<div class="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg mx-auto flex items-center justify-center">
							<Icon name="mdi:account" class="w-12 h-12 text-gray-500" />
						</div>
					</div>
				</div>
			</div>

			<button
				v-if="selectedPreset === 'custom'"
				class="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-lime-400 hover:text-lime-600 transition-colors flex items-center justify-center gap-2"
			>
				<Icon name="mdi:upload" class="w-5 h-5" />
				Upload Custom Background
			</button>
		</div>
	</div>
</template>
