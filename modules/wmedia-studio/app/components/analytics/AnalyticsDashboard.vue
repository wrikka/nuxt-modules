<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();
const timeRange = ref("7d");
const metrics = ref({ projects: 12, exports: 47, hours: 25, aiUses: 156 });
const chartData = ref([
	{ day: "Mon", value: 4 },
	{ day: "Tue", value: 6 },
	{ day: "Wed", value: 3 },
	{ day: "Thu", value: 8 },
	{ day: "Fri", value: 5 },
	{ day: "Sat", value: 7 },
	{ day: "Sun", value: 2 },
]);
const maxValue = computed(() => Math.max(...chartData.value.map(d => d.value)));
</script>
<template>
	<div class="analytics-dashboard bg-gray-800 rounded-lg p-4 w-[600px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-chart-bar" class="w-5 h-5" />Analytics Dashboard
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<button
				v-for='r in ["24h", "7d", "30d", "90d"]'
				:key="r"
				class="px-3 py-1 rounded-lg text-sm"
				:class="timeRange === r
				? 'bg-blue-600 text-white'
				: 'bg-gray-700 text-gray-300'"
				@click="timeRange = r"
			>
				{{ r }}
			</button>
		</div>
		<div class="grid grid-cols-4 gap-3 mb-4">
			<div class="p-3 bg-blue-900/30 rounded-lg text-center">
				<div class="text-2xl font-bold text-blue-400">
					{{ metrics.projects }}
				</div>
				<div class="text-gray-400 text-xs">Projects</div>
			</div>
			<div class="p-3 bg-green-900/30 rounded-lg text-center">
				<div class="text-2xl font-bold text-green-400">
					{{ metrics.exports }}
				</div>
				<div class="text-gray-400 text-xs">Exports</div>
			</div>
			<div class="p-3 bg-purple-900/30 rounded-lg text-center">
				<div class="text-2xl font-bold text-purple-400">
					{{ metrics.hours }}
				</div>
				<div class="text-gray-400 text-xs">Hours</div>
			</div>
			<div class="p-3 bg-yellow-900/30 rounded-lg text-center">
				<div class="text-2xl font-bold text-yellow-400">
					{{ metrics.aiUses }}
				</div>
				<div class="text-gray-400 text-xs">AI Uses</div>
			</div>
		</div>
		<div class="flex-1 bg-gray-700/30 rounded-lg p-4 mb-4">
			<div class="text-gray-300 text-sm mb-3">Activity Overview</div>
			<div class="h-32 flex items-end gap-2">
				<div
					v-for="d in chartData"
					:key="d.day"
					class="flex-1 flex flex-col items-center gap-1"
				>
					<div
						class="w-full bg-blue-500 rounded-t transition-all"
						:style="{ height: `${(d.value / maxValue) * 100}px` }"
					/>
					<div class="text-gray-500 text-xs">{{ d.day }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
