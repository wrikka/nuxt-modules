<script setup lang="ts">
const isMerging = ref(false);
const layers = ref([
	{ id: 1, name: "Background", visible: true, opacity: 100 },
	{ id: 2, name: "Subject", visible: true, opacity: 80 },
	{ id: 3, name: "Effects", visible: false, opacity: 100 },
]);
const mergeMode = ref("flatten");
const modes = ["flatten", "merge-down", "merge-visible", "stamp-visible"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Layer Merger</h4>
		<div class="space-y-1 mb-2">
			<div
				v-for="l in layers"
				:key="l.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span>{{ l.name }}</span>
				<div class="flex items-center gap-2">
					<input
						v-model="l.opacity"
						type="range"
						min="0"
						max="100"
						class="w-16"
					>
					<span class="w-8 text-right">{{ l.opacity }}%</span>
				</div>
			</div>
		</div>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-[10px] capitalize',
					mergeMode === m ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="mergeMode = m"
			>
				{{ m.replace("-", " ") }}
			</button>
		</div>
		<button
			:disabled="isMerging"
			class="w-full py-2 bg-blue-600 text-white rounded text-sm"
			@click="isMerging = true"
		>
			{{ isMerging ? "Merging..." : "⬇️ Merge Layers" }}
		</button>
	</div>
</template>
