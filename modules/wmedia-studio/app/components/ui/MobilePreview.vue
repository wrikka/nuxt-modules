<script setup lang="ts">
const emit = defineEmits<{ close: []; preview: [device: string] }>();
const selectedDevice = ref("iphone14");
const orientation = ref("portrait");
const scale = ref(100);

const devices = [
	{ id: "iphone14", name: "iPhone 14", width: 393, height: 852 },
	{ id: "iphoneSE", name: "iPhone SE", width: 375, height: 667 },
	{ id: "pixel7", name: "Pixel 7", width: 412, height: 915 },
	{ id: "ipad", name: "iPad", width: 820, height: 1180 },
	{ id: "galaxyS23", name: "Galaxy S23", width: 384, height: 854 },
];

const currentDevice = computed(() =>
	devices.find(d => d.id === selectedDevice.value)
);
const previewWidth = computed(() =>
	orientation.value === "portrait"
		? currentDevice.value?.width
		: currentDevice.value?.height
);
const previewHeight = computed(() =>
	orientation.value === "portrait"
		? currentDevice.value?.height
		: currentDevice.value?.width
);
</script>
<template>
	<div class="mobile-preview bg-white dark:bg-gray-800 rounded-xl p-4 w-[600px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:cellphone" class="w-5 h-5 text-blue-500" />
				Mobile Preview
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<select
				v-model="selectedDevice"
				class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="d in devices" :key="d.id" :value="d.id">
					{{ d.name }}
				</option>
			</select>
			<button
				class="px-3 py-2 rounded-lg text-sm transition-all"
				:class="orientation === 'portrait'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="orientation = 'portrait'"
			>
				<Icon name="mdi:rotate-left" class="w-4 h-4" />
			</button>
			<button
				class="px-3 py-2 rounded-lg text-sm transition-all"
				:class="orientation === 'landscape'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="orientation = 'landscape'"
			>
				<Icon name="mdi:rotate-right" class="w-4 h-4" />
			</button>
		</div>
		<div class="flex justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
			<div
				class="border-4 border-gray-300 dark:border-gray-700 rounded-[2rem] overflow-hidden bg-black relative"
				:style="{
					width: `${(previewWidth || 0) * scale / 100}px`,
					height: `${(previewHeight || 0) * scale / 100}px`,
				}"
			>
				<div class="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-700 rounded-full" />
				<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
					{{ currentDevice?.name }} Preview
				</div>
				<div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-gray-700 rounded-full" />
			</div>
		</div>
		<div class="mt-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Scale</span>
				<span class="text-blue-500 font-medium">{{ scale }}%</span>
			</div>
			<input
				v-model="scale"
				type="range"
				min="50"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			/>
		</div>
	</div>
</template>
