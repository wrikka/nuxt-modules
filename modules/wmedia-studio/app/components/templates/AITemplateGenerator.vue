<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "generate", prompt: string, options: GenerateOptions): void;
	(e: "close"): void;
}>();

interface GenerateOptions {
	category: string;
	style: string;
	colorScheme: string;
	complexity: "simple" | "moderate" | "complex";
}

const prompt = ref("");
const isGenerating = ref(false);
const generatedPreview = ref<string | null>(null);

const options = ref<GenerateOptions>({
	category: "social-media",
	style: "modern",
	colorScheme: "auto",
	complexity: "moderate",
});

const categories = [
	{ value: "social-media", label: "Social Media", icon: "i-mdi-share-variant" },
	{ value: "presentation", label: "Presentation", icon: "i-mdi-presentation" },
	{ value: "poster", label: "Poster", icon: "i-mdi-image-frame" },
	{ value: "flyer", label: "Flyer", icon: "i-mdi-file-document" },
	{ value: "logo", label: "Logo", icon: "i-mdi-shape" },
	{ value: "banner", label: "Banner", icon: "i-mdi-sign-real-estate" },
];

const styles = [
	{ value: "modern", label: "Modern Minimalist" },
	{ value: "corporate", label: "Corporate Professional" },
	{ value: "playful", label: "Playful & Fun" },
	{ value: "elegant", label: "Elegant & Luxury" },
	{ value: "retro", label: "Retro & Vintage" },
	{ value: "futuristic", label: "Futuristic" },
];

const colorSchemes = [
	{ value: "auto", label: "Auto-detect from brand" },
	{ value: "warm", label: "Warm Tones" },
	{ value: "cool", label: "Cool Tones" },
	{ value: "monochrome", label: "Monochrome" },
	{ value: "vibrant", label: "Vibrant & Bold" },
	{ value: "pastel", label: "Soft Pastel" },
];

const handleGenerate = async () => {
	if (!prompt.value.trim()) return;
	isGenerating.value = true;
	// Simulate API call
	await new Promise(resolve => setTimeout(resolve, 2000));
	generatedPreview.value = `https://picsum.photos/600/400?random=${Date.now()}`;
	isGenerating.value = false;
};

const handleUse = () => {
	emit("generate", prompt.value, options.value);
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
							<i class="i-mdi-robot text-white text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-bold text-gray-900 dark:text-white">
								AI Template Generator
							</h2>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								Create custom templates with AI
							</p>
						</div>
					</div>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400 text-xl" />
					</button>
				</div>

				<div class="flex flex-1 overflow-hidden">
					<!-- Configuration Panel -->
					<div class="w-80 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
						<div class="space-y-6">
							<!-- Category -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>Template Category</label>
								<div class="grid grid-cols-2 gap-2">
									<button
										v-for="cat in categories"
										:key="cat.value"
										class="flex items-center gap-2 p-2 rounded-lg border text-sm transition-all"
										:class="options.category === cat.value
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
										@click="options.category = cat.value"
									>
										<i :class="cat.icon" />
										{{ cat.label }}
									</button>
								</div>
							</div>

							<!-- Style -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>Visual Style</label>
								<select
									v-model="options.style"
									class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								>
									<option
										v-for="style in styles"
										:key="style.value"
										:value="style.value"
									>
										{{ style.label }}
									</option>
								</select>
							</div>

							<!-- Color Scheme -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>Color Scheme</label>
								<select
									v-model="options.colorScheme"
									class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
								>
									<option
										v-for="color in colorSchemes"
										:key="color.value"
										:value="color.value"
									>
										{{ color.label }}
									</option>
								</select>
							</div>

							<!-- Complexity -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>Complexity</label>
								<div class="flex gap-2">
									<button
										v-for='level in [{ value: "simple", label: "Simple" }, {
											value: "moderate",
											label: "Moderate",
										}, { value: "complex", label: "Complex" }]'
										:key="level.value"
										class="flex-1 px-3 py-2 rounded-lg border text-sm transition-all"
										:class="options.complexity === level.value
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
										@click="options.complexity = level.value as any"
									>
										{{ level.label }}
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Preview Panel -->
					<div class="flex-1 p-6 flex flex-col">
						<!-- Prompt Input -->
						<div class="mb-4">
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>Describe your template</label>
							<textarea
								v-model="prompt"
								rows="3"
								placeholder="e.g., 'A modern Instagram post for a coffee shop grand opening with warm colors and elegant typography'"
								class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
							/>
						</div>

						<!-- Preview Area -->
						<div class="flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
							<div v-if="isGenerating" class="text-center">
								<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
								<p class="mt-4 text-gray-600 dark:text-gray-400">
									Generating your template...
								</p>
								<div class="mt-2 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
										style="width: 60%"
									/>
								</div>
							</div>
							<img
								v-else-if="generatedPreview"
								:src="generatedPreview"
								alt="Generated preview"
								class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
							/>
							<div v-else class="text-center text-gray-500 dark:text-gray-400">
								<i class="i-mdi-image-outline text-6xl mb-4" />
								<p>Your generated template will appear here</p>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex items-center justify-end gap-3 mt-4">
							<button
								v-if="generatedPreview"
								class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
								@click="generatedPreview = null"
							>
								Regenerate
							</button>
							<button
								:disabled="!prompt.trim() || isGenerating"
								class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								@click="handleGenerate"
							>
								<i
									:class="isGenerating ? 'i-mdi-loading animate-spin' : 'i-mdi-magic'"
								/>
								{{ isGenerating ? "Generating..." : "Generate Template" }}
							</button>
							<button
								v-if="generatedPreview"
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
								@click="handleUse"
							>
								Use This Template
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
