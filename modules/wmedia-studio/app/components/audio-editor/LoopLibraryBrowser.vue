<script setup lang="ts">
interface Loop {
	id: string;
	name: string;
	category: string;
	bpm: number;
	key: string;
	duration: number;
	tags: string[];
	color: string;
}

const props = defineProps<{
	projectBpm: number;
}>();

const loops = ref<Loop[]>([
	{
		id: "1",
		name: "Deep House Bass",
		category: "Bass",
		bpm: 125,
		key: "Am",
		duration: 4,
		tags: ["house", "electronic"],
		color: "#8B5CF6",
	},
	{
		id: "2",
		name: "Acoustic Drum Kit",
		category: "Drums",
		bpm: 90,
		key: "C",
		duration: 8,
		tags: ["acoustic", "rock"],
		color: "#EF4444",
	},
	{
		id: "3",
		name: "Lo-Fi Guitar",
		category: "Guitar",
		bpm: 85,
		key: "G",
		duration: 8,
		tags: ["lofi", "chill"],
		color: "#F59E0B",
	},
	{
		id: "4",
		name: "Synth Pluck",
		category: "Synth",
		bpm: 128,
		key: "F#m",
		duration: 2,
		tags: ["trance", "electronic"],
		color: "#10B981",
	},
	{
		id: "5",
		name: "Jazz Piano Chords",
		category: "Keys",
		bpm: 120,
		key: "Bb",
		duration: 4,
		tags: ["jazz", "smooth"],
		color: "#3B82F6",
	},
	{
		id: "6",
		name: "808 Kick Pattern",
		category: "Drums",
		bpm: 140,
		key: "C",
		duration: 4,
		tags: ["trap", "hiphop"],
		color: "#EF4444",
	},
	{
		id: "7",
		name: "Ambient Pad",
		category: "Synth",
		bpm: 100,
		key: "Dm",
		duration: 16,
		tags: ["ambient", "atmospheric"],
		color: "#10B981",
	},
	{
		id: "8",
		name: "Funky Bassline",
		category: "Bass",
		bpm: 110,
		key: "E",
		duration: 4,
		tags: ["funk", "disco"],
		color: "#8B5CF6",
	},
]);

const searchQuery = ref("");
const selectedCategory = ref("All");
const selectedBpm = ref<"all" | "match" | "half" | "double">("all");

const categories = [
	"All",
	"Drums",
	"Bass",
	"Guitar",
	"Keys",
	"Synth",
	"FX",
	"Vocals",
];

const filteredLoops = computed(() => {
	let result = loops.value;

	if (selectedCategory.value !== "All") {
		result = result.filter(l => l.category === selectedCategory.value);
	}

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(l =>
			l.name.toLowerCase().includes(query)
			|| l.tags.some(t => t.toLowerCase().includes(query))
		);
	}

	// BPM filtering
	if (selectedBpm.value === "match") {
		result = result.filter(l => Math.abs(l.bpm - props.projectBpm) <= 2);
	} else if (selectedBpm.value === "half") {
		result = result.filter(l => Math.abs(l.bpm - props.projectBpm / 2) <= 2);
	} else if (selectedBpm.value === "double") {
		result = result.filter(l => Math.abs(l.bpm - props.projectBpm * 2) <= 2);
	}

	return result;
});

const previewLoop = (loop: Loop) => {
	console.log("Previewing loop:", loop.name);
};

const addToProject = (loop: Loop) => {
	console.log("Adding loop to project:", loop.name);
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
						d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
					/>
				</svg>
				Loop Library
			</h3>
			<span class="text-sm text-gray-400">{{ filteredLoops.length }}
				loops</span>
		</div>

		<!-- Search -->
		<input
			v-model="searchQuery"
			type="text"
			placeholder="Search loops by name or tag..."
			class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
		/>

		<!-- Filters -->
		<div class="flex flex-wrap gap-2">
			<select
				v-model="selectedCategory"
				class="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
			>
				<option v-for="cat in categories" :key="cat" :value="cat">
					{{ cat }}
				</option>
			</select>

			<select
				v-model="selectedBpm"
				class="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
			>
				<option value="all">Any BPM</option>
				<option value="match">Match Project ({{ projectBpm }})</option>
				<option value="half">Half Time</option>
				<option value="double">Double Time</option>
			</select>
		</div>

		<!-- Loops Grid -->
		<div class="max-h-64 overflow-y-auto grid grid-cols-1 gap-2">
			<div
				v-for="loop in filteredLoops"
				:key="loop.id"
				class="group p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
			>
				<div class="flex items-start gap-3">
					<!-- Waveform Placeholder -->
					<div
						class="w-16 h-16 rounded-lg flex items-center justify-center"
						:style="{ backgroundColor: loop.color + '20' }"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							:style="{ color: loop.color }"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
							/>
						</svg>
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-medium text-white truncate">{{
								loop.name
							}}</span>
							<span
								class="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded"
							>{{ loop.category }}</span>
						</div>

						<div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
							<span class="flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3 w-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{{ loop.bpm }} BPM
							</span>
							<span>{{ loop.key }}</span>
							<span>{{ loop.duration }} bars</span>
						</div>

						<div class="flex flex-wrap gap-1 mt-2">
							<span
								v-for="tag in loop.tags"
								:key="tag"
								class="px-1.5 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded"
							>
								{{ tag }}
							</span>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							@click="previewLoop(loop)"
							class="p-1.5 text-purple-400 hover:bg-purple-900/30 rounded transition-colors"
							title="Preview"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
						</button>
						<button
							@click="addToProject(loop)"
							class="p-1.5 text-green-400 hover:bg-green-900/30 rounded transition-colors"
							title="Add to Project"
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
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
