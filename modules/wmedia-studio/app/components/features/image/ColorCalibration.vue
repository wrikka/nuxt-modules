<script setup lang="ts">
const isCalibrating = ref(false);
const profiles = ["sRGB", "Adobe RGB", "DCI-P3", "ProPhoto"];
const selected = ref("sRGB");
const brightness = ref(100);
const contrast = ref(100);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Color Calibration</h4>
		<select v-model="selected" class="w-full p-2 border rounded text-sm mb-2">
			<option v-for="p in profiles" :key="p">{{ p }}</option>
		</select>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Brightness: {{ brightness }}%</label>
			<input
				v-model="brightness"
				type="range"
				min="50"
				max="150"
				class="w-full"
			>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Contrast: {{ contrast }}%</label>
			<input v-model="contrast" type="range" min="50" max="150" class="w-full">
		</div>
		<button
			:disabled="isCalibrating"
			class="w-full py-2 bg-purple-600 text-white rounded text-sm"
			@click="isCalibrating = true"
		>
			{{ isCalibrating ? "Calibrating..." : "Calibrate Display" }}
		</button>
	</div>
</template>
