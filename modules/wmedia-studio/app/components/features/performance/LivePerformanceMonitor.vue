<script setup lang="ts">
const stats = ref({ fps: 60, memory: 245, renderTime: 16, cpu: 35 });
const history = ref(
	Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
);
</script>
<template>
	<div class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
		<h4 class="text-sm font-medium mb-2">Performance</h4>
		<div class="grid grid-cols-2 gap-2 text-xs">
			<div class="p-2 bg-green-100 rounded">{{ stats.fps }} FPS</div>
			<div class="p-2 bg-blue-100 rounded">{{ stats.memory }} MB</div>
			<div class="p-2 bg-yellow-100 rounded">
				{{ stats.renderTime }}ms render
			</div>
			<div class="p-2 bg-purple-100 rounded">{{ stats.cpu }}% CPU</div>
		</div>
		<div class="mt-2 h-8 flex items-end gap-px">
			<div
				v-for="(h, i) in history"
				:key="i"
				class="flex-1 bg-gray-400"
				:style="`height:${h}%`"
			/>
		</div>
	</div>
</template>
