<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [genre: string, duration: number, mood: string] }
>();
const genre = ref("electronic");
const duration = ref(30);
const mood = ref("upbeat");
const isGenerating = ref(false);
const progress = ref(0);
const generatedTracks = ref<string[]>([]);

const genres = [
	{ id: "electronic", name: "Electronic" },
	{ id: "rock", name: "Rock" },
	{ id: "pop", name: "Pop" },
	{ id: "jazz", name: "Jazz" },
	{ id: "classical", name: "Classical" },
	{ id: "hiphop", name: "Hip Hop" },
];
const moods = [
	{ id: "upbeat", name: "Upbeat" },
	{ id: "calm", name: "Calm" },
	{ id: "dramatic", name: "Dramatic" },
	{ id: "happy", name: "Happy" },
	{ id: "sad", name: "Sad" },
	{ id: "epic", name: "Epic" },
];

const generate = () => {
	isGenerating.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isGenerating.value = false;
			generatedTracks.value.unshift(`track_${Date.now()}.mp3`);
			emit("generate", genre.value, duration.value, mood.value);
		}
	}, 200);
};
</script>
<template>
	<div class="ai-music-generator bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:music" class="w-5 h-5 text-purple-500" />
				AI Music Generator
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Genre</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="g in genres"
					:key="g.id"
					class="p-2 rounded-lg text-center text-sm transition-all"
					:class="genre === g.id
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="genre = g.id"
				>
					{{ g.name }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Mood</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="m in moods"
					:key="m.id"
					class="px-3 py-1.5 rounded-full text-xs transition-all"
					:class="mood === m.id
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="mood = m.id"
				>
					{{ m.name }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Duration (seconds)</label>
			<input
				v-model="duration"
				type="range"
				min="10"
				max="120"
				step="10"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-1 appearance-none cursor-pointer accent-purple-500"
			/>
			<div class="text-center text-purple-500 text-sm font-medium">
				{{ duration }}s
			</div>
		</div>
		<div v-if="isGenerating" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Composing...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isGenerating"
			@click="generate"
		>
			Generate Music
		</button>
		<div v-if="generatedTracks.length > 0" class="mt-4 space-y-2">
			<div
				v-for="track in generatedTracks"
				:key="track"
				class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<Icon name="mdi:music" class="w-5 h-5 text-purple-500" />
				<span class="text-gray-900 dark:text-white text-sm">{{ track }}</span>
				<button class="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
					<Icon name="mdi:play" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
