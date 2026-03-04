<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	compare: [versionA: string, versionB: string];
	restore: [versionId: string];
}>();

const versions = ref([
	{
		id: "v3",
		name: "Current",
		timestamp: "2024-01-15 14:30",
		author: "You",
		thumbnail: "/v3.jpg",
	},
	{
		id: "v2",
		name: "Version 2",
		timestamp: "2024-01-15 12:15",
		author: "You",
		thumbnail: "/v2.jpg",
	},
	{
		id: "v1",
		name: "Version 1",
		timestamp: "2024-01-15 09:00",
		author: "You",
		thumbnail: "/v1.jpg",
	},
]);

const selectedA = ref("v3");
const selectedB = ref("v2");
const isComparing = ref(false);
const splitPosition = ref(50);

const startCompare = () => {
	isComparing.value = true;
	emit("compare", selectedA.value, selectedB.value);
};

const handleRestore = (versionId: string) => {
	emit("restore", versionId);
};
</script>

<template>
	<div class="version-compare-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[600px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:source-branch" class="w-5 h-5 text-blue-500" />
				Version Comparison
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Version Selector -->
		<div v-if="!isComparing" class="mb-4">
			<div class="flex items-center gap-4 mb-4">
				<div class="flex-1">
					<label class="text-gray-500 dark:text-gray-400 text-xs mb-1 block"
					>Version A (Left)</label>
					<select
						v-model="selectedA"
						class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					>
						<option v-for="v in versions" :key="v.id" :value="v.id">
							{{ v.name }}
						</option>
					</select>
				</div>
				<Icon name="mdi:swap-horizontal" class="w-5 h-5 text-gray-400" />
				<div class="flex-1">
					<label class="text-gray-500 dark:text-gray-400 text-xs mb-1 block"
					>Version B (Right)</label>
					<select
						v-model="selectedB"
						class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					>
						<option v-for="v in versions" :key="v.id" :value="v.id">
							{{ v.name }}
						</option>
					</select>
				</div>
			</div>
			<button
				class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="startCompare"
			>
				Start Comparison
			</button>
		</div>

		<!-- Comparison View -->
		<div v-else class="flex-1 flex flex-col">
			<div class="flex items-center justify-between mb-2">
				<div class="text-gray-700 dark:text-gray-300 text-sm">
					{{ versions.find(v => v.id === selectedA)?.name }}
				</div>
				<div class="flex items-center gap-2">
					<button
						class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
						@click="isComparing = false"
					>
						Change Versions
					</button>
				</div>
				<div class="text-gray-700 dark:text-gray-300 text-sm">
					{{ versions.find(v => v.id === selectedB)?.name }}
				</div>
			</div>

			<!-- Split View -->
			<div class="flex-1 relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden mb-4">
				<div class="absolute inset-0 flex">
					<div
						class="h-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden"
						:style="{ width: `${splitPosition}%` }"
					>
						<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
							<span class="text-sm">Version A Preview</span>
						</div>
						<div class="absolute top-2 left-2 px-2 py-1 bg-blue-600 rounded text-xs text-white">
							A
						</div>
					</div>
					<div
						class="h-full bg-gray-300 dark:bg-gray-700 relative overflow-hidden"
						:style="{ width: `${100 - splitPosition}%` }"
					>
						<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
							<span class="text-sm">Version B Preview</span>
						</div>
						<div class="absolute top-2 right-2 px-2 py-1 bg-green-600 rounded text-xs text-white">
							B
						</div>
					</div>
				</div>

				<!-- Split Slider -->
				<input
					v-model="splitPosition"
					type="range"
					min="10"
					max="90"
					class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
				>
				<div
					class="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
					:style="{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }"
				>
					<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-white rounded flex items-center justify-center">
						<Icon name="mdi:chevron-left" class="w-3 h-3 text-gray-800" />
						<Icon name="mdi:chevron-right" class="w-3 h-3 text-gray-800" />
					</div>
				</div>
			</div>

			<!-- Playback Controls -->
			<div class="flex items-center justify-center gap-4 mb-4">
				<button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
					<Icon name="mdi:skip-previous" class="w-5 h-5" />
				</button>
				<button class="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
					<Icon name="mdi:play" class="w-6 h-6" />
				</button>
				<button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
					<Icon name="mdi:skip-next" class="w-5 h-5" />
				</button>
			</div>

			<!-- Actions -->
			<div class="flex gap-2">
				<button
					class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
					@click="handleRestore(selectedB)"
				>
					Restore Version B
				</button>
				<button
					class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
					@click="emit('close')"
				>
					Keep Current
				</button>
			</div>
		</div>

		<!-- Version List -->
		<div v-if="!isComparing" class="flex-1 overflow-y-auto">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2">
				All Versions
			</div>
			<div class="space-y-2">
				<div
					v-for="version in versions"
					:key="version.id"
					class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
				>
					<div class="w-16 h-10 bg-gray-200 dark:bg-gray-600 rounded" />
					<div class="flex-1">
						<div class="text-gray-900 dark:text-white text-sm">
							{{ version.name }}
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							{{ version.timestamp }} by {{ version.author }}
						</div>
					</div>
					<button
						class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
						@click="handleRestore(version.id)"
					>
						Restore
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
