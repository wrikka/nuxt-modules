<script setup lang="ts">
const isSlicing = ref(false);
const slices = ref(3);
const direction = ref("horizontal");
const directions = ["horizontal", "vertical", "grid"];
const gap = ref(0);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Slice Tool</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="d in directions"
				:key="d"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					direction === d ? 'bg-red-600 text-white' : 'bg-gray-100',
				]"
				@click="direction = d"
			>
				{{ d }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Slices: {{ slices }}</label>
			<input v-model="slices" type="range" min="2" max="10" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Gap: {{ gap }}px</label>
			<input v-model="gap" type="range" min="0" max="50" class="w-full">
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isSlicing ? 'bg-red-600' : 'bg-gray-400',
			]"
			@click="isSlicing = !isSlicing"
		>
			{{ isSlicing ? "✓ Slicing Active" : "Start Slicing" }}
		</button>
	</div>
</template>
