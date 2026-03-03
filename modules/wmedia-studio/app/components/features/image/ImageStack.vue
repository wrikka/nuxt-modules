<script setup lang="ts">
const isStacking = ref(false);
const mode = ref("mean");
const modes = ["mean", "median", "maximum", "minimum"];
const photos = ref(10);
const alignment = ref("auto");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Image Stack</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Photos: {{ photos }}</label>
			<input v-model="photos" type="range" min="2" max="50" class="w-full">
		</div>
		<select v-model="alignment" class="w-full p-1 border rounded text-xs mb-2">
			<option>auto</option>
			<option>manual</option>
		</select>
		<button
			:disabled="isStacking"
			class="w-full py-2 bg-indigo-600 text-white rounded text-sm"
			@click="isStacking = true"
		>
			{{ isStacking ? "Stacking..." : "📚 Stack Images" }}
		</button>
	</div>
</template>
