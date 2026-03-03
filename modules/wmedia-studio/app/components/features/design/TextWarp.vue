<script setup lang="ts">
const isWarping = ref(false);
const type = ref("arc");
const types = ["arc", "arch", "bulge", "flag", "wave", "fish"];
const bend = ref(50);
const horizontal = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Text Warp</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="t in types"
				:key="t"
				:class="[
					'px-2 py-1 rounded text-xs capitalize',
					type === t ? 'bg-purple-600 text-white' : 'bg-gray-100',
				]"
				@click="type = t"
			>
				{{ t }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Bend: {{ bend }}%</label>
			<input v-model="bend" type="range" min="-100" max="100" class="w-full">
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="horizontal" type="checkbox"> Horizontal
		</label>
		<button
			:disabled="isWarping"
			class="w-full py-2 bg-purple-600 text-white rounded text-sm"
			@click="isWarping = true"
		>
			{{ isWarping ? "Applying..." : "Apply Warp" }}
		</button>
	</div>
</template>
