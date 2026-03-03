<script setup lang="ts">
const emit = defineEmits<{ close: []; detect: [confidence: number] }>();
const objects = ref([{
	label: "person",
	confidence: 98,
	bbox: [10, 20, 100, 200],
}, { label: "car", confidence: 87, bbox: [150, 80, 300, 250] }]);
const confidence = ref(50);
const showBoundingBoxes = ref(true);
const detect = () => emit("detect", confidence.value);
</script>
<template>
	<div class="ai-object-detection bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:scan" class="w-5 h-5 text-purple-500" />
				AI Object Detection
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Video Preview
			</div>
			<div
				v-if="showBoundingBoxes"
				v-for="(obj, i) in objects"
				:key="i"
				class="absolute border-2 border-green-500 bg-green-500/20"
				:style="{
					left: `${obj.bbox[0]}px`,
					top: `${obj.bbox[1]}px`,
					width: `${obj.bbox[2]}px`,
					height: `${obj.bbox[3]}px`,
				}"
			>
				<span
					class="absolute -top-5 left-0 bg-green-500 text-white text-xs px-1 rounded"
				>{{ obj.label }} {{ obj.confidence }}%</span>
			</div>
		</div>
		<div class="mb-3">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Confidence Threshold</span>
				<span class="text-purple-500 font-medium">{{ confidence }}%</span>
			</div>
			<input
				v-model="confidence"
				type="range"
				min="10"
				max="95"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<label
			class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-3"
		>
			<input
				v-model="showBoundingBoxes"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
			>
			<span class="text-sm text-gray-700 dark:text-gray-300"
			>Show Bounding Boxes</span>
		</label>
		<div class="mb-3">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Detected Objects ({{ objects.length }})
			</div>
			<div class="flex flex-wrap gap-2">
				<span
					v-for="obj in objects"
					:key="obj.label"
					class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
				>{{ obj.label }} ({{ obj.confidence }}%)</span>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="detect"
		>
			Detect Objects
		</button>
	</div>
</template>
