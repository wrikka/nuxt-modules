<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [prompt: string, options: any] }
>();
const prompt = ref("");
const style = ref("photorealistic");
const aspectRatio = ref("1:1");
const creativity = ref(50);
const isGenerating = ref(false);
const generatedImages = ref<string[]>([]);

const styles = [
	{ id: "photorealistic", name: "Photorealistic" },
	{ id: "anime", name: "Anime" },
	{ id: "digital", name: "Digital Art" },
	{ id: "oil", name: "Oil Painting" },
	{ id: "sketch", name: "Sketch" },
];
const aspectRatios = [
	{ id: "1:1", name: "Square" },
	{ id: "16:9", name: "Landscape" },
	{ id: "9:16", name: "Portrait" },
	{ id: "4:3", name: "Standard" },
];

const generate = () => {
	if (!prompt.value.trim()) return;
	isGenerating.value = true;
	setTimeout(() => {
		isGenerating.value = false;
		generatedImages.value.unshift(`/ai/generated_${Date.now()}.jpg`);
	}, 3000);
};
const selectImage = (img: string) =>
	emit("generate", prompt.value, { style: style.value, image: img });
</script>
<template>
	<div class="ai-image-generator bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:sparkles" class="w-5 h-5 text-purple-500" />
				AI Image Generator
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
			<div class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Generated Preview
			</div>
		</div>
		<div class="mb-4">
			<textarea
				v-model="prompt"
				placeholder="Describe the image you want to generate..."
				class="w-full h-24 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm resize-none border-0"
			/>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Aspect Ratio</label>
				<select
					v-model="aspectRatio"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
					<option v-for="r in aspectRatios" :key="r.id" :value="r.id">
						{{ r.name }}
					</option>
				</select>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Style</label>
				<select
					v-model="style"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
					<option v-for="s in styles" :key="s.id" :value="s.id">
						{{ s.name }}
					</option>
				</select>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Creativity</span>
				<span class="text-purple-500 font-medium">{{ creativity }}%</span>
			</div>
			<input
				v-model="creativity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isGenerating || !prompt.trim()"
			@click="generate"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin"
			/>
			{{ isGenerating ? "Generating..." : "Generate Image" }}
		</button>
		<div v-if="generatedImages.length > 0" class="flex-1 overflow-y-auto">
			<div class="text-gray-400 text-xs mb-2">Generated Images</div>
			<div class="grid grid-cols-2 gap-2">
				<div
					v-for="img in generatedImages"
					:key="img"
					class="aspect-square bg-gray-700 rounded-lg relative group cursor-pointer overflow-hidden"
					@click="selectImage(img)"
				>
					<div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
					<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
						AI Image
					</div>
					<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
						<button class="px-3 py-1.5 bg-purple-600 text-white rounded text-xs">
							Use This
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
