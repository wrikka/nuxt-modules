<script setup lang="ts">
const presets = [
	{ name: "80s Synth", filter: "hue-rotate(180deg) saturate(200%)" },
	{ name: "Noir", filter: "grayscale(100%) contrast(150%)" },
	{ name: "Vintage", filter: "sepia(50%) contrast(120%)" },
	{ name: "Cyberpunk", filter: "hue-rotate(300deg) saturate(180%)" },
];
const selected = ref("Noir");
const customFilter = ref("");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Filter Presets</h4>
		<div class="grid grid-cols-2 gap-2 mb-2">
			<button
				v-for="p in presets"
				:key="p.name"
				:class="[
					'h-16 rounded text-xs font-medium',
					selected === p.name ? 'ring-2 ring-blue-500' : '',
				]"
				:style="{ filter: p.filter, background: '#ddd' }"
				@click="selected = p.name"
			>
				{{ p.name }}
			</button>
		</div>
		<input
			v-model="customFilter"
			placeholder="Custom CSS filter..."
			class="w-full p-2 border rounded text-xs"
		>
	</div>
</template>
