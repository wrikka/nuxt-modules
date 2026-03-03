<script setup lang="ts">
const emit = defineEmits<
	{ close: []; export: [format: string, quality: string, settings: any] }
>();
const format = ref("mp4");
const quality = ref("high");
const resolution = ref("1080p");
const fps = ref(30);
const codec = ref("h264");
const includeAudio = ref(true);
const formats = [{ id: "mp4", name: "MP4" }, { id: "mov", name: "MOV" }, {
	id: "webm",
	name: "WebM",
}, { id: "gif", name: "GIF" }];
const qualities = [
	{ id: "draft", name: "Draft" },
	{ id: "high", name: "High" },
	{ id: "master", name: "Master" },
];
const exportFile = () =>
	emit("export", format.value, quality.value, {
		resolution: resolution.value,
		fps: fps.value,
		codec: codec.value,
	});
</script>
<template>
	<div class="export-settings bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-export" class="w-5 h-5" />Export Settings
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-2 block">Format</label>
			<div class="grid grid-cols-4 gap-2">
				<button
					v-for="f in formats"
					:key="f.id"
					class="p-2 rounded-lg text-center text-sm"
					:class="format === f.id
					? 'bg-blue-600 text-white'
					: 'bg-gray-700 text-gray-300'"
					@click="format = f.id"
				>
					{{ f.name }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-2 block">Quality</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="q in qualities"
					:key="q.id"
					class="p-2 rounded-lg text-center text-sm"
					:class="quality === q.id
					? 'bg-blue-600 text-white'
					: 'bg-gray-700 text-gray-300'"
					@click="quality = q.id"
				>
					{{ q.name }}
				</button>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label class="text-gray-400 text-xs">Resolution</label><select
					v-model="resolution"
					class="w-full bg-gray-700 text-white px-2 py-1.5 rounded-lg text-sm"
				>
					<option>720p</option>
					<option>1080p</option>
					<option>4K</option>
				</select>
			</div>
			<div>
				<label class="text-gray-400 text-xs">FPS</label><select
					v-model="fps"
					class="w-full bg-gray-700 text-white px-2 py-1.5 rounded-lg text-sm"
				>
					<option>24</option>
					<option>30</option>
					<option>60</option>
				</select>
			</div>
		</div>
		<label class="flex items-center gap-2 text-sm text-gray-300 mb-4"><input
				v-model="includeAudio"
				type="checkbox"
				class="w-4 h-4 rounded"
			>Include Audio</label>
		<button
			class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
			@click="exportFile"
		>
			Export
		</button>
	</div>
</template>
