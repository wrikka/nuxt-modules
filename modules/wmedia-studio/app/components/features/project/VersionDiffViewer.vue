<script setup lang="ts">
interface Version {
	id: string;
	number: number;
	date: string;
	author: string;
	message: string;
	changes: string[];
}

const versions = ref<Version[]>([
	{
		id: "v3",
		number: 3,
		date: "2 hours ago",
		author: "Alice Chen",
		message: "Final color adjustments",
		changes: ["Updated brand colors", "Fixed contrast issues"],
	},
	{
		id: "v2",
		number: 2,
		date: "5 hours ago",
		author: "Bob Smith",
		message: "Added hero section",
		changes: ["New hero image", "CTA button styling"],
	},
	{
		id: "v1",
		number: 1,
		date: "1 day ago",
		author: "Alice Chen",
		message: "Initial design",
		changes: ["Project setup", "Base layout"],
	},
]);

const selectedVersions = ref<string[]>(["v3", "v2"]);
const diffMode = ref<"split" | "overlay">("split");

const toggleVersion = (id: string) => {
	if (selectedVersions.value.includes(id)) {
		selectedVersions.value = selectedVersions.value.filter(v => v !== id);
	} else if (selectedVersions.value.length < 2) {
		selectedVersions.value.push(id);
	}
};

const restoreVersion = (version: Version) => {
	console.log("Restoring:", version.id);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Version Diff Viewer
			</h3>
			<div class="flex gap-2">
				<button
					@click="diffMode = 'split'"
					:class="{ 'bg-blue-500 text-white': diffMode === 'split' }"
					class="px-2 py-1 rounded text-sm bg-gray-100"
				>
					Split
				</button>
				<button
					@click="diffMode = 'overlay'"
					:class="{ 'bg-blue-500 text-white': diffMode === 'overlay' }"
					class="px-2 py-1 rounded text-sm bg-gray-100"
				>
					Overlay
				</button>
			</div>
		</div>

		<!-- Version Selector -->
		<div class="flex gap-4 mb-4">
			<div class="flex-1">
				<p class="text-xs text-gray-500 mb-1">Old Version</p>
				<select class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm">
					<option v-for="v in versions" :key="v.id">
						v{{ v.number }} - {{ v.message }}
					</option>
				</select>
			</div>
			<div class="flex items-end">
				<Icon name="mdi:arrow-right" class="w-5 h-5 text-gray-400" />
			</div>
			<div class="flex-1">
				<p class="text-xs text-gray-500 mb-1">New Version</p>
				<select class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm">
					<option v-for="v in versions" :key="v.id">
						v{{ v.number }} - {{ v.message }}
					</option>
				</select>
			</div>
		</div>

		<!-- Diff Preview -->
		<div class="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 flex">
			<div class="flex-1 border-r border-gray-300 dark:border-gray-700 flex items-center justify-center">
				<div class="text-center">
					<p class="text-gray-500">Version 2</p>
					<p class="text-xs text-gray-400">5 hours ago</p>
				</div>
			</div>
			<div class="flex-1 flex items-center justify-center">
				<div class="text-center">
					<p class="text-gray-500">Version 3 (Current)</p>
					<p class="text-xs text-gray-400">2 hours ago</p>
				</div>
			</div>
		</div>

		<!-- Change List -->
		<div class="space-y-2">
			<p class="text-sm font-medium">Changes in this version:</p>
			<div
				v-for="v in versions.slice(0, 1)"
				:key="v.id"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<div class="flex items-center gap-2 mb-2">
					<span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded"
					>+3</span>
					<span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded"
					>-1</span>
					<span class="text-sm font-medium">{{ v.message }}</span>
				</div>
				<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
					<li
						v-for="change in v.changes"
						:key="change"
						class="flex items-center gap-2"
					>
						<Icon name="mdi:check" class="w-4 h-4 text-green-500" />
						{{ change }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
