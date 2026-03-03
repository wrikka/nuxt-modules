<script setup lang="ts">
const emit = defineEmits<{ close: []; sync: [angle: number] }>();
const cameras = ref([
	{ id: 1, name: "Camera A", active: true },
	{ id: 2, name: "Camera B", active: false },
	{ id: 3, name: "Camera C", active: false },
	{ id: 4, name: "Camera D", active: false },
]);
const syncMethod = ref("audio");
const activeCamera = computed(() => cameras.value.find(c => c.active));

const switchCamera = (id: number) => {
	cameras.value.forEach(c => c.active = c.id === id);
	emit("sync", id);
};
</script>
<template>
	<div class="multi-camera-editor bg-white dark:bg-gray-800 rounded-xl p-4 w-[600px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:video" class="w-5 h-5 text-blue-500" />Multi-Camera
				Editor
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
				{{ activeCamera?.name }} Feed
			</div>
			<div class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded flex items-center gap-1">
				<Icon name="mdi:circle" class="w-3 h-3" /> LIVE
			</div>
		</div>
		<div class="grid grid-cols-4 gap-2 mb-4">
			<button
				v-for="cam in cameras"
				:key="cam.id"
				class="aspect-video rounded-lg relative overflow-hidden transition-all"
				:class="cam.active
				? 'ring-2 ring-blue-500'
				: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="switchCamera(cam.id)"
			>
				<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
					{{ cam.name }}
				</div>
				<div
					v-if="cam.active"
					class="absolute bottom-1 left-1 w-2 h-2 bg-green-500 rounded-full"
				/>
			</button>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Sync Method</label>
			<div class="flex gap-2">
				<button
					v-for='m in ["audio", "timecode", "manual"]'
					:key="m"
					class="flex-1 p-2 rounded-lg text-sm capitalize transition-colors"
					:class="syncMethod === m
					? 'bg-blue-600 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="syncMethod = m"
				>
					{{ m }}
				</button>
			</div>
		</div>
		<div class="flex gap-2">
			<button class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
				Auto Sync
			</button>
			<button class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition-colors">
				Export Multicam
			</button>
		</div>
	</div>
</template>
