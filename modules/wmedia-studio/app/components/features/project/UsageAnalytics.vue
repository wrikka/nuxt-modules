<script setup lang="ts">
const timeRange = ref<"7d" | "30d" | "90d">("30d");
const stats = ref({
	activeUsers: 42,
	totalProjects: 156,
	avgSessionTime: "24m",
	popularFeature: "AI Background",
});
const usageData = ref([
	{ day: "Mon", hours: 2.5, users: 12 },
	{ day: "Tue", hours: 4.0, users: 18 },
	{ day: "Wed", hours: 1.5, users: 8 },
	{ day: "Thu", hours: 5.5, users: 22 },
	{ day: "Fri", hours: 3.0, users: 15 },
	{ day: "Sat", hours: 6.5, users: 28 },
	{ day: "Sun", hours: 2.0, users: 10 },
]);
const topAssets = ref([
	{ name: "logo-main.png", uses: 45, type: "image" },
	{ name: "brand-colors.json", uses: 32, type: "config" },
	{ name: "hero-bg.jpg", uses: 28, type: "image" },
]);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Usage Analytics
			</h3>
			<div class="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
				<button
					v-for='r in ["7d", "30d", "90d"] as const'
					:key="r"
					@click="timeRange = r"
					:class="{ 'bg-white dark:bg-gray-600 shadow': timeRange === r }"
					class="px-3 py-1 rounded text-sm"
				>
					{{ r }}
				</button>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 gap-3 mb-6">
			<div
				v-for="(val, key) in stats"
				:key="key"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<p class="text-xs text-gray-500 capitalize">
					{{ key.replace(/([A-Z])/g, " $1").trim() }}
				</p>
				<p class="text-xl font-bold">{{ val }}</p>
			</div>
		</div>

		<!-- Chart -->
		<div class="mb-6">
			<p class="text-sm font-medium mb-3">Daily Usage (Hours)</p>
			<div class="flex items-end gap-2 h-32">
				<div
					v-for="d in usageData"
					:key="d.day"
					class="flex-1 flex flex-col items-center gap-1"
				>
					<div
						class="w-full bg-blue-500 rounded-t"
						:style="{ height: `${(d.hours / 7) * 100}px` }"
					/>
					<span class="text-xs text-gray-500">{{ d.day }}</span>
				</div>
			</div>
		</div>

		<!-- Top Assets -->
		<div>
			<p class="text-sm font-medium mb-2">Most Used Assets</p>
			<div class="space-y-2">
				<div
					v-for="asset in topAssets"
					:key="asset.name"
					class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
				>
					<div class="flex items-center gap-2">
						<Icon
							:name="asset.type === 'image' ? 'mdi:image' : 'mdi:code-json'"
							class="w-4 h-4 text-gray-400"
						/>
						<span class="text-sm">{{ asset.name }}</span>
					</div>
					<span class="text-xs text-blue-500">{{ asset.uses }} uses</span>
				</div>
			</div>
		</div>
	</div>
</template>
