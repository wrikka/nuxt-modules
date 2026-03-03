<script setup lang="ts">
const isProcessing = ref(false);
const progress = ref(0);
const uploadProgress = ref(0);
const originalVideo = ref<File | null>(null);
const processedVideo = ref<string | null>(null);
const selectedMethod = ref<"ai" | "chroma" | "manual">("ai");
const selectedBackground = ref<"transparent" | "blur" | "color" | "image">(
	"transparent",
);
const blurAmount = ref(10);
const backgroundColor = ref("#00FF00");
const selectedBgImage = ref<string | null>(null);
const showAdvancedSettings = ref(false);

const backgroundPresets = [
	{ id: "office", name: "Modern Office", thumbnail: "/bg/office.jpg" },
	{ id: "studio", name: "Studio", thumbnail: "/bg/studio.jpg" },
	{ id: "nature", name: "Nature", thumbnail: "/bg/nature.jpg" },
	{ id: "space", name: "Space", thumbnail: "/bg/space.jpg" },
];

function handleFileUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files?.[0]) {
		originalVideo.value = input.files[0];
		simulateUpload();
	}
}

function simulateUpload() {
	uploadProgress.value = 0;
	const interval = setInterval(() => {
		uploadProgress.value += 10;
		if (uploadProgress.value >= 100) {
			clearInterval(interval);
			removeBackground();
		}
	}, 200);
}

function removeBackground() {
	isProcessing.value = true;
	progress.value = 0;

	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			processedVideo.value = "/video/processed-no-bg.mp4";
		}
	}, 300);
}

function downloadVideo() {
	alert("Downloading video with background removed...");
}
</script>

