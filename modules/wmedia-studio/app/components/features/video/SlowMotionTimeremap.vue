<script setup lang="ts">
interface SpeedSegment {
	id: string;
	startTime: number;
	endTime: number;
	speed: number;
	type: "slow" | "fast" | "normal" | "freeze";
}

const videoDuration = ref(120);
const currentTime = ref(30);
const selectedSegment = ref<SpeedSegment | null>(null);
const isProcessing = ref(false);

const segments = ref<SpeedSegment[]>([
	{ id: "1", startTime: 0, endTime: 15, speed: 1, type: "normal" },
	{ id: "2", startTime: 15, endTime: 25, speed: 0.25, type: "slow" },
	{ id: "3", startTime: 25, endTime: 35, speed: 2, type: "fast" },
	{ id: "4", startTime: 35, endTime: 45, speed: 1, type: "normal" },
	{ id: "5", startTime: 45, endTime: 45.5, speed: 0, type: "freeze" },
	{ id: "6", startTime: 45.5, endTime: 120, speed: 1, type: "normal" },
]);

const presets = [
	{ label: "Super Slow", speed: 0.125, icon: "mdi:slow-motion" },
	{ label: "Slow Mo", speed: 0.25, icon: "mdi:play-speed" },
	{ label: "Half Speed", speed: 0.5, icon: "mdi:speedometer-slow" },
	{ label: "Normal", speed: 1, icon: "mdi:speedometer-medium" },
	{ label: "2x Fast", speed: 2, icon: "mdi:speedometer" },
	{ label: "4x Fast", speed: 4, icon: "mdi:speedometer-fast" },
	{ label: "Freeze", speed: 0, icon: "mdi:camera" },
];

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getSegmentColor(type: string): string {
	return {
		slow: "bg-blue-400",
		fast: "bg-orange-400",
		freeze: "bg-red-400",
		normal: "bg-gray-300",
	}[type] || "bg-gray-300";
}

function applySpeed(speed: number, type: string) {
	if (selectedSegment.value) {
		selectedSegment.value.speed = speed;
		selectedSegment.value.type = type as any;
	}
}

function addSegment() {
	const newSegment: SpeedSegment = {
		id: Date.now().toString(),
		startTime: currentTime.value,
		endTime: currentTime.value + 5,
		speed: 0.5,
		type: "slow",
	};
	segments.value.push(newSegment);
	selectedSegment.value = newSegment;
}

function renderEffect() {
	isProcessing.value = true;
	setTimeout(() => isProcessing.value = false, 2000);
}
</script>

