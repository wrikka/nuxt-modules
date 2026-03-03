<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [style: string, text: string] }
>();
const style = ref("bold");
const text = ref("");
const isGenerating = ref(false);
const generatedThumbnails = ref<string[]>([]);

const styles = [
	{ id: "bold", name: "Bold & Punchy", preview: "🔥" },
	{ id: "minimal", name: "Minimal", preview: "◯" },
	{ id: "cinematic", name: "Cinematic", preview: "🎬" },
	{ id: "gaming", name: "Gaming", preview: "🎮" },
	{ id: "tutorial", name: "Tutorial", preview: "📚" },
	{ id: "vlog", name: "Vlog Style", preview: "📷" },
];

const sampleTitles = [
	"10 Tips for Better Videos",
	"How I Edit My Videos",
	"Day in the Life Vlog",
	"Tutorial: Beginner Guide",
];

const generate = () => {
	if (!text.value.trim()) return;
	isGenerating.value = true;
	setTimeout(() => {
		isGenerating.value = false;
		generatedThumbnails.value.unshift(`thumb_${Date.now()}.jpg`);
		emit("generate", style.value, text.value);
	}, 2000);
};
</script>
<template>
	<div class="ai-thumbnail-generator bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:image" class="w-5 h-5 text-purple-500" />
				AI Thumbnail Generator
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<input
				v-model="text"
				type="text"
				placeholder="Video title or description..."
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm mb-2 border-0"
			/>
			<div class="flex flex-wrap gap-1">
				<button
					v-for="t in sampleTitles"
					:key="t"
					class="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs transition-colors"
					@click="text = t"
				>
					{{ t }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Style</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="s in styles"
					:key="s.id"
					class="p-2 rounded-lg text-center transition-all"
					:class="style === s.id
					? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50'"
					@click="style = s.id"
				>
					<div class="text-2xl mb-1">{{ s.preview }}</div>
					<div class="text-gray-900 dark:text-white text-xs">{{ s.name }}</div>
				</button>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isGenerating || !text.trim()"
			@click="generate"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Generate Thumbnail
		</button>
		<div v-if="generatedThumbnails.length > 0" class="mt-4">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Generated Thumbnails
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div
					v-for="thumb in generatedThumbnails"
					:key="thumb"
					class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs"
				>
					{{ thumb }}
				</div>
			</div>
		</div>
	</div>
</template>
