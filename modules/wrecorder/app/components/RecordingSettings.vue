<script setup lang="ts">
import type { RecordingSource } from "./types";
import type { AudioDevice } from "~/composables/useAudioDevices";

const source = defineModel<RecordingSource>("source", { default: "screen" });
const audioEnabled = defineModel<boolean>("audioEnabled", { default: true });
const cameraEnabled = defineModel<boolean>("cameraEnabled", { default: false });
const selectedAudioDevice = defineModel<string>("selectedAudioDevice", { default: "" });
const videoResolution = defineModel<number>("videoResolution", { default: 1080 });
const videoBitrate = defineModel<number>("videoBitrate", { default: 5000 });
const virtualBackgroundEnabled = defineModel<boolean>("virtualBackgroundEnabled", { default: false });
const virtualBackgroundType = defineModel<"blur" | "color" | "image">("virtualBackgroundType", { default: "blur" });
const blurAmount = defineModel<number>("blurAmount", { default: 10 });
const backgroundColor = defineModel<string>("backgroundColor", { default: "#000000" });
const backgroundImage = defineModel<string>("backgroundImage", { default: "" });

const emit = defineEmits<{
	start: [];
}>();

const { audioInputDevices, getAudioDevices, requestAudioPermission } = useAudioDevices();

const sourceOptions = [
	{ value: "screen" as RecordingSource, label: "Screen", icon: "🖥️" },
	{ value: "camera" as RecordingSource, label: "Camera", icon: "📹" },
	{ value: "both" as RecordingSource, label: "Both", icon: "🎬" },
];

const bgTypes = [
	{ value: "blur" as const, label: "Blur", icon: "🌫️" },
	{ value: "color" as const, label: "Color", icon: "🎨" },
	{ value: "image" as const, label: "Image", icon: "🖼️" },
];

onMounted(async () => {
	await getAudioDevices();
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
			Recording Settings
		</h2>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Recording Source
				</label>
				<div class="grid grid-cols-3 gap-3">
					<button
						v-for="option in sourceOptions"
						:key="option.value"
						@click="source = option.value"
						:class="[
							'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
							source === option.value
								? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700',
						]"
					>
						<span class="text-3xl mb-2">{{ option.icon }}</span>
						<span class="text-sm font-medium text-gray-900 dark:text-white">
							{{ option.label }}
						</span>
					</button>
				</div>
			</div>

			<div v-if="audioEnabled" class="space-y-2">
			<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Audio Input Device
			</label>
			<div class="relative">
				<select
					v-model="selectedAudioDevice"
					class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
				>
					<option value="">Select a device...</option>
					<option
						v-for="device in audioInputDevices"
						:key="device.deviceId"
						:value="device.deviceId"
					>
						{{ device.label }}
					</option>
				</select>
				<Icon
					name="mdi:chevron-down"
					class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
				/>
			</div>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Video Quality
			</label>
			<div class="grid grid-cols-2 gap-3">
				<div class="relative">
					<select
						v-model="videoResolution"
						class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					>
						<option value="720">720p HD</option>
						<option value="1080">1080p FHD</option>
						<option value="1440">1440p QHD</option>
						<option value="2160">2160p 4K</option>
					</select>
					<Icon
						name="mdi:video"
						class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
					/>
				</div>
				<div class="relative">
					<select
						v-model="videoBitrate"
						class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					>
						<option value="2500">2.5 Mbps</option>
						<option value="5000">5 Mbps</option>
						<option value="8000">8 Mbps</option>
						<option value="15000">15 Mbps</option>
						<option value="25000">25 Mbps</option>
					</select>
					<Icon
						name="mdi:speedometer"
						class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
					/>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-between">
				<label class="flex items-center space-x-3 cursor-pointer">
					<input
						v-model="audioEnabled"
						type="checkbox"
						class="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
					/>
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Enable Audio
					</span>
				</label>
				<Icon
					:name="audioEnabled ? 'mdi:microphone' : 'mdi:microphone-off'"
					:class="[
						'text-2xl',
						audioEnabled ? 'text-green-500' : 'text-gray-400',
					]"
				/>
			</div>

			<div v-if="source === 'both'" class="flex items-center justify-between">
				<label class="flex items-center space-x-3 cursor-pointer">
					<input
						v-model="cameraEnabled"
						type="checkbox"
						class="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
					/>
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Show Camera Overlay
					</span>
				</label>
				<Icon
					:name="cameraEnabled ? 'mdi:camera' : 'mdi:camera-off'"
					:class="[
						'text-2xl',
						cameraEnabled ? 'text-blue-500' : 'text-gray-400',
					]"
				/>
			</div>

			<div v-if="cameraEnabled" class="space-y-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<label class="flex items-center space-x-3 cursor-pointer">
						<input
						v-model="virtualBackgroundEnabled"
						type="checkbox"
						class="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
					/>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
							Virtual Background
						</span>
					</label>
					<Icon
						:name="virtualBackgroundEnabled ? 'mdi:image-filter-hdr' : 'mdi:image-filter-hdr-off'"
						:class="[
							'text-2xl',
							virtualBackgroundEnabled ? 'text-purple-500' : 'text-gray-400',
						]"
					/>
				</div>

				<div v-if="virtualBackgroundEnabled" class="space-y-3">
					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Background Type
						</label>
						<div class="grid grid-cols-3 gap-2">
							<button
								v-for="type in bgTypes"
								:key="type.value"
								@click="virtualBackgroundType = type.value"
								:class="[
									'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
									virtualBackgroundType === type.value
										? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700',
								]"
							>
								<span class="text-2xl">{{ type.icon }}</span>
								<span class="text-xs font-medium text-gray-900 dark:text-white mt-1">
									{{ type.label }}
								</span>
							</button>
						</div>
					</div>

					<div v-if="virtualBackgroundType === 'blur'" class="space-y-2">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Blur Amount: {{ blurAmount }}px
						</label>
						<input
							v-model.number="blurAmount"
							type="range"
							min="0"
							max="20"
							class="w-full"
						/>
					</div>

					<div v-if="virtualBackgroundType === 'color'" class="space-y-2">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Background Color
						</label>
						<div class="flex items-center space-x-2">
							<input
								v-model="backgroundColor"
								type="color"
								class="w-10 h-10 rounded cursor-pointer"
							/>
							<input
								v-model="backgroundColor"
								type="text"
								placeholder="#000000"
								class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
							/>
						</div>
					</div>

					<div v-if="virtualBackgroundType === 'image'" class="space-y-2">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Background Image URL
						</label>
						<input
							v-model="backgroundImage"
							type="text"
							placeholder="https://example.com/image.jpg"
							class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
						/>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>