<template>
	<div class="slow-motion-timeremap">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:timer-10" class="mr-2" />Slow Motion & Time Remapping
		</h2>
		<p class="text-gray-500 mb-6">Speed ramping, freeze frames, optical flow</p>

		<div class="grid grid-cols-3 gap-6">
			<!-- Preview -->
			<div class="col-span-2">
				<div class="aspect-video bg-gray-900 rounded-lg relative overflow-hidden mb-4">
					<div class="absolute inset-0 flex items-center justify-center">
						<Icon name="mdi:play-circle" class="text-6xl text-white/50" />
					</div>
					<div class="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
						{{ formatTime(currentTime) }} • {{
							segments.find(s =>
								currentTime >= s.startTime && currentTime <= s.endTime
							)?.speed || 1
						}}x
					</div>
					<div
						v-if="segments.find(s =>
							currentTime >= s.startTime && currentTime <= s.endTime
						)?.type === 'slow'"
						class="absolute bottom-4 right-4 text-blue-400"
					>
						<Icon name="mdi:slow-motion" class="text-2xl" /> Slow Motion Active
					</div>
				</div>

				<!-- Timeline with Segments -->
				<div class="bg-gray-100 rounded-lg p-4 mb-4">
					<div class="relative h-16 bg-gray-200 rounded mb-2">
						<div
							v-for="segment in segments"
							:key="segment.id"
							class="absolute top-0 h-full cursor-pointer transition-all hover:brightness-110"
							:class="[
								getSegmentColor(segment.type),
								selectedSegment?.id === segment.id
									? 'ring-2 ring-blue-500 z-10'
									: '',
							]"
							:style="{
								left: `${(segment.startTime / videoDuration) * 100}%`,
								width: `${
									((segment.endTime - segment.startTime) / videoDuration) * 100
								}%`,
							}"
							@click="selectedSegment = segment"
						>
							<div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/80">
								{{ segment.speed }}x
							</div>
						</div>
						<div
							class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
							:style="{ left: `${(currentTime / videoDuration) * 100}%` }"
						>
							<div class="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
						</div>
					</div>
					<div class="flex justify-between text-xs text-gray-500">
						<span v-for="n in 6" :key="n">{{
							formatTime((n - 1) * (videoDuration / 5))
						}}</span>
					</div>
				</div>

				<!-- Speed Presets -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Speed Presets</h3>
					<div class="grid grid-cols-4 gap-2">
						<button
							v-for="preset in presets"
							:key="preset.label"
							@click="applySpeed(
								preset.speed,
								preset.label.toLowerCase().includes('freeze')
									? 'freeze'
									: preset.label.toLowerCase().includes('slow')
									? 'slow'
									: preset.speed > 1
									? 'fast'
									: 'normal',
							)"
							class="p-3 border rounded-lg text-center hover:bg-gray-50"
							:class="selectedSegment?.speed === preset.speed
							? 'ring-2 ring-blue-500 bg-blue-50'
							: ''"
						>
							<Icon :name="preset.icon" class="text-xl mb-1" />
							<div class="text-sm font-medium">{{ preset.label }}</div>
							<div class="text-xs text-gray-500">{{ preset.speed }}x</div>
						</button>
					</div>
				</div>
			</div>

			<!-- Controls -->
			<div class="space-y-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold">Segment Editor</h3>
						<button
							@click="addSegment"
							class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
						>
							<Icon name="mdi:plus" class="mr-1" />Add Segment
						</button>
					</div>

					<div v-if="selectedSegment" class="space-y-3">
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="text-xs text-gray-500">Start</label>
								<input
									v-model.number="selectedSegment.startTime"
									type="number"
									class="w-full border rounded px-2 py-1 text-sm"
								/>
							</div>
							<div>
								<label class="text-xs text-gray-500">End</label>
								<input
									v-model.number="selectedSegment.endTime"
									type="number"
									class="w-full border rounded px-2 py-1 text-sm"
								/>
							</div>
						</div>
						<div>
							<label class="text-xs text-gray-500"
							>Speed: {{ selectedSegment.speed }}x</label>
							<input
								v-model.number="selectedSegment.speed"
								type="range"
								min="0"
								max="4"
								step="0.125"
								class="w-full"
							/>
						</div>
						<div>
							<label class="text-xs text-gray-500">Ramping</label>
							<select class="w-full border rounded px-2 py-1 text-sm">
								<option>Instant</option>
								<option>Smooth Ease</option>
								<option>Exponential</option>
							</select>
						</div>
					</div>
					<p v-else class="text-sm text-gray-500 text-center py-4">
						Select a segment to edit
					</p>
				</div>

				<!-- Optical Flow -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Optical Flow</h3>
					<label class="flex items-start gap-2 mb-3">
						<input type="checkbox" checked class="rounded mt-1" />
						<div>
							<span class="font-medium text-sm">Frame Interpolation</span>
							<p class="text-xs text-gray-500">
								Generate intermediate frames for smooth slow motion
							</p>
						</div>
					</label>
					<div>
						<label class="text-xs text-gray-500">Quality</label>
						<select class="w-full border rounded px-2 py-1 text-sm">
							<option>Fast (Nearest)</option>
							<option selected>Balanced (Blend)</option>
							<option>High Quality (AI Flow)</option>
						</select>
					</div>
				</div>

				<!-- Render -->
				<button
					@click="renderEffect"
					:disabled="isProcessing"
					class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
				>
					<Icon
						v-if="isProcessing"
						name="mdi:loading"
						class="animate-spin mr-1"
					/>
					<Icon v-else name="mdi:render" class="mr-1" />
					{{ isProcessing ? "Rendering..." : "Apply Time Remap" }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.slow-motion-timeremap {
	padding: 1.5rem;
}
</style>
