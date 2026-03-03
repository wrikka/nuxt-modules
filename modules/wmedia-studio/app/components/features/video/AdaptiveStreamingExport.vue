<script setup lang="ts">
interface QualityLevel {
	height: number;
	bitrate: string;
	bandwidth: string;
}

interface StreamingFormat {
	id: string;
	name: string;
	icon: string;
	description: string;
	enabled: boolean;
}

const videoFile = ref<File | null>(null);
const isGenerating = ref(false);
const progress = ref(0);
const selectedFormats = ref<string[]>(["hls", "dash"]);
const adaptiveBitrate = ref(true);
const generateThumbnails = ref(true);
const thumbnailInterval = ref(10);
const cdnProvider = ref("cloudflare");

const qualityLevels = ref<QualityLevel[]>([
	{ height: 2160, bitrate: "8000k", bandwidth: "8000000" },
	{ height: 1440, bitrate: "6000k", bandwidth: "6000000" },
	{ height: 1080, bitrate: "4000k", bandwidth: "4000000" },
	{ height: 720, bitrate: "2500k", bandwidth: "2500000" },
	{ height: 480, bitrate: "1000k", bandwidth: "1000000" },
	{ height: 360, bitrate: "600k", bandwidth: "600000" },
]);

const streamingFormats: StreamingFormat[] = [
	{
		id: "hls",
		name: "HLS (Apple)",
		icon: "mdi:apple",
		description: "HTTP Live Streaming - Best for iOS/macOS",
		enabled: true,
	},
	{
		id: "dash",
		name: "DASH (MPEG)",
		icon: "mdi:video",
		description: "Dynamic Adaptive Streaming - Universal",
		enabled: true,
	},
	{
		id: "smooth",
		name: "Smooth Streaming",
		icon: "mdi:monitor",
		description: "Microsoft Smooth Streaming",
		enabled: false,
	},
	{
		id: "webm",
		name: "WebM DASH",
		icon: "mdi:google-chrome",
		description: "WebM format for Chrome/Firefox",
		enabled: false,
	},
];

const cdnProviders = [
	{ id: "cloudflare", name: "Cloudflare Stream", icon: "mdi:cloud" },
	{ id: "aws", name: "AWS CloudFront", icon: "mdi:cloud-cog" },
	{ id: "gcp", name: "Google Cloud CDN", icon: "mdi:cloud" },
	{ id: "azure", name: "Azure CDN", icon: "mdi:cloud" },
];

function handleFileUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files?.[0]) {
		videoFile.value = input.files[0];
	}
}

function generateStreamingPackage() {
	isGenerating.value = true;
	progress.value = 0;

	const interval = setInterval(() => {
		progress.value += 3;
		if (progress.value >= 100) {
			clearInterval(interval);
			isGenerating.value = false;
		}
	}, 200);
}

function copyEmbedCode() {
	const code = `<video controls>
  <source src="https://cdn.example.com/stream/manifest.m3u8" type="application/x-mpegURL">
  <source src="https://cdn.example.com/stream/manifest.mpd" type="application/dash+xml">
</video>`;
	navigator.clipboard.writeText(code);
	alert("Embed code copied!");
}

function toggleFormat(id: string) {
	const index = selectedFormats.value.indexOf(id);
	if (index > -1) {
		selectedFormats.value.splice(index, 1);
	} else {
		selectedFormats.value.push(id);
	}
}

function removeQuality(height: number) {
	const index = qualityLevels.value.findIndex(q => q.height === height);
	if (index > -1) qualityLevels.value.splice(index, 1);
}

function addQuality() {
	qualityLevels.value.push({
		height: 240,
		bitrate: "400k",
		bandwidth: "400000",
	});
}
</script>

