<script setup lang="ts">
const isProcessing = ref(false);
const progress = ref(0);
const uploadedVideo = ref<File | null>(null);
const projectionMode = ref<"equirectangular" | "cubemap" | "dual-fisheye">(
	"equirectangular",
);
const fieldOfView = ref(90);
const yaw = ref(0);
const pitch = ref(0);
const roll = ref(0);
const showStabilization = ref(true);
const stitchingMode = ref("auto");
const spatialAudio = ref(true);

function handleFileUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files?.[0]) {
		uploadedVideo.value = input.files[0];
	}
}

function startProcessing() {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
		}
	}, 200);
}

function resetView() {
	yaw.value = 0;
	pitch.value = 0;
	roll.value = 0;
	fieldOfView.value = 90;
}
</script>

<template>
	<div class="video-360-editor">
		<h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
			<Icon name="mdi:earth" class="w-6 h-6" />
			360° Video Editing
		</h2>
		<p class="text-gray-500 mb-6">
			Support for VR/360 video with spatial audio
		</p>

		<!-- Upload Section -->
		<div v-if="!uploadedVideo && !isProcessing" class="upload-section mb-6">
			<div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
				<Icon
					name="mdi:earth"
					class="w-12 h-12 text-gray-400 mb-4 block mx-auto"
				/>
				<p class="text-lg mb-2">Upload 360° Video</p>
				<p class="text-sm text-gray-500 mb-4">
					Supports equirectangular, cubemap, and dual-fisheye formats
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
						Select 360 Video
					</span>
				</label>
			</div>
		</div>

		<!-- Processing -->
		<div v-if="isProcessing" class="processing-section text-center py-12">
			<Icon
				name="mdi:rotate-3d"
				class="w-12 h-12 text-blue-500 animate-spin mb-4 block mx-auto"
			/>
			<p class="text-lg mb-4">Processing 360° video...</p>
			<div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-4">
				<div
					class="bg-blue-600 h-4 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
			<p class="text-sm text-gray-500">{{ progress }}% complete</p>
			<div class="mt-4 text-sm text-gray-500">
				<p>Analyzing: Projection format, Stitching points, Spatial metadata</p>
			</div>
		</div>

		<!-- Editor Interface -->
		<div v-if="uploadedVideo && !isProcessing" class="editor-interface">
			<div class="grid grid-cols-3 gap-6 mb-6">
				<!-- Main Preview -->
				<div class="col-span-2">
					<div class="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
						<!-- 360 Viewport -->
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="text-center">
								<Icon
									name="mdi:earth"
									class="w-12 h-12 text-gray-600 mb-4 block"
								/>
								<p class="text-gray-400">360° Viewport</p>
								<p class="text-sm text-gray-500">Drag to look around</p>
							</div>
						</div>

						<!-- View Controls -->
						<div class="absolute bottom-4 left-4 flex gap-2">
							<button
								class="bg-black/50 text-white p-2 rounded hover:bg-black/70"
								@click="resetView"
							>
								<Icon name="mdi:compass" class="w-5 h-5" />
							</button>
							<button class="bg-black/50 text-white p-2 rounded hover:bg-black/70">
								<Icon name="mdi:fullscreen" class="w-5 h-5" />
							</button>
							<button class="bg-black/50 text-white p-2 rounded hover:bg-black/70">
								<Icon name="mdi:glasses" class="w-5 h-5" />
							</button>
						</div>

						<!-- Projection Info -->
						<div class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
							{{ projectionMode }} | {{ fieldOfView }}° FOV
						</div>
					</div>

					<!-- Timeline -->
					<div class="mt-4 bg-gray-100 rounded-lg p-4">
						<div class="flex items-center gap-4">
							<button class="p-2 hover:bg-gray-200 rounded">
								<Icon name="mdi:play" class="w-5 h-5" />
							</button>
							<div class="flex-1">
								<input
									type="range"
									min="0"
									max="100"
									value="0"
									class="w-full"
								/>
							</div>
							<span class="text-sm text-gray-500">00:00 / 02:30</span>
						</div>
					</div>
				</div>

				<!-- Controls Panel -->
				<div class="space-y-4">
					<!-- View Controls -->
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold mb-4">View Controls</h3>

						<div class="space-y-3">
							<div>
								<label class="text-sm">Yaw: {{ yaw }}°</label>
								<input
									v-model="yaw"
									type="range"
									min="-180"
									max="180"
									class="w-full"
								/>
							</div>
							<div>
								<label class="text-sm">Pitch: {{ pitch }}°</label>
								<input
									v-model="pitch"
									type="range"
									min="-90"
									max="90"
									class="w-full"
								/>
							</div>
							<div>
								<label class="text-sm">Roll: {{ roll }}°</label>
								<input
									v-model="roll"
									type="range"
									min="-180"
									max="180"
									class="w-full"
								/>
							</div>
							<div>
								<label class="text-sm">Field of View: {{ fieldOfView }}°</label>
								<input
									v-model="fieldOfView"
									type="range"
									min="30"
									max="120"
									class="w-full"
								/>
							</div>
						</div>
					</div>

					<!-- Projection Settings -->
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold mb-3">Projection</h3>
						<div class="space-y-2">
							<label class="flex items-center gap-2">
								<input
									v-model="projectionMode"
									type="radio"
									value="equirectangular"
									class="rounded"
								/>
								<span class="text-sm">Equirectangular</span>
							</label>
							<label class="flex items-center gap-2">
								<input
									v-model="projectionMode"
									type="radio"
									value="cubemap"
									class="rounded"
								/>
								<span class="text-sm">Cubemap</span>
							</label>
							<label class="flex items-center gap-2">
								<input
									v-model="projectionMode"
									type="radio"
									value="dual-fisheye"
									class="rounded"
								/>
								<span class="text-sm">Dual Fisheye</span>
							</label>
						</div>
					</div>

					<!-- Stabilization -->
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold mb-3">Stabilization</h3>
						<label class="flex items-center gap-2 mb-3">
							<input
								v-model="showStabilization"
								type="checkbox"
								class="rounded"
							/>
							<span>Enable 360° stabilization</span>
						</label>
						<select
							v-model="stitchingMode"
							class="w-full border rounded px-3 py-2 text-sm"
						>
							<option value="auto">Auto Stitching</option>
							<option value="manual">Manual Stitching</option>
							<option value="template">Use Template</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Spatial Audio -->
			<div class="bg-gray-50 rounded-lg p-4 mb-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<Icon name="mdi:waveform" class="w-6 h-6 text-blue-500" />
						<div>
							<h3 class="font-semibold">Spatial Audio</h3>
							<p class="text-sm text-gray-500">
								Ambisonics (B-Format) support for immersive sound
							</p>
						</div>
					</div>
					<label class="flex items-center gap-2">
						<input v-model="spatialAudio" type="checkbox" class="rounded" />
						<span>Enable</span>
					</label>
				</div>

				<div v-if="spatialAudio" class="mt-4 grid grid-cols-4 gap-4">
					<div class="text-center">
						<Icon name="mdi:speaker" class="w-6 h-6 mb-1 block mx-auto" />
						<p class="text-xs">Front</p>
					</div>
					<div class="text-center">
						<Icon name="mdi:speaker" class="w-6 h-6 mb-1 block mx-auto" />
						<p class="text-xs">Back</p>
					</div>
					<div class="text-center">
						<Icon name="mdi:speaker" class="w-6 h-6 mb-1 block mx-auto" />
						<p class="text-xs">Left</p>
					</div>
					<div class="text-center">
						<Icon name="mdi:speaker" class="w-6 h-6 mb-1 block mx-auto" />
						<p class="text-xs">Right</p>
					</div>
				</div>
			</div>

			<!-- Export Options -->
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold mb-3">Export Settings</h3>
				<div class="grid grid-cols-4 gap-4">
					<div>
						<label class="block text-sm mb-1">Format</label>
						<select class="w-full border rounded px-3 py-2 text-sm">
							<option>MPEG-4 (MP4)</option>
							<option>QuickTime (MOV)</option>
							<option>WebM</option>
						</select>
					</div>
					<div>
						<label class="block text-sm mb-1">Resolution</label>
						<select class="w-full border rounded px-3 py-2 text-sm">
							<option>8K (8192x4096)</option>
							<option>4K (4096x2048)</option>
							<option>2K (2048x1024)</option>
						</select>
					</div>
					<div>
						<label class="block text-sm mb-1">Output Type</label>
						<select class="w-full border rounded px-3 py-2 text-sm">
							<option>360° Video</option>
							<option>Flat (POV)</option>
							<option>Little Planet</option>
						</select>
					</div>
					<div class="flex items-end">
						<button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
							<Icon name="mdi:upload" class="w-4 h-4" />
							Export
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.video-360-editor {
	padding: 1.5rem;
}
</style>
