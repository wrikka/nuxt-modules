<script setup lang="ts">
const isSplitting = ref(false);
const stems = ref(["Vocals", "Drums", "Bass", "Other"]);
const selectedStems = ref(["Vocals", "Drums"]);
const quality = ref("high");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Stem Splitter</h4>
		<div class="space-y-1 mb-2">
			<label
				v-for="stem in stems"
				:key="stem"
				class="flex items-center gap-2 text-xs p-1 hover:bg-gray-50 rounded"
			>
				<input v-model="selectedStems" type="checkbox" :value="stem"> {{ stem }}
			</label>
		</div>
		<select v-model="quality" class="w-full p-1 border rounded text-xs mb-2">
			<option value="fast">Fast</option>
			<option value="high">High Quality</option>
			<option value="maximum">Maximum</option>
		</select>
		<button
			:disabled="isSplitting"
			class="w-full py-2 bg-indigo-600 text-white rounded text-sm"
			@click="isSplitting = true"
		>
			{{ isSplitting ? "Splitting..." : "Split Stems" }}
		</button>
	</div>
</template>
