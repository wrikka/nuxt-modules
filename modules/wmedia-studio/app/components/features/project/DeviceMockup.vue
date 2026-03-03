<script setup lang="ts">
const frames = ["Instagram", "Polaroid", "Phone", "Monitor", "Browser"];
const selected = ref("Phone");
const color = ref("#000000");
const padding = ref(20);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Device Mockup</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="f in frames"
				:key="f"
				:class="[
					'px-2 py-1 rounded text-xs',
					selected === f ? 'bg-gray-800 text-white' : 'bg-gray-100',
				]"
				@click="selected = f"
			>
				{{ f }}
			</button>
		</div>
		<input v-model="color" type="color" class="w-full h-8 rounded mb-2">
		<label class="text-xs text-gray-500">Padding: {{ padding }}px</label>
		<input v-model="padding" type="range" min="0" max="100" class="w-full">
	</div>
</template>
