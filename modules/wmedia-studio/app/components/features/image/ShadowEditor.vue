<script setup lang="ts">
const shadows = ref([
	{ x: 2, y: 2, blur: 4, spread: 0, color: "#00000040" },
]);
const presets = ["None", "Small", "Medium", "Large", "Inner"];
const selected = ref("Medium");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Shadow Editor</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="p in presets"
				:key="p"
				:class="[
					'px-2 py-1 rounded text-xs',
					selected === p ? 'bg-gray-800 text-white' : 'bg-gray-100',
				]"
				@click="selected = p"
			>
				{{ p }}
			</button>
		</div>
		<div class="space-y-1 text-xs">
			<div class="flex justify-between">
				<span>X</span><input
					v-model="shadows[0]?.x"
					type="number"
					class="w-12 border rounded px-1"
				>
			</div>
			<div class="flex justify-between">
				<span>Y</span><input
					v-model="shadows[0]?.y"
					type="number"
					class="w-12 border rounded px-1"
				>
			</div>
			<div class="flex justify-between">
				<span>Blur</span><input
					v-model="shadows[0]?.blur"
					type="number"
					class="w-12 border rounded px-1"
				>
			</div>
		</div>
	</div>
</template>
