<script setup lang="ts">
interface ImpulseResponse {
	id: string;
	name: string;
	category: string;
	duration: number;
	color: string;
}

const props = defineProps<{
	audioContext: AudioContext | null;
}>();

const irs = ref<ImpulseResponse[]>([
	{
		id: "1",
		name: "Concert Hall A",
		category: "Halls",
		duration: 3.2,
		color: "#8B5CF6",
	},
	{
		id: "2",
		name: "Small Room",
		category: "Rooms",
		duration: 0.8,
		color: "#10B981",
	},
	{
		id: "3",
		name: "Cathedral",
		category: "Churches",
		duration: 5.5,
		color: "#F59E0B",
	},
	{
		id: "4",
		name: "Plate Reverb",
		category: "Plates",
		duration: 2.1,
		color: "#EF4444",
	},
	{
		id: "5",
		name: "Spring Tank",
		category: "Springs",
		duration: 1.5,
		color: "#3B82F6",
	},
	{
		id: "6",
		name: "Chamber",
		category: "Chambers",
		duration: 2.8,
		color: "#EC4899",
	},
	{
		id: "7",
		name: "Studio A",
		category: "Studios",
		duration: 1.2,
		color: "#6366F1",
	},
	{
		id: "8",
		name: "Outdoor Stage",
		category: "Outdoor",
		duration: 1.8,
		color: "#14B8A6",
	},
]);

const selectedIR = ref("");
const wetAmount = ref(30);
const dryAmount = ref(100);
const preDelay = ref(0);
const decayTime = ref(100);
const searchQuery = ref("");
const selectedCategory = ref("All");

const categories = [
	"All",
	"Halls",
	"Rooms",
	"Churches",
	"Plates",
	"Springs",
	"Chambers",
	"Studios",
	"Outdoor",
];

const filteredIRs = computed(() => {
	let result = irs.value;
	if (selectedCategory.value !== "All") {
		result = result.filter(ir => ir.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		result = result.filter(ir =>
			ir.name.toLowerCase().includes(searchQuery.value.toLowerCase())
		);
	}
	return result;
});

const previewIR = (ir: ImpulseResponse) => {
	console.log("Previewing IR:", ir.name);
};

const loadCustomIR = () => {
	console.log("Loading custom IR file");
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
						d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
					/>
				</svg>
				Convolution Reverb
			</h3>
			<button
				@click="loadCustomIR"
				class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
			>
				Load IR
			</button>
		</div>

		<div class="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
			<p class="text-xs text-blue-300">
				Use real impulse responses to simulate acoustic spaces with incredible
				accuracy.
			</p>
		</div>

		<!-- IR Library -->
		<div class="space-y-2">
			<div class="flex gap-2">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search IRs..."
					class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
				/>
				<select
					v-model="selectedCategory"
					class="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
				>
					<option v-for="cat in categories" :key="cat" :value="cat">
						{{ cat }}
					</option>
				</select>
			</div>

			<div class="max-h-40 overflow-y-auto space-y-1">
				<div
					v-for="ir in filteredIRs"
					:key="ir.id"
					@click="selectedIR = ir.id"
					:class="[
						'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors',
						selectedIR === ir.id
							? 'bg-purple-900/50 border border-purple-700'
							: 'bg-gray-800 hover:bg-gray-750',
					]"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-3 h-3 rounded-full"
							:style="{ backgroundColor: ir.color }"
						>
						</div>
						<div>
							<div class="text-sm font-medium text-white">{{ ir.name }}</div>
							<div class="text-xs text-gray-500">
								{{ ir.category }} • {{ ir.duration }}s
							</div>
						</div>
					</div>
					<button
						@click.stop="previewIR(ir)"
						class="p-1.5 text-purple-400 hover:bg-purple-900/30 rounded transition-colors"
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
				</div>
			</div>
		</div>

		<!-- IR Waveform Preview -->
		<div class="bg-gray-800 rounded-lg p-3">
			<div class="text-xs text-gray-400 mb-2">Impulse Response Waveform</div>
			<div class="h-16 bg-gray-900 rounded flex items-center justify-center">
				<div class="text-xs text-gray-500">IR Waveform Display</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="space-y-3">
			<div class="space-y-1">
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Wet (Reverb)</span>
					<span class="text-white">{{ wetAmount }}%</span>
				</div>
				<input
					v-model="wetAmount"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Dry (Direct)</span>
					<span class="text-white">{{ dryAmount }}%</span>
				</div>
				<input
					v-model="dryAmount"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-400">Pre-delay</span>
						<span class="text-white">{{ preDelay }}ms</span>
					</div>
					<input
						v-model="preDelay"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-400">Decay</span>
						<span class="text-white">{{ decayTime }}%</span>
					</div>
					<input
						v-model="decayTime"
						type="range"
						min="0"
						max="200"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="p-3 bg-gray-800 rounded-lg">
			<div class="flex items-start gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 text-gray-400 mt-0.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-xs text-gray-400">
					Convolution reverb uses impulse responses (IRs) recorded from real
					spaces to create authentic acoustic simulations.
				</p>
			</div>
		</div>
	</div>
</template>
