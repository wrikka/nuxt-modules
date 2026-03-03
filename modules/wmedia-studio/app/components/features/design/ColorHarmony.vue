<script setup lang="ts">
const colors = ref(["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"]);
const harmonies = [
	"Complementary",
	"Triadic",
	"Analogous",
	"Split Comp",
	"Tetradic",
];
const selected = ref("Complementary");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Color Harmony</h4>
		<div class="flex gap-1 mb-2">
			<div
				v-for="c in colors"
				:key="c"
				class="flex-1 h-8 rounded"
				:style="{ backgroundColor: c }"
			/>
		</div>
		<div class="flex flex-wrap gap-1">
			<button
				v-for="h in harmonies"
				:key="h"
				:class="[
					'px-2 py-1 rounded text-xs',
					selected === h ? 'bg-gray-800 text-white' : 'bg-gray-100',
				]"
				@click="selected = h"
			>
				{{ h }}
			</button>
		</div>
	</div>
</template>