<template>
	<div class="adaptive-streaming-export">
		<h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
			<Icon name="mdi:radio-tower" class="w-6 h-6" />
			Adaptive Streaming Export
		</h2>
		<p class="text-gray-500 mb-6">Auto-generate HLS/DASH for web streaming</p>

		<!-- Upload -->
		<div v-if="!videoFile" class="upload-section mb-6">
			<div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<Icon
					name="mdi:cloud-upload"
					class="w-12 h-12 text-gray-400 mb-4 block mx-auto"
				/>
				<p class="mb-4">Upload video to create adaptive streaming package</p>
				<label class="cursor-pointer">
					<input
						type="file"
						accept="video/*"
						class="hidden"
						@change="handleFileUpload"
					/>
					<span
						class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
					>
						Select Video
					</span>
				</label>
			</div>
		</div>

		<!-- Settings Panel -->
		<div v-else-if="!isGenerating && progress === 0" class="settings-panel">
			<!-- Streaming Formats -->
			<div class="mb-6 bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold mb-4">Streaming Formats</h3>
				<div class="grid grid-cols-2 gap-3">
					<label
						v-for="format in streamingFormats"
						:key="format.id"
						class="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white"
						:class="{ 'ring-2 ring-blue-500': selectedFormats.includes(format.id) }"
					>
						<input
							:checked="selectedFormats.includes(format.id)"
							type="checkbox"
							class="mt-1 rounded"
							@change="toggleFormat(format.id)"
						/>
						<div>
							<div class="flex items-center gap-2">
								<Icon :name="format.icon" class="w-5 h-5" />
								<span class="font-medium">{{ format.name }}</span>
							</div>
							<p class="text-sm text-gray-500">{{ format.description }}</p>
						</div>
					</label>
				</div>
			</div>

			<!-- Quality Levels -->
			<div class="mb-6 bg-gray-50 rounded-lg p-4">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-semibold">Quality Levels (Ladder)</h3>
					<label class="flex items-center gap-2 text-sm">
						<input v-model="adaptiveBitrate" type="checkbox" class="rounded" />
						Adaptive Bitrate
					</label>
				</div>

				<div class="space-y-2 mb-3">
					<div
						v-for="quality in qualityLevels"
						:key="quality.height"
						class="flex items-center gap-4 p-3 bg-white rounded-lg"
					>
						<div class="w-16 font-medium">{{ quality.height }}p</div>
						<div class="flex-1">
							<label class="text-xs text-gray-500">Bitrate</label>
							<input
								v-model="quality.bitrate"
								type="text"
								class="w-full border rounded px-2 py-1 text-sm"
							/>
						</div>
						<div class="flex-1">
							<label class="text-xs text-gray-500">Bandwidth (bps)</label>
							<input
								v-model="quality.bandwidth"
								type="text"
								class="w-full border rounded px-2 py-1 text-sm"
							/>
						</div>
						<button
							@click="removeQuality(quality.height)"
							class="text-red-500 hover:text-red-700"
						>
							<Icon name="mdi:delete" class="w-4 h-4" />
						</button>
					</div>
				</div>
				<button
					@click="addQuality"
					class="text-blue-600 text-sm hover:underline flex items-center"
				>
					<Icon name="mdi:plus" class="w-4 h-4 mr-1" />
					Add Quality Level
				</button>
			</div>

			<!-- CDN Selection -->
			<div class="mb-6 bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold mb-4">CDN Provider</h3>
				<div class="grid grid-cols-4 gap-3">
					<label
						v-for="cdn in cdnProviders"
						:key="cdn.id"
						class="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-white"
						:class="{ 'ring-2 ring-blue-500': cdnProvider === cdn.id }"
					>
						<input
							v-model="cdnProvider"
							type="radio"
							:value="cdn.id"
							class="hidden"
						/>
						<Icon :name="cdn.icon" class="w-6 h-6" />
						<span class="text-sm text-center">{{ cdn.name }}</span>
					</label>
				</div>
			</div>

			<!-- Thumbnail Options -->
			<div class="mb-6 bg-gray-50 rounded-lg p-4">
				<div class="flex items-center gap-4 mb-3">
					<label class="flex items-center gap-2">
						<input
							v-model="generateThumbnails"
							type="checkbox"
							class="rounded"
						/>
						<span class="font-medium">Generate Thumbnails for Scrubbing</span>
					</label>
				</div>
				<div v-if="generateThumbnails" class="flex items-center gap-4">
					<label class="text-sm">Interval:</label>
					<select v-model="thumbnailInterval" class="border rounded px-3 py-1">
						<option :value="5">Every 5 seconds</option>
						<option :value="10">Every 10 seconds</option>
						<option :value="30">Every 30 seconds</option>
					</select>
				</div>
			</div>

			<!-- Generate Button -->
			<button
				@click="generateStreamingPackage"
				class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
			>
				<Icon name="mdi:package-variant" class="w-5 h-5" />
				Generate Streaming Package
			</button>
		</div>

		<!-- Progress -->
		<div v-if="isGenerating" class="generating-section text-center py-12">
			<Icon
				name="mdi:cog"
				class="w-16 h-16 text-blue-500 animate-spin mb-4 block mx-auto"
			/>
			<p class="text-lg mb-4">Generating adaptive streaming package...</p>
			<div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-4">
				<div
					class="bg-blue-600 h-4 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
			<p class="text-sm text-gray-500">{{ progress }}% complete</p>
			<div class="mt-4 text-sm text-gray-500">
				<p v-if="progress < 30">Encoding video variants...</p>
				<p v-else-if="progress < 60">Generating manifest files...</p>
				<p v-else-if="progress < 90">Creating thumbnails...</p>
				<p v-else>Uploading to CDN...</p>
			</div>
		</div>

		<!-- Result -->
		<div
			v-if="progress >= 100"
			class="result-section bg-gray-50 rounded-lg p-6"
		>
			<div class="text-center mb-6">
				<Icon
					name="mdi:check-circle"
					class="w-16 h-16 text-green-500 mb-2 block mx-auto"
				/>
				<h3 class="text-xl font-bold">Streaming Package Ready!</h3>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-6">
				<div class="bg-white rounded-lg p-4">
					<h4 class="font-medium mb-2">Generated Files</h4>
					<ul class="text-sm space-y-1 text-gray-600">
						<li class="flex items-center gap-2">
							<Icon name="mdi:file-video" class="w-4 h-4" />
							6 quality variants (360p-4K)
						</li>
						<li class="flex items-center gap-2">
							<Icon name="mdi:file-code" class="w-4 h-4" />
							HLS manifest (master.m3u8)
						</li>
						<li class="flex items-center gap-2">
							<Icon name="mdi:file-code" class="w-4 h-4" />
							DASH manifest (manifest.mpd)
						</li>
						<li class="flex items-center gap-2">
							<Icon name="mdi:image" class="w-4 h-4" />
							120 thumbnail sprites
						</li>
					</ul>
				</div>
				<div class="bg-white rounded-lg p-4">
					<h4 class="font-medium mb-2">CDN URLs</h4>
					<div class="space-y-2">
						<div class="text-sm">
							<p class="text-gray-500">HLS Stream:</p>
							<code
								class="text-xs bg-gray-100 px-2 py-1 rounded block truncate"
							>
								https://cdn.example.com/hls/master.m3u8
							</code>
						</div>
						<div class="text-sm">
							<p class="text-gray-500">DASH Stream:</p>
							<code
								class="text-xs bg-gray-100 px-2 py-1 rounded block truncate"
							>
								https://cdn.example.com/dash/manifest.mpd
							</code>
						</div>
					</div>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					@click="copyEmbedCode"
					class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
				>
					<Icon name="mdi:code-json" class="w-4 h-4" />
					Copy Embed Code
				</button>
				<button class="flex-1 border py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
					<Icon name="mdi:download" class="w-4 h-4" />
					Download Package
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.adaptive-streaming-export {
	padding: 1.5rem;
}
</style>
