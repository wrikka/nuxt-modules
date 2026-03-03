<script setup lang="ts">
const optimizations = ref([
	{ name: "WebP Conversion", enabled: true, saved: "45%", status: "active" },
	{ name: "AVIF Support", enabled: true, saved: "62%", status: "active" },
	{ name: "Responsive Images", enabled: true, saved: "30%", status: "active" },
	{ name: "Lazy Loading", enabled: false, saved: "0%", status: "inactive" },
	{ name: "CDN Edge Caching", enabled: true, saved: "80%", status: "active" },
]);

const stats = ref({
	totalAssets: 1247,
	optimizedAssets: 1189,
	bandwidthSaved: "2.4 GB",
	loadTimeImprovement: "65%",
});

const toggleOptimization = (opt: any) => {
	opt.enabled = !opt.enabled;
	opt.status = opt.enabled ? "active" : "inactive";
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Asset Optimization
			</h3>
			<span
				class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded"
			>CDN Active</span>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 gap-3 mb-6">
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
				<p class="text-2xl font-bold text-blue-500">
					{{ stats.optimizedAssets }}/{{ stats.totalAssets }}
				</p>
				<p class="text-xs text-gray-500">Assets Optimized</p>
			</div>
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
				<p class="text-2xl font-bold text-green-500">
					{{ stats.bandwidthSaved }}
				</p>
				<p class="text-xs text-gray-500">Bandwidth Saved</p>
			</div>
		</div>

		<!-- Optimization Toggles -->
		<div class="space-y-3">
			<div
				v-for="opt in optimizations"
				:key="opt.name"
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<div class="flex items-center gap-3">
					<div
						:class="opt.enabled ? 'bg-green-500' : 'bg-gray-300'"
						class="w-2 h-2 rounded-full"
					/>
					<div>
						<p class="font-medium text-sm">{{ opt.name }}</p>
						<p class="text-xs text-gray-500">Saved {{ opt.saved }} file size</p>
					</div>
				</div>
				<button
					@click="toggleOptimization(opt)"
					:class="opt.enabled ? 'bg-blue-500' : 'bg-gray-300'"
					class="w-12 h-6 rounded-full relative transition-colors"
				>
					<span
						:class="opt.enabled ? 'translate-x-6' : 'translate-x-1'"
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
					/>
				</button>
			</div>
		</div>
	</div>
</template>
