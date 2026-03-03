<script setup lang="ts">
const isCropping = ref(false);
const ratio = ref("free");
const ratios = ["free", "1:1", "4:3", "16:9", "3:2", "9:16"];
const flipH = ref(false);
const flipV = ref(false);
const rotate = ref(0);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Crop & Transform</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="r in ratios"
				:key="r"
				:class="[
					'px-2 py-1 rounded text-xs',
					ratio === r ? 'bg-orange-600 text-white' : 'bg-gray-100',
				]"
				@click="ratio = r"
			>
				{{ r }}
			</button>
		</div>
		<div class="flex gap-2 mb-2">
			<button
				:class="[
					'flex-1 py-1 rounded text-xs',
					flipH ? 'bg-orange-200' : 'bg-gray-100',
				]"
				@click="flipH = !flipH"
			>
				↔ Flip H
			</button>
			<button
				:class="[
					'flex-1 py-1 rounded text-xs',
					flipV ? 'bg-orange-200' : 'bg-gray-100',
				]"
				@click="flipV = !flipV"
			>
				↕ Flip V
			</button>
		</div>
		<label class="text-xs text-gray-500">Rotate: {{ rotate }}°</label>
		<input
			v-model="rotate"
			type="range"
			min="-180"
			max="180"
			step="90"
			class="w-full"
		>
	</div>
</template>
