<script setup lang="ts">
const widgets = [
	{
		id: "stats",
		title: "Project Stats",
		icon: "📊",
		color: "blue",
		data: {
			designs: 24,
			hoursSpent: "18.5h",
			exports: 156,
			collaboration: "3 people",
		},
	},
	{
		id: "urgent",
		title: "Urgent Tasks",
		icon: "🔥",
		color: "red",
		data: {
			tasks: [
				{ name: "Review client feedback", due: "Today" },
				{ name: "Export final assets", due: "Tomorrow" },
			],
		},
	},
	{
		id: "activity",
		title: "Recent Activity",
		icon: "📈",
		color: "green",
		data: {
			items: [
				{ action: "Exported", target: "Hero Banner", time: "2h ago" },
				{ action: "Commented", target: "Logo Design", time: "4h ago" },
				{ action: "Edited", target: "Landing Page", time: "6h ago" },
			],
		},
	},
	{
		id: "storage",
		title: "Storage Usage",
		icon: "💾",
		color: "purple",
		data: {
			used: 4.2,
			total: 10,
			unit: "GB",
			breakdown: { images: "2.1GB", videos: "1.5GB", other: "0.6GB" },
		},
	},
] as const;
</script>

<template>
	<div class="p-6">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
			Dashboard Overview
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Stats Widget -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
						<span>{{ widgets[0]!.icon }}</span>
						{{ widgets[0]!.title }}
					</h3>
					<span
						class="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full"
					>This Week</span>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<p class="text-2xl font-bold text-blue-600">
							{{ widgets[0]!.data.designs }}
						</p>
						<p class="text-xs text-gray-500">Designs</p>
					</div>
					<div class="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<p class="text-2xl font-bold text-blue-600">
							{{ widgets[0]!.data.hoursSpent }}
						</p>
						<p class="text-xs text-gray-500">Time</p>
					</div>
					<div class="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<p class="text-2xl font-bold text-blue-600">
							{{ widgets[0]!.data.exports }}
						</p>
						<p class="text-xs text-gray-500">Exports</p>
					</div>
					<div class="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<p class="text-xl font-bold text-blue-600">
							{{ widgets[0]!.data.collaboration }}
						</p>
						<p class="text-xs text-gray-500">Team</p>
					</div>
				</div>
			</div>

			<!-- Urgent Tasks Widget -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
						<span>{{ widgets[1]!.icon }}</span>
						{{ widgets[1]!.title }}
					</h3>
					<span
						class="text-xs text-red-600 bg-red-100 dark:bg-red-900 px-2 py-0.5 rounded-full"
					>2 Pending</span>
				</div>
				<div class="space-y-2">
					<div
						v-for="task in widgets[1]!.data.tasks"
						:key="task.name"
						class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500"
					>
						<p class="text-sm font-medium">{{ task.name }}</p>
						<p class="text-xs text-red-600">Due {{ task.due }}</p>
					</div>
				</div>
			</div>

			<!-- Activity Widget -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
						<span>{{ widgets[2]!.icon }}</span>
						{{ widgets[2]!.title }}
					</h3>
				</div>
				<div class="space-y-3">
					<div
						v-for="item in widgets[2]!.data.items"
						:key="item.target"
						class="flex items-center gap-3 text-sm"
					>
						<div class="w-2 h-2 rounded-full bg-green-500" />
						<div class="flex-1">
							<span class="text-gray-900 dark:text-white">{{
								item.action
							}}</span>
							<span class="text-gray-500">{{ item.target }}</span>
						</div>
						<span class="text-xs text-gray-400">{{ item.time }}</span>
					</div>
				</div>
			</div>

			<!-- Storage Widget -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
						<span>{{ widgets[3]!.icon }}</span>
						{{ widgets[3]!.title }}
					</h3>
					<span
						class="text-xs text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full"
					>42% Used</span>
				</div>

				<!-- Progress Bar -->
				<div class="mb-4">
					<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
							:style="{
								width: `${
									((widgets[3]!.data!).used / (widgets[3]!.data!).total) * 100
								}%`,
							}"
						/>
					</div>
					<p class="text-xs text-gray-500 mt-1">
						{{ widgets[3]!.data.used }} / {{ widgets[3]!.data.total }} {{
							widgets[3]!.data.unit
						}}
					</p>
				</div>

				<!-- Breakdown -->
				<div class="space-y-1 text-xs">
					<div class="flex justify-between">
						<span class="text-gray-500">Images</span>
						<span>{{ (widgets[3]!.data!).breakdown.images }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-500">Videos</span>
						<span>{{ (widgets[3]!.data!).breakdown.videos }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-500">Other</span>
						<span>{{ (widgets[3]!.data!).breakdown.other }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
