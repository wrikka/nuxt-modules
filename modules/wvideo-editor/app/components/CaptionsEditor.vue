<script setup lang="ts">
import type { Caption } from "#shared/types";

const props = defineProps<{
	clipId: string;
}>();

const videoStore = useVideoStore();
const { generateCaptions } = useVideoEditor();

const captions = computed(() => {
	return videoStore.currentVideoProject?.captions.filter((c) =>
		c.clipId === props.clipId
	) || [];
});

const isGenerating = ref(false);
const selectedLanguage = ref("en");
const selectedCaptionId = ref<number | null>(null);

const handleGenerate = async () => {
	isGenerating.value = true;
	await generateCaptions(props.clipId, selectedLanguage.value);
	isGenerating.value = false;
};

const handleEdit = (caption: Caption) => {
	selectedCaptionId.value = caption.id;
};

const handleSave = (caption: Caption, newText: string) => {
	videoStore.updateCaption(caption.id, { text: newText });
	selectedCaptionId.value = null;
};

const handleDelete = (captionId: number) => {
	videoStore.removeCaption(captionId);
};

const handleClearAll = () => {
	if (confirm("Are you sure you want to remove all captions for this clip?")) {
		videoStore.clearCaptions();
	}
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const ms = Math.floor((seconds % 1) * 1000);
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}.${ms.toString().padStart(3, "0")}`;
};
</script>

<template>
	<div class="border-t border-gray-700 pt-4 mt-4">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-white font-medium">Captions</h3>
			<div class="flex gap-2">
				<button
					v-if="captions.length > 0"
					class="text-xs text-red-400 hover:text-red-300"
					@click="handleClearAll"
				>
					Clear All
				</button>
			</div>
		</div>

		<!-- Generate Section -->
		<div class="mb-4 p-3 bg-gray-800 rounded">
			<div class="flex items-center gap-2 mb-2">
				<select
					v-model="selectedLanguage"
					class="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
				>
					<option value="en">English</option>
					<option value="th">Thai</option>
					<option value="ja">Japanese</option>
				</select>
				<button
					class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded flex items-center justify-center gap-2 disabled:opacity-50"
					:disabled="isGenerating"
					@click="handleGenerate"
				>
					<svg
						v-if="isGenerating"
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="animate-spin"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
					<span>{{
						isGenerating ? "Generating..." : "Auto Generate (AI)"
					}}</span>
				</button>
			</div>
			<p class="text-gray-500 text-[10px]">
				Uses AI speech-to-text to automatically generate captions
			</p>
		</div>

		<!-- Captions List -->
		<div v-if="captions.length > 0" class="space-y-2 max-h-48 overflow-y-auto">
			<div
				v-for="caption in captions"
				:key="caption.id"
				class="p-2 bg-gray-800 rounded group hover:bg-gray-750"
			>
				<div class="flex items-start gap-2">
					<span class="text-gray-500 text-[10px] font-mono mt-1">
						{{ formatTime(caption.startTime) }}
					</span>
					<div class="flex-1">
						<div v-if="selectedCaptionId === caption.id">
							<textarea
								:value="caption.text"
								rows="2"
								class="w-full bg-gray-700 text-white text-xs rounded px-2 py-1 border border-blue-500 focus:outline-none resize-none"
								@blur="handleSave(
									caption,
									($event.target as HTMLTextAreaElement).value,
								)"
								@keydown.enter.prevent="handleSave(
									caption,
									($event.target as HTMLTextAreaElement).value,
								)"
							/>
						</div>
						<p
							v-else
							class="text-white text-xs cursor-pointer hover:text-blue-400"
							@click="handleEdit(caption)"
						>
							{{ caption.text }}
						</p>
					</div>
					<button
						class="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
						@click="handleDelete(caption.id)"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<div v-else class="text-gray-500 text-xs text-center py-4">
			No captions yet. Click "Auto Generate" to create captions with AI.
		</div>
	</div>
</template>
