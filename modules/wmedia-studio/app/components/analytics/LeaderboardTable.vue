<script setup lang="ts">
import type { ProjectStats } from "#shared/types/analytics";

interface Props {
	projects: ProjectStats[];
	title?: string;
	limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Top Performing Projects",
	limit: 10,
});

const sortBy = ref<"views" | "edits" | "exports">("views");
const sortOrder = ref<"desc" | "asc">("desc");

const sortedProjects = computed(() => {
	const sorted = [...props.projects].sort((a, b) => {
		const multiplier = sortOrder.value === "desc" ? -1 : 1;
		return (a[sortBy.value] - b[sortBy.value]) * multiplier;
	});
	return sorted.slice(0, props.limit);
});

const totalViews = computed(() =>
	props.projects.reduce((sum, p) => sum + p.views, 0)
);
const totalEdits = computed(() =>
	props.projects.reduce((sum, p) => sum + p.edits, 0)
);
const totalExports = computed(() =>
	props.projects.reduce((sum, p) => sum + p.exports, 0)
);

function formatDate(date: Date): string {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{{ title }}
			</h3>
			<div class="flex gap-2">
				<select
					v-model="sortBy"
					class="text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1"
				>
					<option value="views">Views</option>
					<option value="edits">Edits</option>
					<option value="exports">Exports</option>
				</select>
				<button
					class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
					@click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
				>
					<i
						:class="sortOrder === 'desc' ? 'i-mdi-arrow-down' : 'i-mdi-arrow-up'"
						class="text-gray-600 dark:text-gray-400"
					/>
				</button>
			</div>
		</div>

		<!-- Summary stats -->
		<div class="grid grid-cols-3 gap-4 mb-6">
			<div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<div class="text-xl font-bold text-blue-600 dark:text-blue-400">
					{{ totalViews }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Total Views</div>
			</div>
			<div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<div class="text-xl font-bold text-green-600 dark:text-green-400">
					{{ totalEdits }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Total Edits</div>
			</div>
			<div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
				<div class="text-xl font-bold text-purple-600 dark:text-purple-400">
					{{ totalExports }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					Total Exports
				</div>
			</div>
		</div>

		<!-- Projects table -->
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Project
						</th>
						<th class="text-center py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Type
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							<span class="cursor-pointer" @click="sortBy = 'views'"
							>Views</span>
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							<span class="cursor-pointer" @click="sortBy = 'edits'"
							>Edits</span>
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							<span class="cursor-pointer" @click="sortBy = 'exports'"
							>Exports</span>
						</th>
						<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
							Last Modified
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(project, index) in sortedProjects"
						:key="project.id"
						class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
					>
						<td class="py-2 px-3">
							<div class="flex items-center gap-2">
								<span
									class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400"
								>
									{{ index + 1 }}
								</span>
								<span
									class="font-medium text-gray-900 dark:text-white truncate max-w-[150px]"
								>{{ project.name }}</span>
							</div>
						</td>
						<td class="py-2 px-3 text-center">
							<span
								class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 capitalize"
							>
								{{ project.type }}
							</span>
						</td>
						<td class="py-2 px-3 text-right font-medium text-gray-900 dark:text-white">
							{{ project.views }}
						</td>
						<td class="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
							{{ project.edits }}
						</td>
						<td class="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
							{{ project.exports }}
						</td>
						<td class="py-2 px-3 text-right text-gray-500 dark:text-gray-400 text-xs">
							{{ formatDate(project.lastModified) }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div
			v-if="projects.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-folder-open text-3xl mb-2" />
			<p>No projects found</p>
		</div>
	</div>
</template>