<template>
	<div class="bg-removal-video">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:image-filter-center-focus" class="mr-2" />
			Background Removal (Video)
		</h2>
		<p class="text-gray-500 mb-6">AI chroma key without green screen</p>

		<!-- Upload Section -->
		<div
			v-if="!originalVideo && !isProcessing && !processedVideo"
			class="upload-section mb-6"
		>
			<div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
				<Icon name="mdi:video-plus" class="text-6xl text-gray-400 mb-4" />
				<p class="text-lg mb-4">Upload video to remove background</p>
				<p class="text-sm text-gray-500 mb-4">
					Supports MP4, MOV, AVI up to 500MB
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
						Select Video
					</span>
				</label>
			</div>
		</div>

		<!-- Upload Progress -->
		<div
			v-if="uploadProgress > 0 && uploadProgress < 100"
			class="upload-progress text-center py-8"
		>
			<p class="text-lg mb-4">Uploading video...</p>
			<div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4">
				<div
					class="bg-blue-600 h-3 rounded-full transition-all"
					:style="{ width: `${uploadProgress}%` }"
				/>
			</div>
			<p class="text-sm text-gray-500">{{ uploadProgress }}%</p>
		</div>

		<!-- Processing -->
		<div v-if="isProcessing" class="processing-section text-center py-8">
			<Icon
				name="mdi:brain"
				class="text-6xl text-blue-500 animate-pulse mb-4"
			/>
			<p class="text-lg mb-4">AI is removing background...</p>
			<div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4">
				<div
					class="bg-blue-600 h-3 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
			<p class="text-sm text-gray-500">{{ progress }}% complete</p>
			<div class="mt-4 text-sm text-gray-500">
				<p>Detecting: Subject edges, Motion blur, Hair details, Transparency</p>
			</div>
		</div>

		<!-- Settings & Preview -->
		<div v-if="originalVideo && !isProcessing" class="settings-preview">
			<div class="grid grid-cols-2 gap-6 mb-6">
				<!-- Method Selection -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-4">Removal Method</h3>
					<div class="space-y-2">
						<label
							class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white"
							:class="{ 'ring-2 ring-blue-500': selectedMethod === 'ai' }"
						>
							<input
								v-model="selectedMethod"
								type="radio"
								value="ai"
								class="hidden"
							/>
							<Icon name="mdi:brain" class="text-2xl text-blue-500" />
							<div>
								<div class="font-medium">AI Background Removal</div>
								<div class="text-sm text-gray-500">
									Automatic subject detection
								</div>
							</div>
						</label>
						<label
							class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white"
							:class="{ 'ring-2 ring-blue-500': selectedMethod === 'chroma' }"
						>
							<input
								v-model="selectedMethod"
								type="radio"
								value="chroma"
								class="hidden"
							/>
							<Icon name="mdi:palette" class="text-2xl text-green-500" />
							<div>
								<div class="font-medium">Chroma Key</div>
								<div class="text-sm text-gray-500">
									For green/blue screen footage
								</div>
							</div>
						</label>
						<label
							class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white"
							:class="{ 'ring-2 ring-blue-500': selectedMethod === 'manual' }"
						>
							<input
								v-model="selectedMethod"
								type="radio"
								value="manual"
								class="hidden"
							/>
							<Icon name="mdi:gesture" class="text-2xl text-orange-500" />
							<div>
								<div class="font-medium">Manual Mask</div>
								<div class="text-sm text-gray-500">Draw mask manually</div>
							</div>
						</label>
					</div>
				</div>

				<!-- Background Options -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-4">Background Replacement</h3>
					<div class="space-y-3">
						<label class="flex items-center gap-2">
							<input
								v-model="selectedBackground"
								type="radio"
								value="transparent"
								class="rounded"
							/>
							<span>Transparent (Alpha Channel)</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								v-model="selectedBackground"
								type="radio"
								value="blur"
								class="rounded"
							/>
							<span>Blur Original</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								v-model="selectedBackground"
								type="radio"
								value="color"
								class="rounded"
							/>
							<span>Solid Color</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								v-model="selectedBackground"
								type="radio"
								value="image"
								class="rounded"
							/>
							<span>Image/Video</span>
						</label>
					</div>

					<!-- Background Settings -->
					<div v-if="selectedBackground === 'blur'" class="mt-3">
						<label class="block text-sm mb-1"
						>Blur Amount: {{ blurAmount }}px</label>
						<input
							v-model="blurAmount"
							type="range"
							min="0"
							max="50"
							class="w-full"
						/>
					</div>

					<div v-if="selectedBackground === 'color'" class="mt-3">
						<label class="block text-sm mb-1">Background Color</label>
						<input
							v-model="backgroundColor"
							type="color"
							class="w-full h-10 rounded"
						/>
					</div>

					<div v-if="selectedBackground === 'image'" class="mt-3">
						<label class="block text-sm mb-1">Select Background</label>
						<div class="grid grid-cols-4 gap-2">
							<div
								v-for="bg in backgroundPresets"
								:key="bg.id"
								class="aspect-video rounded cursor-pointer overflow-hidden border-2"
								:class="{ 'border-blue-500': selectedBgImage === bg.id }"
								@click="selectedBgImage = bg.id"
							>
								<img :src="bg.thumbnail" class="w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Preview Section -->
			<div class="grid grid-cols-2 gap-4 mb-6">
				<div class="border rounded-lg p-4">
					<h4 class="font-medium mb-2">Original</h4>
					<div class="aspect-video bg-gray-900 rounded flex items-center justify-center">
						<Icon name="mdi:video" class="text-4xl text-gray-600" />
					</div>
				</div>
				<div class="border rounded-lg p-4">
					<h4 class="font-medium mb-2 flex items-center gap-2">
						Result
						<span
							v-if="processedVideo"
							class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded"
						>AI Processed</span>
					</h4>
					<div
						class="aspect-video bg-gray-900 rounded flex items-center justify-center relative overflow-hidden"
						:style="selectedBackground === 'color' ? { backgroundColor } : {}"
						:class="{ 'bg-transparent-pattern': selectedBackground === 'transparent' }"
					>
						<Icon name="mdi:account" class="text-6xl text-gray-400" />
						<div
							v-if="selectedBackground === 'blur'"
							class="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"
						/>
						<img
							v-if="selectedBgImage && selectedBackground === 'image'"
							:src="backgroundPresets.find(b => b.id === selectedBgImage)?.thumbnail"
							class="absolute inset-0 w-full h-full object-cover"
						/>
					</div>
				</div>
			</div>

			<!-- Advanced Settings -->
			<div class="mb-6">
				<button
					@click="showAdvancedSettings = !showAdvancedSettings"
					class="text-blue-600 text-sm hover:underline flex items-center gap-1"
				>
					<Icon
						:name="showAdvancedSettings ? 'mdi:chevron-up' : 'mdi:chevron-down'"
					/>
					{{ showAdvancedSettings ? "Hide" : "Show" }} Advanced Settings
				</button>

				<div
					v-if="showAdvancedSettings"
					class="mt-3 bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4"
				>
					<div>
						<label class="block text-sm mb-1">Edge Feather</label>
						<input type="range" min="0" max="20" value="5" class="w-full" />
					</div>
					<div>
						<label class="block text-sm mb-1">Color Spill Removal</label>
						<input type="range" min="0" max="100" value="50" class="w-full" />
					</div>
					<div>
						<label class="block text-sm mb-1">Motion Smoothing</label>
						<input type="range" min="0" max="10" value="3" class="w-full" />
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button
					@click="originalVideo = null;
					processedVideo = null;"
					class="px-4 py-2 border rounded-lg hover:bg-gray-50"
				>
					Upload New
				</button>
				<button
					v-if="!processedVideo"
					@click="removeBackground"
					class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
				>
					<Icon name="mdi:magic" class="mr-1" />
					Remove Background
				</button>
				<button
					v-else
					@click="downloadVideo"
					class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
				>
					<Icon name="mdi:download" class="mr-1" />
					Download Result
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg-removal-video {
	padding: 1.5rem;
}

.bg-transparent-pattern {
	background-image:
		linear-gradient(45deg, #ccc 25%, transparent 25%),
		linear-gradient(-45deg, #ccc 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #ccc 75%),
		linear-gradient(-45deg, transparent 75%, #ccc 75%);
	background-size: 20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
