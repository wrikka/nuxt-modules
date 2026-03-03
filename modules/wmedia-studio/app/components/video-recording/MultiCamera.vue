<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const activeCamera = defineModel<number>("activeCamera", { default: 0 });
const transitionType = defineModel<"cut" | "fade" | "slide" | "zoom">(
	"transition",
	{ default: "fade" },
);
const transitionDuration = defineModel<number>("duration", { default: 500 });

const cameras = ref([
	{
		id: 0,
		name: "Primary Webcam",
		type: "usb",
		status: "connected",
		resolution: "1080p",
		isActive: true,
	},
	{
		id: 1,
		name: "DSLR Camera",
		type: "hdmi",
		status: "connected",
		resolution: "4K",
		isActive: false,
	},
	{
		id: 2,
		name: "Overhead Camera",
		type: "usb",
		status: "disconnected",
		resolution: "1080p",
		isActive: false,
	},
	{
		id: 3,
		name: "Mobile Camera",
		type: "wifi",
		status: "connected",
		resolution: "1080p",
		isActive: false,
	},
]);

const transitionOptions = [
	{ value: "cut", label: "Cut", icon: "mdi:content-cut", duration: 0 },
	{ value: "fade", label: "Fade", icon: "mdi:fade", duration: 500 },
	{ value: "slide", label: "Slide", icon: "mdi:arrow-right", duration: 400 },
	{ value: "zoom", label: "Zoom", icon: "mdi:magnify", duration: 600 },
] as const;

const switchCamera = (id: number) => {
	activeCamera.value = id;
	cameras.value.forEach(c => c.isActive = c.id === id);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
					<Icon
						name="mdi:camera-switch"
						class="w-5 h-5 text-cyan-600 dark:text-cyan-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Multi-Camera Support
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Switch between camera angles
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-cyan-600 mt-0.5" />
					<p class="text-xs text-cyan-700 dark:text-cyan-300">
						Connect multiple cameras (USB, HDMI capture, mobile app) and switch
						between them during recording with smooth transitions.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Transition Effect</label>
				<div class="grid grid-cols-4 gap-2">
					<button
						v-for="trans in transitionOptions"
						:key="trans.value"
						:class="[
							'p-2 rounded-lg border text-center transition-all',
							transitionType === trans.value
								? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-cyan-300',
						]"
						@click="transitionType = trans.value"
					>
						<Icon
							:name="trans.icon"
							class="w-5 h-5 mx-auto mb-1"
							:class="transitionType === trans.value
							? 'text-cyan-600'
							: 'text-gray-500'"
						/>
						<div
							class="text-xs font-medium"
							:class="transitionType === trans.value
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600'"
						>
							{{ trans.label }}
						</div>
					</button>
				</div>
			</div>

			<div v-if="transitionType !== 'cut'">
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Transition Duration</span>
					<span class="text-gray-500">{{ transitionDuration }}ms</span>
				</div>
				<input
					v-model.number="transitionDuration"
					type="range"
					min="100"
					max="2000"
					step="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-cyan-600"
				>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Connected Cameras
				</h4>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="camera in cameras"
						:key="camera.id"
						:disabled="camera.status === 'disconnected'"
						:class="[
							'relative p-3 rounded-lg border text-left transition-all',
							camera.isActive
								? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-2 ring-cyan-500'
								: camera.status === 'connected'
								? 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
								: 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed',
						]"
						@click="switchCamera(camera.id)"
					>
						<div class="flex items-start justify-between">
							<Icon
								:name="camera.type === 'usb'
								? 'mdi:usb'
								: camera.type === 'hdmi'
								? 'mdi:hdmi-port'
								: camera.type === 'wifi'
								? 'mdi:wifi'
								: 'mdi:camera'"
								class="w-5 h-5"
								:class="camera.isActive ? 'text-cyan-600' : 'text-gray-500'"
							/>
							<span
								v-if="camera.isActive"
								class="px-1.5 py-0.5 text-xs bg-cyan-500 text-white rounded"
							>LIVE</span>
						</div>
						<div class="mt-2">
							<div class="text-sm font-medium text-gray-900 dark:text-white">
								{{ camera.name }}
							</div>
							<div class="text-xs text-gray-500">
								{{ camera.resolution }} • {{ camera.status }}
							</div>
						</div>
						<div
							v-if="camera.status === 'connected' && !camera.isActive"
							class="absolute top-2 right-2"
						>
							<span class="w-2 h-2 rounded-full bg-green-500"></span>
						</div>
					</button>
				</div>
			</div>

			<button class="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-cyan-400 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2">
				<Icon name="mdi:plus" class="w-4 h-4" />
				Add Camera Source
			</button>
		</div>
	</div>
</template>
