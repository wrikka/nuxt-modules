<script setup lang="ts">
const isComparing = ref(false);
const sources = ref(["Current", "Previous", "Original"]);
const selected = ref("Previous");
const splitPosition = ref(50);
const mode = ref("split");
const modes = ["split", "onion", "diff"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Compare Versions</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<select v-model="selected" class="w-full p-1 border rounded text-xs mb-2">
			<option v-for="s in sources" :key="s">{{ s }}</option>
		</select>
		<label class="text-xs text-gray-500">Split: {{ splitPosition }}%</label>
		<input
			v-model="splitPosition"
			type="range"
			min="0"
			max="100"
			class="w-full mb-2"
		>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isComparing ? 'bg-blue-600' : 'bg-gray-400',
			]"
			@click="isComparing = !isComparing"
		>
			{{ isComparing ? "✓ Comparing" : "Start Compare" }}
		</button>
	</div>
</template>
