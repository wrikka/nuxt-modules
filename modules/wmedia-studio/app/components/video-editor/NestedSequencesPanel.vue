<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	createNested: [clipIds: string[], name: string];
}>();

const selectedClips = ref<string[]>([]);
const nestedName = ref("Nested Sequence");
const showCreateDialog = ref(false);

const nestedSequences = ref([
	{
		id: "nest-1",
		name: "Opening Titles",
		thumbnail: "/thumbnails/nest-1.jpg",
		duration: 5.5,
		clips: 3,
		expanded: false,
	},
	{
		id: "nest-2",
		name: "Interview Segment",
		thumbnail: "/thumbnails/nest-2.jpg",
		duration: 45.2,
		clips: 8,
		expanded: false,
	},
]);

const clips = ref([
	{ id: "1", name: "Clip 1", duration: 3.2, thumbnail: "/thumb1.jpg" },
	{ id: "2", name: "Clip 2", duration: 5.1, thumbnail: "/thumb2.jpg" },
	{ id: "3", name: "Clip 3", duration: 2.8, thumbnail: "/thumb3.jpg" },
]);

const toggleClip = (clipId: string) => {
	const index = selectedClips.value.indexOf(clipId);
	if (index > -1) {
		selectedClips.value.splice(index, 1);
	} else {
		selectedClips.value.push(clipId);
	}
};

const createNested = () => {
	if (selectedClips.value.length < 2) return;
	showCreateDialog.value = true;
};

const confirmCreate = () => {
	emit("createNested", selectedClips.value, nestedName.value);
	showCreateDialog.value = false;
	selectedClips.value = [];
};

const expandNested = (nestId: string) => {
	const nest = nestedSequences.value.find(n => n.id === nestId);
	if (nest) {
		nest.expanded = !nest.expanded;
	}
};
</script>

<template>
	<div class="nested-sequences-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:layers" class="w-5 h-5 text-blue-500" />
				Nested Sequences
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Create New -->
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Create Nested Sequence
			</div>
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-3">
				Select 2+ clips to pre-compose into a nested sequence
			</div>

			<div class="space-y-1 mb-3">
				<div
					v-for="clip in clips"
					:key="clip.id"
					class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors"
					:class="selectedClips.includes(clip.id)
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700'"
					@click="toggleClip(clip.id)"
				>
					<input
						type="checkbox"
						:checked="selectedClips.includes(clip.id)"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
					>
					<img
						:src="clip.thumbnail"
						class="w-8 h-6 object-cover rounded"
						:alt="clip.name"
					>
					<span class="text-gray-900 dark:text-white text-sm">{{
						clip.name
					}}</span>
					<span class="text-gray-500 dark:text-gray-400 text-xs ml-auto">{{
							clip.duration
						}}s</span>
				</div>
			</div>

			<button
				class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				:disabled="selectedClips.length < 2"
				@click="createNested"
			>
				<Icon name="mdi:layers-plus" class="w-4 h-4" />
				Create from {{ selectedClips.length }} clip{{
					selectedClips.length !== 1 ? "s" : ""
				}}
			</button>
		</div>

		<!-- Existing Nested Sequences -->
		<div class="flex-1 overflow-y-auto">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Existing Nested Sequences ({{ nestedSequences.length }})
			</div>
			<div class="space-y-2">
				<div
					v-for="nest in nestedSequences"
					:key="nest.id"
					class="bg-gray-50 dark:bg-gray-700/30 rounded-lg overflow-hidden"
				>
					<div
						class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						@click="expandNested(nest.id)"
					>
						<img
							:src="nest.thumbnail"
							class="w-12 h-8 object-cover rounded"
							:alt="nest.name"
						>
						<div class="flex-1">
							<div class="text-gray-900 dark:text-white text-sm font-medium">
								{{ nest.name }}
							</div>
							<div class="text-gray-500 dark:text-gray-400 text-xs">
								{{ nest.clips }} clips • {{ nest.duration }}s
							</div>
						</div>
						<Icon
							:name="nest.expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
							class="w-4 h-4 text-gray-500 dark:text-gray-400"
						/>
					</div>

					<!-- Expanded Content -->
					<div v-if="nest.expanded" class="px-3 pb-3">
						<div class="pl-14 space-y-1">
							<div class="flex items-center gap-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
								<Icon name="mdi:film" class="w-3 h-3" />
								<span>Clip 1 • 2.1s</span>
							</div>
							<div class="flex items-center gap-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
								<Icon name="mdi:film" class="w-3 h-3" />
								<span>Clip 2 • 1.8s</span>
							</div>
							<div class="flex items-center gap-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
								<Icon name="mdi:film" class="w-3 h-3" />
								<span>Clip 3 • 1.6s</span>
							</div>
						</div>
						<div class="mt-2 pl-14 flex gap-2">
							<button class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded transition-colors">
								Edit Nested
							</button>
							<button class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded transition-colors">
								Break Apart
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Create Dialog -->
		<div
			v-if="showCreateDialog"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 w-80 shadow-lg border border-gray-200 dark:border-gray-700">
				<h4 class="text-gray-900 dark:text-white font-medium mb-3">
					Create Nested Sequence
				</h4>
				<input
					v-model="nestedName"
					type="text"
					placeholder="Sequence name"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg mb-4 border-0"
				>
				<div class="flex gap-2">
					<button
						class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm"
						@click="showCreateDialog = false"
					>
						Cancel
					</button>
					<button
						class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
						@click="confirmCreate"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
