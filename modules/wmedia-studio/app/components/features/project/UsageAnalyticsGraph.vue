<script setup lang="ts">
const isOpen = ref(false);

// Mock usage data for the last 30 days
const usageData = ref([
	{ day: "Mon", hours: 2.5 },
	{ day: "Tue", hours: 4.0 },
	{ day: "Wed", hours: 1.5 },
	{ day: "Thu", hours: 5.5 },
	{ day: "Fri", hours: 3.0 },
	{ day: "Sat", hours: 6.5 },
	{ day: "Sun", hours: 2.0 },
]);

const featureUsage = ref([
	{ name: "Canvas Editor", percentage: 45, color: "bg-blue-500" },
	{ name: "AI Tools", percentage: 25, color: "bg-purple-500" },
	{ name: "Video Editor", percentage: 15, color: "bg-green-500" },
	{ name: "Export", percentage: 10, color: "bg-yellow-500" },
	{ name: "Collaboration", percentage: 5, color: "bg-pink-500" },
]);

const stats = ref({
	totalHours: 25.0,
	projectsCreated: 12,
	designsExported: 47,
	aiGenerations: 156,
	streak: 7,
});

const maxHours = computed(() => Math.max(...usageData.value.map(d => d.hours)));
</script>

<template>
	<div class="relative">
		<!-- Mini Chart Preview -->
		<div
			class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
			@click="isOpen = true"
		>
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
					<span>📊</span> Usage Analytics
				</h3>
				<span
					class="text-xs text-green-600 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-full"
				>
					{{ stats.streak }} day streak
				</span>
			</div>

			<!-- Mini Bar Chart -->
			<div class="flex items-end gap-1 h-16">
				<div
					v-for="data in usageData.slice(0, 7)"
					:key="data.day"
					class="flex-1 bg-emerald-500/30 rounded-t hover:bg-emerald-500/50 transition-colors"
					:style="{ height: `${(data.hours / maxHours) * 100}%` }"
				/>
			</div>

			<p class="text-xs text-gray-500 mt-2">
				{{ stats.totalHours }}h this week • {{ stats.projectsCreated }} projects
			</p>
		</div>

		<!-- Full Analytics Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[700px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-emerald-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Usage Analytics
							</h3>
						</div>
						<button
							class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
							@click="isOpen = false"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<!-- Content -->
					<div class="p-6 overflow-y-auto max-h-[70vh]">
						<!-- Stats Cards -->
						<div class="grid grid-cols-4 gap-4 mb-6">
							<div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
								<p class="text-2xl font-bold text-emerald-600">
									{{ stats.totalHours }}h
								</p>
								<p class="text-xs text-gray-500">Total Hours</p>
							</div>
							<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
								<p class="text-2xl font-bold text-blue-600">
									{{ stats.projectsCreated }}
								</p>
								<p class="text-xs text-gray-500">Projects</p>
							</div>
							<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
								<p class="text-2xl font-bold text-purple-600">
									{{ stats.aiGenerations }}
								</p>
								<p class="text-xs text-gray-500">AI Uses</p>
							</div>
							<div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
								<p class="text-2xl font-bold text-orange-600">
									{{ stats.streak }}
								</p>
								<p class="text-xs text-gray-500">Day Streak</p>
							</div>
						</div>

						<!-- Weekly Activity Chart -->
						<div class="mb-6">
							<h4 class="font-medium text-gray-900 dark:text-white mb-3">
								Weekly Activity
							</h4>
							<div class="h-40 flex items-end gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
								<div
									v-for="data in usageData"
									:key="data.day"
									class="flex-1 flex flex-col items-center gap-2"
								>
									<div class="text-xs text-gray-500">{{ data.hours }}h</div>
									<div
										class="w-full bg-emerald-500 rounded-t transition-all hover:bg-emerald-400"
										:style="{ height: `${(data.hours / maxHours) * 120}px` }"
									/>
									<div class="text-xs text-gray-600 dark:text-gray-400">
										{{ data.day }}
									</div>
								</div>
							</div>
						</div>

						<!-- Feature Usage Breakdown -->
						<div>
							<h4 class="font-medium text-gray-900 dark:text-white mb-3">
								Feature Usage Breakdown
							</h4>
							<div class="space-y-3">
								<div
									v-for="feature in featureUsage"
									:key="feature.name"
									class="flex items-center gap-3"
								>
									<span class="text-sm w-28">{{ feature.name }}</span>
									<div class="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
										<div
											:class="['h-full rounded-full transition-all', feature.color]"
											:style="{ width: `${feature.percentage}%` }"
										/>
									</div>
									<span class="text-sm text-gray-600 w-12 text-right">{{
											feature.percentage
										}}%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
