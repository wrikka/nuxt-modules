<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const selectedFrame = defineModel<number>("frame", { default: 1 });
const style = defineModel<"clean" | "text" | "gradient" | "cinematic">(
	"style",
	{ default: "clean" },
);
const addText = defineModel<boolean>("addText", { default: true });
const titleText = defineModel<string>("title", { default: "Video Title" });
const textPosition = defineModel<"top" | "center" | "bottom">("textPosition", {
	default: "bottom",
});

const generatedThumbnails = ref([
	{ id: 1, time: "00:02:34", type: "clean", selected: true },
	{ id: 2, time: "00:05:12", type: "text", selected: false },
	{ id: 3, time: "00:08:45", type: "gradient", selected: false },
	{ id: 4, time: "00:12:20", type: "cinematic", selected: false },
]);

const styleOptions = [
	{
		value: "clean",
		label: "Clean",
		icon: "mdi:image",
		description: "Simple screenshot",
	},
	{
		value: "text",
		label: "With Text",
		icon: "mdi:text-box",
		description: "Title overlay",
	},
	{
		value: "gradient",
		label: "Gradient",
		icon: "mdi:gradient",
		description: "Color overlay",
	},
	{
		value: "cinematic",
		label: "Cinematic",
		icon: "mdi:movie",
		description: "Movie poster style",
	},
] as const;

const regenerateThumbnails = () => {
	// Simulate regeneration
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
					<Icon
						name="mdi:image-multiple"
						class="w-5 h-5 text-amber-600 dark:text-amber-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Thumbnail Generator
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						AI-powered video thumbnails
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-amber-600 mt-0.5" />
					<p class="text-xs text-amber-700 dark:text-amber-300">
						AI analyzes your video to find the most engaging frames and
						automatically generates thumbnails optimized for YouTube, social
						media, and more.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Thumbnail Style</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="opt in styleOptions"
						:key="opt.value"
						:class="[
							'p-2 rounded-lg border text-left transition-all',
							style === opt.value
								? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-amber-300',
						]"
						@click="style = opt.value"
					>
						<Icon
							:name="opt.icon"
							class="w-5 h-5 mb-1"
							:class="style === opt.value ? 'text-amber-600' : 'text-gray-500'"
						/>
						<div
							class="text-sm font-medium"
							:class="style === opt.value
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600'"
						>
							{{ opt.label }}
						</div>
						<div class="text-xs text-gray-500">{{ opt.description }}</div>
					</button>
				</div>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="addText"
					type="checkbox"
					class="w-4 h-4 text-amber-600 rounded"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Add title text</span>
			</div>

			<div v-if="addText" class="space-y-3 pl-6">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Title</label>
					<input
						v-model="titleText"
						type="text"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Text Position</label>
					<select
						v-model="textPosition"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option value="top">Top</option>
						<option value="center">Center</option>
						<option value="bottom">Bottom</option>
					</select>
				</div>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<div class="flex items-center justify-between mb-2">
					<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Generated Thumbnails
					</h4>
					<button
						class="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
						@click="regenerateThumbnails"
					>
						<Icon name="mdi:refresh" class="w-3 h-3" />
						Regenerate
					</button>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="thumb in generatedThumbnails"
						:key="thumb.id"
						:class="[
							'aspect-video rounded-lg border overflow-hidden relative transition-all',
							selectedFrame === thumb.id
								? 'border-amber-500 ring-2 ring-amber-500'
								: 'border-gray-200 dark:border-gray-700 hover:border-amber-300',
						]"
						@click="selectedFrame = thumb.id"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500"
							:class="thumb.type === 'gradient'
							? 'from-pink-400 to-orange-500'
							: thumb.type === 'cinematic'
							? 'from-gray-900 to-gray-700'
							: ''"
						/>
						<div
							v-if="thumb.type === 'text' || (addText && thumb.type !== 'clean')"
							:class="`absolute inset-0 flex items-${
								textPosition === 'top'
									? 'start'
									: textPosition === 'bottom'
									? 'end'
									: 'center'
							} justify-center p-2`"
						>
							<div class="bg-black/60 px-2 py-1 rounded text-white text-xs font-bold">
								{{ titleText }}
							</div>
						</div>
						<div class="absolute top-1 right-1">
							<span
								class="text-[10px] px-1.5 py-0.5 bg-black/50 text-white rounded"
							>{{ thumb.time }}</span>
						</div>
						<div
							v-if="selectedFrame === thumb.id"
							class="absolute inset-0 flex items-center justify-center bg-amber-500/20"
						>
							<Icon name="mdi:check-circle" class="w-8 h-8 text-amber-500" />
						</div>
					</button>
				</div>
			</div>

			<div class="flex gap-2">
				<button class="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
					<Icon name="mdi:download" class="w-4 h-4" />
					Download Thumbnail
				</button>
				<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<Icon name="mdi:content-copy" class="w-4 h-4" />
				</button>
			</div>

			<div class="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<Icon name="mdi:sparkles" class="w-4 h-4 text-green-600" />
				<span class="text-xs text-green-700 dark:text-green-300"
				>AI Score: 8.7/10 - High engagement predicted</span>
			</div>
		</div>
	</div>
</template>
