<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const lutPresets = [
	{ id: "1", name: "Cinematic Warm", category: "Style", thumbnail: "warm" },
	{ id: "2", name: "Teal & Orange", category: "Style", thumbnail: "teal" },
	{ id: "3", name: "Black & White", category: "Monochrome", thumbnail: "bw" },
	{ id: "4", name: "Vintage Film", category: "Style", thumbnail: "vintage" },
	{ id: "5", name: "High Contrast", category: "Style", thumbnail: "contrast" },
	{ id: "6", name: "Soft Pastel", category: "Style", thumbnail: "pastel" },
];

const selectedLUT = ref<string | null>(null);
const customLUTFile = ref<File | null>(null);
const intensity = ref(100);

const categories = ["All", "Style", "Monochrome", "Technical"];
const selectedCategory = ref("All");

const filteredLUTs = computed(() => {
	if (selectedCategory.value === "All") return lutPresets;
	return lutPresets.filter(l => l.category === selectedCategory.value);
});

const onFileUpload = (event: Event) => {
	const input = event.target as HTMLInputElement;
	if (input.files && input.files[0]) {
		customLUTFile.value = input.files[0];
	}
};

const applyLUT = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Custom LUT Import"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Import and apply .cube LUT files for professional color grading.
			</p>

			<!-- Category Filter -->
			<div class="flex gap-2 flex-wrap">
				<button
					v-for="cat in categories"
					:key="cat"
					class="px-3 py-1 rounded-full text-sm transition-colors"
					:class="selectedCategory === cat
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
					@click="selectedCategory = cat"
				>
					{{ cat }}
				</button>
			</div>

			<!-- LUT Grid -->
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="lut in filteredLUTs"
					:key="lut.id"
					class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all"
					:class="selectedLUT === lut.id
					? 'border-blue-500'
					: 'border-gray-200 dark:border-gray-700'"
					@click="selectedLUT = lut.id"
				>
					<div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600" />
					<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
						<span class="text-white text-xs font-medium text-center px-1">{{
							lut.name
						}}</span>
					</div>
					<div
						v-if="selectedLUT === lut.id"
						class="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
					>
						<Icon name="mdi:check" class="w-3 h-3 text-white" />
					</div>
				</button>
			</div>

			<!-- Intensity -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
				>
					LUT Intensity: {{ intensity }}%
				</label>
				<input
					v-model="intensity"
					type="range"
					min="0"
					max="100"
					class="w-full"
				/>
			</div>

			<!-- Custom LUT Upload -->
			<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
				<Icon
					name="mdi:file-upload"
					class="w-8 h-8 text-gray-400 mx-auto mb-2"
				/>
				<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
					Upload .cube file
				</p>
				<input type="file" accept=".cube" class="hidden" @change="onFileUpload">
				<button
					class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200"
					onclick="this.previousElementSibling.click()"
				>
					Choose File
				</button>
				<p v-if="customLUTFile" class="text-sm text-blue-500 mt-2">
					{{ customLUTFile.name }}
				</p>
			</div>

			<button
				class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
				:disabled="!selectedLUT && !customLUTFile"
				@click="applyLUT"
			>
				Apply LUT
			</button>
		</div>
	</ModalDialog>
</template>
