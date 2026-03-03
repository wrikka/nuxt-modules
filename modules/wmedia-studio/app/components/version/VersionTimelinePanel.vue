<script setup lang="ts">
import type { VersionSnapshot } from "#shared/types";

interface Props {
	isOpen: boolean;
	projectId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	restore: [version: VersionSnapshot];
}>();

const versions = ref<VersionSnapshot[]>([
	{
		id: "current",
		name: "Current Version",
		timestamp: new Date(),
		author: { name: "You", avatar: "" },
		thumbnail: "",
		changes: ["Working version"],
		isCurrent: true,
	},
	{
		id: "v-1",
		name: "Version 1.2",
		timestamp: new Date(Date.now() - 3600000),
		author: { name: "You", avatar: "" },
		thumbnail: "",
		changes: ["Added hero section", "Fixed spacing issues"],
	},
	{
		id: "v-2",
		name: "Version 1.1",
		timestamp: new Date(Date.now() - 7200000),
		author: { name: "Jane", avatar: "" },
		thumbnail: "",
		changes: ["Updated color palette", "Added navigation"],
	},
	{
		id: "v-3",
		name: "Version 1.0",
		timestamp: new Date(Date.now() - 86400000),
		author: { name: "Jane", avatar: "" },
		thumbnail: "",
		changes: ["Initial design", "Basic layout structure"],
	},
]);

const formatTime = (date: Date) => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();

	if (diff < 60000) return "Just now";
	if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const isExpanded = ref<string[]>(["current"]);

const toggleExpand = (id: string) => {
	if (isExpanded.value.includes(id)) {
		isExpanded.value = isExpanded.value.filter(i => i !== id);
	} else {
		isExpanded.value.push(id);
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed bottom-0 left-0 right-0 h-64 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex"
	>
		<!-- Sidebar -->
		<div class="w-64 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
					<Icon name="mdi:history" class="w-5 h-5 text-blue-500" />
					Version History
				</h3>
				<button
					class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-4 h-4 text-gray-500" />
				</button>
			</div>

			<div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
				<p>{{ versions.length }} versions saved</p>
				<p class="text-xs text-gray-400 mt-1">Auto-saved every 5 minutes</p>
			</div>

			<button class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
				<Icon name="mdi:content-save" class="w-4 h-4" />
				Save New Version
			</button>
		</div>

		<!-- Timeline -->
		<div class="flex-1 overflow-x-auto overflow-y-hidden">
			<div class="flex items-start gap-6 p-6 h-full">
				<div
					v-for="(version, index) in versions"
					:key="version.id"
					class="flex-shrink-0 w-48 group"
				>
					<!-- Connector Line -->
					<div
						v-if="index > 0"
						class="absolute -left-6 top-8 w-6 h-0.5 bg-gray-300 dark:bg-gray-600"
					/>

					<!-- Card -->
					<div
						:class="[
							'relative bg-gray-50 dark:bg-gray-800 border-2 rounded-xl overflow-hidden cursor-pointer transition-all',
							version.isCurrent
								? 'border-blue-500 shadow-lg shadow-blue-500/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500',
						]"
						@click="toggleExpand(version.id)"
					>
						<!-- Thumbnail -->
						<div class="h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
							<Icon
								v-if="version.isCurrent"
								name="mdi:check-circle"
								class="w-8 h-8 text-blue-500"
							/>
							<Icon v-else name="mdi:image" class="w-8 h-8 text-gray-400" />
						</div>

						<!-- Info -->
						<div class="p-3">
							<div class="flex items-center justify-between mb-1">
								<span
									class="font-medium text-sm text-gray-900 dark:text-white truncate"
								>{{ version.name }}</span>
								<span
									v-if="version.isCurrent"
									class="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded"
								>
									CURRENT
								</span>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								{{ formatTime(version.timestamp) }}
							</p>
							<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
								by {{ version.author.name }}
							</p>
						</div>

						<!-- Expanded Details -->
						<div
							v-if="isExpanded.includes(version.id)"
							class="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-100 dark:bg-gray-900/50"
						>
							<p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
								Changes:
							</p>
							<ul class="space-y-1">
								<li
									v-for="change in version.changes"
									:key="change"
									class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
								>
									<Icon name="mdi:check" class="w-3 h-3 text-green-500" />
									{{ change }}
								</li>
							</ul>

							<div v-if="!version.isCurrent" class="flex gap-2 mt-3">
								<button
									class="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
									@click.stop="emit('restore', version)"
								>
									Restore
								</button>
								<button class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs transition-colors">
									<Icon name="mdi:download" class="w-3 h-3" />
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Add New -->
				<div class="flex-shrink-0 w-48">
					<div class="h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
						<Icon name="mdi:plus" class="w-8 h-8 text-gray-400" />
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
							Save Version
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
