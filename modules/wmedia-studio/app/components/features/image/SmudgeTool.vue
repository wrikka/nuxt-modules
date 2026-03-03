<script setup lang="ts">
const isSmudging = ref(false);
const strength = ref(50);
const fingerLength = ref(30);
const mode = ref("push");
const modes = ["push", "pull", "twirl", "sculpt"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Smudge Tool</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'px-2 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Strength: {{ strength }}%</label>
			<input v-model="strength" type="range" min="0" max="100" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500"
			>Finger Length: {{ fingerLength }}px</label>
			<input
				v-model="fingerLength"
				type="range"
				min="5"
				max="100"
				class="w-full"
			>
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isSmudging ? 'bg-indigo-600' : 'bg-gray-400',
			]"
			@click="isSmudging = !isSmudging"
		>
			{{ isSmudging ? "✓ Smudging" : "Activate Smudge" }}
		</button>
	</div>
</template>
