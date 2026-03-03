<script setup lang="ts">
const gridTypes = [
	"Rule of Thirds",
	"Golden Ratio",
	"Diagonal",
	"Triangle",
	"Grid",
];
const selected = ref("Rule of Thirds");
const opacity = ref(30);
const color = ref("#FFFFFF");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Composition Grid</h4>
		<div class="space-y-1 mb-2">
			<button
				v-for="g in gridTypes"
				:key="g"
				:class="[
					'w-full py-1 rounded text-xs text-left px-2',
					selected === g ? 'bg-purple-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = g"
			>
				{{ g }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Opacity: {{ opacity }}%</label>
		<input v-model="opacity" type="range" min="0" max="100" class="w-full">
	</div>
</template>
