<script setup lang="ts">
interface Chapter {
	id: string;
	title: string;
	startTime: number;
	endTime: number | null;
	url: string | null;
	image: string | null;
}

const props = defineProps<{
	audioDuration: number;
}>();

const chapters = ref<Chapter[]>([
	{
		id: "1",
		title: "Introduction",
		startTime: 0,
		endTime: 120,
		url: null,
		image: null,
	},
	{
		id: "2",
		title: "Main Topic",
		startTime: 120,
		endTime: 900,
		url: null,
		image: null,
	},
	{
		id: "3",
		title: "Interview",
		startTime: 900,
		endTime: 1800,
		url: null,
		image: null,
	},
	{
		id: "4",
		title: "Outro",
		startTime: 1800,
		endTime: null,
		url: null,
		image: null,
	},
]);

const showAddDialog = ref(false);
const newChapterTitle = ref("");
const newChapterTime = ref(0);
const selectedChapter = ref<string | null>(null);

const formatTime = (seconds: number): string => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	if (h > 0) {
		return `${h}:${m.toString().padStart(2, "0")}:${
			s.toString().padStart(2, "0")
		}`;
	}
	return `${m}:${s.toString().padStart(2, "0")}`;
};

const addChapter = () => {
	if (!newChapterTitle.value.trim()) return;

	const chapter: Chapter = {
		id: Date.now().toString(),
		title: newChapterTitle.value,
		startTime: newChapterTime.value,
		endTime: null,
		url: null,
		image: null,
	};

	chapters.value.push(chapter);
	chapters.value.sort((a, b) => a.startTime - b.startTime);

	// Update end times
	for (let i = 0; i < chapters.value.length - 1; i++) {
		chapters.value[i]!.endTime = chapters.value[i + 1]!.startTime;
	}

	newChapterTitle.value = "";
	newChapterTime.value = 0;
	showAddDialog.value = false;
};

const deleteChapter = (id: string) => {
	chapters.value = chapters.value.filter(c => c.id !== id);
};

const exportChapters = () => {
	const json = JSON.stringify(chapters.value, null, 2);
	console.log("Exporting chapters:", json);
};

const jumpToChapter = (time: number) => {
	console.log("Jumping to:", time);
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
						d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
					/>
				</svg>
				Podcast Chapter Markers
			</h3>
			<button
				@click="showAddDialog = true"
				class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
			>
				Add Chapter
			</button>
		</div>

		<div class="p-3 bg-green-900/20 border border-green-800 rounded-lg">
			<p class="text-xs text-green-300">
				Create MP3 chapter markers for podcast apps. Listeners can skip between
				chapters in supported players.
			</p>
		</div>

		<!-- Chapters List -->
		<div class="space-y-2 max-h-64 overflow-y-auto">
			<div
				v-for="(chapter, index) in chapters"
				:key="chapter.id"
				class="p-3 bg-gray-800 rounded-lg group"
			>
				<div class="flex items-start gap-3">
					<div class="flex flex-col items-center">
						<span class="text-xs text-gray-500">{{ index + 1 }}</span>
						<div class="w-px h-full bg-gray-700 my-1"></div>
					</div>

					<div class="flex-1 space-y-2">
						<div class="flex items-center justify-between">
							<input
								v-model="chapter.title"
								type="text"
								class="flex-1 bg-transparent border-b border-gray-700 focus:border-purple-500 text-white text-sm font-medium outline-none"
							/>
							<button
								@click="deleteChapter(chapter.id)"
								class="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
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

						<div class="flex items-center gap-4 text-xs">
							<button
								@click="jumpToChapter(chapter.startTime)"
								class="text-purple-400 hover:text-purple-300"
							>
								{{ formatTime(chapter.startTime) }}
							</button>
							<span v-if="chapter.endTime" class="text-gray-500">
								→ {{ formatTime(chapter.endTime) }}
							</span>
							<span v-else class="text-gray-500">→ End</span>
						</div>

						<!-- URL and Image -->
						<div class="space-y-1">
							<input
								v-model="chapter.url"
								type="text"
								placeholder="Link URL (optional)..."
								class="w-full px-2 py-1 bg-gray-900 rounded text-xs text-gray-300 placeholder-gray-600 outline-none"
							/>
							<input
								v-model="chapter.image"
								type="text"
								placeholder="Image URL (optional)..."
								class="w-full px-2 py-1 bg-gray-900 rounded text-xs text-gray-300 placeholder-gray-600 outline-none"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats -->
		<div class="flex items-center justify-between text-xs text-gray-500">
			<span>{{ chapters.length }} chapters</span>
			<span>Total: {{ formatTime(audioDuration || 0) }}</span>
		</div>

		<!-- Export -->
		<button
			@click="exportChapters"
			class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
		>
			Export Chapter File (JSON)
		</button>

		<!-- Add Dialog -->
		<div
			v-if="showAddDialog"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-gray-900 rounded-lg p-6 w-96 space-y-4">
				<h4 class="text-lg font-semibold text-white">Add Chapter</h4>

				<div class="space-y-3">
					<div>
						<label class="text-xs text-gray-400 block mb-1"
						>Chapter Title</label>
						<input
							v-model="newChapterTitle"
							type="text"
							placeholder="e.g., Introduction"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
						/>
					</div>

					<div>
						<label class="text-xs text-gray-400 block mb-1"
						>Start Time (seconds)</label>
						<input
							v-model="newChapterTime"
							type="number"
							min="0"
							:max="audioDuration"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
						/>
						<div class="text-xs text-gray-500 mt-1">
							Current position: {{ formatTime(newChapterTime) }}
						</div>
					</div>
				</div>

				<div class="flex gap-2">
					<button
						@click="showAddDialog = false"
						class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
					>
						Cancel
					</button>
					<button
						@click="addChapter"
						:disabled="!newChapterTitle.trim()"
						class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
					>
						Add
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
