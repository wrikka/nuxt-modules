<script setup lang="ts">
const isMeasuring = ref(false);
const unit = ref("px");
const units = ["px", "in", "cm", "mm", "pt"];
const measurements = ref([
	{ from: [0, 0], to: [100, 100], distance: 141.4, angle: 45 },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Measure Tool</h4>
		<select v-model="unit" class="w-full p-1 border rounded text-xs mb-2">
			<option v-for="u in units" :key="u">{{ u }}</option>
		</select>
		<div class="space-y-1 mb-2">
			<div
				v-for="m in measurements"
				:key="m.distance"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span>D: {{ m.distance.toFixed(1) }}{{ unit }}</span>
				<span>∠: {{ m.angle }}°</span>
			</div>
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isMeasuring ? 'bg-blue-600' : 'bg-gray-400',
			]"
			@click="isMeasuring = !isMeasuring"
		>
			{{ isMeasuring ? "✓ Measuring" : "Start Measure" }}
		</button>
	</div>
</template>
