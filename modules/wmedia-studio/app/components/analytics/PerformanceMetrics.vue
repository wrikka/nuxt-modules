<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();
const cpuUsage = ref(45);
const memoryUsage = ref(62);
const gpuUsage = ref(78);
const diskUsage = ref(34);
const fps = ref(60);
const renderTime = ref(0.8);
const warnings = ref([{ type: "memory", message: "Memory usage above 80%" }, {
	type: "gpu",
	message: "GPU thermal throttling detected",
}]);
onMounted(() => {
	setInterval(() => {
		cpuUsage.value = 30 + Math.random() * 40;
		memoryUsage.value = 50 + Math.random() * 30;
		gpuUsage.value = 60 + Math.random() * 25;
	}, 2000);
});
</script>
<template>
	<div class="performance-metrics bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-gauge" class="w-5 h-5" />Performance Metrics
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div class="p-3 bg-gray-700/50 rounded-lg">
				<div class="flex items-center justify-between mb-2">
					<span class="text-gray-400 text-xs">CPU</span><span
						class="text-lg font-bold"
						:class="cpuUsage > 80 ? 'text-red-400' : 'text-green-400'"
					>{{ cpuUsage.toFixed(0) }}%</span>
				</div>
				<div class="h-2 bg-gray-600 rounded-full">
					<div
						class="h-full rounded-full transition-all duration-500"
						:class="cpuUsage > 80 ? 'bg-red-500' : 'bg-green-500'"
						:style="{ width: `${cpuUsage}%` }"
					/>
				</div>
			</div>
			<div class="p-3 bg-gray-700/50 rounded-lg">
				<div class="flex items-center justify-between mb-2">
					<span class="text-gray-400 text-xs">Memory</span><span
						class="text-lg font-bold"
						:class="memoryUsage > 80 ? 'text-red-400' : 'text-blue-400'"
					>{{ memoryUsage.toFixed(0) }}%</span>
				</div>
				<div class="h-2 bg-gray-600 rounded-full">
					<div
						class="h-full rounded-full transition-all duration-500"
						:class="memoryUsage > 80 ? 'bg-red-500' : 'bg-blue-500'"
						:style="{ width: `${memoryUsage}%` }"
					/>
				</div>
			</div>
			<div class="p-3 bg-gray-700/50 rounded-lg">
				<div class="flex items-center justify-between mb-2">
					<span class="text-gray-400 text-xs">GPU</span><span
						class="text-lg font-bold"
						:class="gpuUsage > 80 ? 'text-red-400' : 'text-purple-400'"
					>{{ gpuUsage.toFixed(0) }}%</span>
				</div>
				<div class="h-2 bg-gray-600 rounded-full">
					<div
						class="h-full rounded-full transition-all duration-500"
						:class="gpuUsage > 80 ? 'bg-red-500' : 'bg-purple-500'"
						:style="{ width: `${gpuUsage}%` }"
					/>
				</div>
			</div>
			<div class="p-3 bg-gray-700/50 rounded-lg">
				<div class="flex items-center justify-between mb-2">
					<span class="text-gray-400 text-xs">Disk</span><span
						class="text-lg font-bold text-yellow-400"
					>{{ diskUsage.toFixed(0) }}%</span>
				</div>
				<div class="h-2 bg-gray-600 rounded-full">
					<div
						class="h-full bg-yellow-500 rounded-full"
						:style="{ width: `${diskUsage}%` }"
					/>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div class="p-3 bg-gray-700/30 rounded-lg text-center">
				<div class="text-2xl font-bold text-white">{{ fps }}</div>
				<div class="text-gray-400 text-xs">FPS</div>
			</div>
			<div class="p-3 bg-gray-700/30 rounded-lg text-center">
				<div class="text-2xl font-bold text-white">{{ renderTime }}s</div>
				<div class="text-gray-400 text-xs">Frame Time</div>
			</div>
		</div>
		<div v-if="warnings.length > 0" class="space-y-2">
			<div
				v-for="(w, i) in warnings"
				:key="i"
				class="p-2 bg-red-900/30 rounded-lg flex items-center gap-2"
			>
				<Icon name="i-ph-warning" class="w-4 h-4 text-red-400" /><span
					class="text-red-300 text-sm"
				>{{ w.message }}</span>
			</div>
		</div>
	</div>
</template>
