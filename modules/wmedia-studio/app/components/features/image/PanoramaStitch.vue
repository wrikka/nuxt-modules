<script setup lang="ts">
const isPanorama = ref(false);
const mode = ref("auto");
const modes = ["auto", "cylindrical", "spherical", "perspective"];
const photos = ref(5);
const boundaryWarp = ref(50);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Panorama Stitch</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-green-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Photos: {{ photos }}</label>
			<input v-model="photos" type="range" min="2" max="20" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500"
			>Boundary Warp: {{ boundaryWarp }}%</label>
			<input
				v-model="boundaryWarp"
				type="range"
				min="0"
				max="100"
				class="w-full"
			>
		</div>
		<button
			:disabled="isPanorama"
			class="w-full py-2 bg-green-600 text-white rounded text-sm"
			@click="isPanorama = true"
		>
			{{ isPanorama ? "Stitching..." : "📷 Create Panorama" }}
		</button>
	</div>
</template>
