<script setup lang="ts">
const searchQuery = ref("");
const selectedCategory = ref("All");
const isPlaying = ref<number | null>(null);
const currentTime = ref(0);

const categories = [
	"All",
	"Music",
	"Sound Effects",
	"Loops",
	"Intros",
	"Background",
];

const library = ref([
	{
		id: 1,
		name: "Upbeat Corporate",
		artist: "Studio One",
		duration: "2:34",
		category: "Music",
		mood: "Energetic",
		bpm: 120,
		isPremium: false,
	},
	{
		id: 2,
		name: "Relaxing Piano",
		artist: "Calm Sounds",
		duration: "3:45",
		category: "Music",
		mood: "Calm",
		bpm: 80,
		isPremium: false,
	},
	{
		id: 3,
		name: "Notification Ding",
		artist: "System",
		duration: "0:02",
		category: "Sound Effects",
		mood: "Alert",
		bpm: 0,
		isPremium: false,
	},
	{
		id: 4,
		name: "Epic Intro",
		artist: "Cinematic",
		duration: "0:15",
		category: "Intros",
		mood: "Dramatic",
		bpm: 140,
		isPremium: true,
	},
	{
		id: 5,
		name: "Ambient Rain",
		artist: "Nature",
		duration: "5:00",
		category: "Background",
		mood: "Peaceful",
		bpm: 0,
		isPremium: false,
	},
	{
		id: 6,
		name: "Electronic Loop",
		artist: "Synthwave",
		duration: "1:30",
		category: "Loops",
		mood: "Modern",
		bpm: 128,
		isPremium: false,
	},
	{
		id: 7,
		name: "Success Chime",
		artist: "UI Sounds",
		duration: "0:03",
		category: "Sound Effects",
		mood: "Positive",
		bpm: 0,
		isPremium: false,
	},
	{
		id: 8,
		name: "Jazz Background",
		artist: "Smooth Trio",
		duration: "4:20",
		category: "Background",
		mood: "Relaxed",
		bpm: 90,
		isPremium: true,
	},
]);

const filteredLibrary = computed(() => {
	let result = library.value;
	if (selectedCategory.value !== "All") {
		result = result.filter(item => item.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		result = result.filter(item =>
			item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| item.artist.toLowerCase().includes(searchQuery.value.toLowerCase())
		);
	}
	return result;
});

const getCategoryIcon = (category: string) => {
	switch (category) {
		case "Music":
			return "mdi:music";
		case "Sound Effects":
			return "mdi:volume-high";
		case "Loops":
			return "mdi:repeat";
		case "Intros":
			return "mdi:movie-open";
		case "Background":
			return "mdi:waveform";
		default:
			return "mdi:music-note";
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-mint-100 dark:bg-mint-900/30 flex items-center justify-center">
					<Icon
						name="mdi:music-box"
						class="w-5 h-5 text-mint-600 dark:text-mint-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Music & Audio Library
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Royalty-free tracks & SFX
					</p>
				</div>
			</div>
			<span
				class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full"
			>1000+ tracks</span>
		</div>

		<div class="space-y-4">
			<div class="flex gap-2">
				<div class="flex-1 relative">
					<Icon
						name="mdi:magnify"
						class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search tracks..."
						class="w-full pl-9 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
				<select
					v-model="selectedCategory"
					class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
					<option v-for="cat in categories" :key="cat" :value="cat">
						{{ cat }}
					</option>
				</select>
			</div>

			<div class="flex flex-wrap gap-1">
				<button
					v-for='mood in ["All", "Energetic", "Calm", "Dramatic", "Modern", "Relaxed"]'
					:key="mood"
					class="px-2 py-1 text-xs rounded-full border transition-colors"
					:class="mood === 'All'
					? 'bg-gray-100 dark:bg-gray-700 border-gray-300'
					: 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'"
				>
					{{ mood }}
				</button>
			</div>

			<div class="max-h-64 overflow-y-auto space-y-1">
				<div
					v-for="track in filteredLibrary"
					:key="track.id"
					:class="[
						'flex items-center gap-3 p-2 rounded-lg transition-all',
						isPlaying === track.id
							? 'bg-gray-100 dark:bg-gray-700'
							: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
					]"
				>
					<button
						class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
						:class="isPlaying === track.id
						? 'bg-green-500 text-white'
						: 'bg-gray-200 dark:bg-gray-700 text-gray-600'"
						@click="isPlaying = isPlaying === track.id ? null : track.id"
					>
						<Icon
							:name="isPlaying === track.id ? 'mdi:pause' : 'mdi:play'"
							class="w-4 h-4"
						/>
					</button>

					<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
						<Icon
							:name="getCategoryIcon(track.category)"
							class="w-5 h-5 text-white"
						/>
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span
								class="text-sm font-medium text-gray-900 dark:text-white truncate"
							>{{ track.name }}</span>
							<span
								v-if="track.isPremium"
								class="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 rounded"
							>PRO</span>
						</div>
						<div class="text-xs text-gray-500">
							{{ track.artist }} • {{ track.category }} {{
								track.bpm > 0 ? `• ${track.bpm} BPM` : ""
							}}
						</div>
					</div>

					<div class="text-xs text-gray-500">{{ track.duration }}</div>

					<button class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
						<Icon name="mdi:download" class="w-4 h-4 text-gray-400" />
					</button>
				</div>
			</div>

			<div
				v-if="isPlaying"
				class="border-t border-gray-200 dark:border-gray-700 pt-3"
			>
				<div class="flex items-center gap-3">
					<Icon name="mdi:music" class="w-5 h-5 text-green-500" />
					<div class="flex-1">
						<div class="text-sm font-medium text-gray-900 dark:text-white">
							{{ library.find(t => t.id === isPlaying)?.name }}
						</div>
						<div class="w-full h-1 bg-gray-200 rounded-full mt-1">
							<div class="h-full bg-green-500 rounded-full w-1/3" />
						</div>
					</div>
					<button class="p-2 bg-green-500 text-white rounded-lg">
						<Icon name="mdi:check" class="w-4 h-4" />
					</button>
				</div>
			</div>

			<button class="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
				<Icon name="mdi:upload" class="w-4 h-4" />
				Upload Custom Audio
			</button>
		</div>
	</div>
</template>
