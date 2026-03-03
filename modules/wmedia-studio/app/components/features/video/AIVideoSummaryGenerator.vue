<script setup lang="ts">
interface Highlight {
	id: string;
	startTime: number;
	endTime: number;
	thumbnail: string;
	confidence: number;
	description: string;
}

const videoFile = ref<File | null>(null);
const isProcessing = ref(false);
const progress = ref(0);
const highlights = ref<Highlight[]>([]);
const selectedHighlights = ref<string[]>([]);
const targetDuration = ref(60); // seconds

const mockHighlights: Highlight[] = [
	{
		id: "1",
		startTime: 45,
		endTime: 55,
		thumbnail: "/highlights/1.jpg",
		confidence: 0.92,
		description: "Key action moment with high engagement",
	},
	{
		id: "2",
		startTime: 120,
		endTime: 135,
		thumbnail: "/highlights/2.jpg",
		confidence: 0.88,
		description: "Emotional peak in narrative",
	},
	{
		id: "3",
		startTime: 210,
		endTime: 225,
		thumbnail: "/highlights/3.jpg",
		confidence: 0.85,
		description: "Visual climax with stunning footage",
	},
	{
		id: "4",
		startTime: 340,
		endTime: 355,
		thumbnail: "/highlights/4.jpg",
		confidence: 0.81,
		description: "Strong call-to-action moment",
	},
	{
		id: "5",
		startTime: 480,
		endTime: 495,
		thumbnail: "/highlights/5.jpg",
		confidence: 0.78,
		description: "Memorable closing statement",
	},
];

function handleFileUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files?.[0]) {
		videoFile.value = input.files[0];
		startProcessing();
	}
}

function startProcessing() {
	isProcessing.value = true;
	progress.value = 0;

	// Simulate AI processing
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			highlights.value = mockHighlights;
		}
	}, 200);
}

function toggleHighlight(id: string) {
	const index = selectedHighlights.value.indexOf(id);
	if (index > -1) {
		selectedHighlights.value.splice(index, 1);
	} else {
		selectedHighlights.value.push(id);
	}
}

function selectAll() {
	selectedHighlights.value = highlights.value.map(h => h.id);
}

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function generateSummary() {
	// TODO: Generate summary video from selected highlights
	alert(
		`Generating ${targetDuration.value}s summary with ${selectedHighlights.value.length} clips...`,
	);
}
</script>

<template>
	<div class="video-summary-generator">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:movie-filter" class="mr-2" />
			AI Video Summary Generator
		</h2>
		<p class="text-gray-500 mb-6">
			Auto-generate short clips/highlights from long videos
		</p>

		<!-- Upload Section -->
		<div
			v-if="!videoFile && !isProcessing && highlights.length === 0"
			class="upload-section"
		>
			<div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
				<Icon name="mdi:video-plus" class="text-6xl text-gray-400 mb-4" />
				<p class="text-lg mb-4">
					Upload a long video to generate AI highlights
				</p>
				<label class="cursor-pointer">
					<input
						type="file"
						accept="video/*"
						class="hidden"
						@change="handleFileUpload"
					/>
					<span
						class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
					>
						Select Video File
					</span>
				</label>
			</div>
		</div>

		<!-- Processing Section -->
		<div v-if="isProcessing" class="processing-section text-center py-12">
			<Icon
				name="mdi:brain"
				class="text-6xl text-blue-500 animate-pulse mb-4"
			/>
			<p class="text-lg mb-4">AI is analyzing your video...</p>
			<div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-4">
				<div
					class="bg-blue-600 h-4 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
			<p class="text-sm text-gray-500">{{ progress }}% complete</p>
			<div class="mt-6 text-sm text-gray-500">
				<p>
					Analyzing: Scene detection, Audio peaks, Visual interest, Engagement
					prediction
				</p>
			</div>
		</div>

		<!-- Results Section -->
		<div v-if="highlights.length > 0" class="results-section">
			<!-- Settings -->
			<div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
				<div class="flex items-center gap-2">
					<label class="text-sm font-medium">Target Duration:</label>
					<select v-model="targetDuration" class="border rounded px-3 py-1">
						<option :value="30">30 seconds</option>
						<option :value="60">60 seconds</option>
						<option :value="90">90 seconds</option>
						<option :value="120">2 minutes</option>
					</select>
				</div>
				<div class="flex-1"></div>
				<button
					@click="selectAll"
					class="text-sm text-blue-600 hover:underline"
				>
					Select All
				</button>
				<span class="text-sm text-gray-500">{{ selectedHighlights.length }}
					selected</span>
			</div>

			<!-- Highlights Grid -->
			<div class="grid grid-cols-2 gap-4 mb-6">
				<div
					v-for="highlight in highlights"
					:key="highlight.id"
					class="highlight-card border rounded-lg overflow-hidden"
					:class="{
						'ring-2 ring-blue-500': selectedHighlights.includes(highlight.id),
					}"
					@click="toggleHighlight(highlight.id)"
				>
					<div class="aspect-video bg-gray-100 relative">
						<img
							:src="highlight.thumbnail"
							class="w-full h-full object-cover"
						/>
						<div class="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
							{{ formatTime(highlight.startTime) }} - {{
								formatTime(highlight.endTime)
							}}
						</div>
						<div class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
							{{ Math.round(highlight.confidence * 100) }}% match
						</div>
						<div
							v-if="selectedHighlights.includes(highlight.id)"
							class="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
						>
							<Icon name="mdi:check-circle" class="text-4xl text-blue-600" />
						</div>
					</div>
					<div class="p-3">
						<p class="text-sm font-medium">{{ highlight.description }}</p>
						<p class="text-xs text-gray-500 mt-1">
							Duration: {{ highlight.endTime - highlight.startTime }}s
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button
					@click="videoFile = null;
					highlights = [];
					selectedHighlights = [];"
					class="px-4 py-2 border rounded-lg hover:bg-gray-50"
				>
					Upload New Video
				</button>
				<button
					@click="generateSummary"
					:disabled="selectedHighlights.length === 0"
					class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Icon name="mdi:movie-edit" class="mr-2" />
					Generate {{ targetDuration }}s Summary ({{
						selectedHighlights.length
					}} clips)
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.video-summary-generator {
	padding: 1.5rem;
}

.highlight-card {
	cursor: pointer;
	transition: all 0.2s;
}

.highlight-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
