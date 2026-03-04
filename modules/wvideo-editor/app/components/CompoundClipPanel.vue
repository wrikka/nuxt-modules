<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	createCompound: [clips: string[]];
	explode: [compoundId: string];
	edit: [compoundId: string];
}>();

interface CompoundClip {
	id: string;
	name: string;
	thumbnail?: string;
	clips: string[];
	duration: number;
	createdAt: Date;
	isOpen: boolean;
}

const compoundClips = ref<CompoundClip[]>([
	{
		id: "compound-1",
		name: "Intro Sequence",
		clips: ["clip-1", "clip-2", "clip-3"],
		duration: 5.5,
		createdAt: new Date("2024-01-15"),
		isOpen: false,
	},
	{
		id: "compound-2",
		name: "Logo Animation",
		clips: ["clip-4", "clip-5"],
		duration: 2.0,
		createdAt: new Date("2024-01-16"),
		isOpen: false,
	},
]);

const selectedClipIds = ref<string[]>([]);
const selectedCompoundId = ref<string | null>(null);
const newCompoundName = ref("");
const showCreateDialog = ref(false);
const viewMode = ref<"grid" | "list">("grid");

const selectedCompound = computed(() =>
	compoundClips.value.find(c => c.id === selectedCompoundId.value)
);

const createCompound = () => {
	if (selectedClipIds.value.length < 2 || !newCompoundName.value.trim()) return;

	const newCompound: CompoundClip = {
		id: `compound-${Date.now()}`,
		name: newCompoundName.value.trim(),
		clips: [...selectedClipIds.value],
		duration: 0,
		createdAt: new Date(),
		isOpen: false,
	};
	compoundClips.value.push(newCompound);
	selectedClipIds.value = [];
	newCompoundName.value = "";
	showCreateDialog.value = false;
};

const deleteCompound = (id: string) => {
	const index = compoundClips.value.findIndex(c => c.id === id);
	if (index !== -1) {
		compoundClips.value.splice(index, 1);
		if (selectedCompoundId.value === id) {
			selectedCompoundId.value = null;
		}
	}
};

const duplicateCompound = (id: string) => {
	const compound = compoundClips.value.find(c => c.id === id);
	if (compound) {
		const newCompound: CompoundClip = {
			...compound,
			id: `compound-${Date.now()}`,
			name: `${compound.name} (Copy)`,
			createdAt: new Date(),
			isOpen: false,
		};
		compoundClips.value.push(newCompound);
	}
};

const renameCompound = (id: string, newName: string) => {
	const compound = compoundClips.value.find(c => c.id === id);
	if (compound && newName.trim()) {
		compound.name = newName.trim();
	}
};

const openCompound = (id: string) => {
	const compound = compoundClips.value.find(c => c.id === id);
	if (compound) {
		compound.isOpen = true;
		emit("edit", id);
	}
};

const closeCompound = (id: string) => {
	const compound = compoundClips.value.find(c => c.id === id);
	if (compound) {
		compound.isOpen = false;
	}
};

const explodeCompound = (id: string) => {
	const compound = compoundClips.value.find(c => c.id === id);
	if (compound) {
		emit("explode", id);
		deleteCompound(id);
	}
};

const handleCreateFromSelection = () => {
	showCreateDialog.value = true;
	newCompoundName.value = `Compound ${compoundClips.value.length + 1}`;
};

const toggleClipSelection = (clipId: string) => {
	const index = selectedClipIds.value.indexOf(clipId);
	if (index === -1) {
		selectedClipIds.value.push(clipId);
	} else {
		selectedClipIds.value.splice(index, 1);
	}
};

const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const frames = Math.floor((seconds % 1) * 30);
	return `${mins}:${secs.toString().padStart(2, "0")}:${
		frames.toString().padStart(2, "0")
	}`;
};

const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
};
</script>

<template>
	<div class="compound-clip-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[480px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:layers" class="w-5 h-5 text-blue-500" />
				Compound Clips
			</h3>
			<div class="flex items-center gap-2">
				<!-- View Toggle -->
				<div class="flex p-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
					<button
						class="p-1 rounded transition-colors"
						:class="viewMode === 'grid'
						? 'bg-white dark:bg-gray-600 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'"
						@click="viewMode = 'grid'"
					>
						<Icon name="mdi:view-grid" class="w-4 h-4" />
					</button>
					<button
						class="p-1 rounded transition-colors"
						:class="viewMode === 'list'
						? 'bg-white dark:bg-gray-600 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'"
						@click="viewMode = 'list'"
					>
						<Icon name="mdi:view-list" class="w-4 h-4" />
					</button>
				</div>
				<button
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Create Button -->
		<div class="flex gap-2 mb-4">
			<button
				class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="handleCreateFromSelection"
			>
				<Icon name="mdi:plus-circle" class="w-4 h-4" />
				Create Compound
			</button>
		</div>

		<!-- Create Dialog -->
		<div
			v-if="showCreateDialog"
			class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
		>
			<div class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
				Creating compound from {{ selectedClipIds.length }} clip{{
					selectedClipIds.length === 1 ? "" : "s"
				}}
			</div>
			<input
				v-model="newCompoundName"
				type="text"
				placeholder="Enter compound name..."
				class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
				@keyup.enter="createCompound"
			>
			<div class="flex gap-2">
				<button
					class="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors"
					@click="showCreateDialog = false"
				>
					Cancel
				</button>
				<button
					class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
					:disabled="!newCompoundName.trim()"
					@click="createCompound"
				>
					Create
				</button>
			</div>
		</div>

		<!-- Compound Clips List -->
		<div class="flex-1 overflow-y-auto">
			<div
				v-if="compoundClips.length === 0"
				class="flex flex-col items-center justify-center py-8 text-gray-400"
			>
				<Icon name="mdi:layers" class="w-12 h-12 mb-2 opacity-30" />
				<p class="text-sm">No compound clips yet</p>
				<p class="text-xs text-gray-400">
					Select clips on the timeline and click "Create Compound"
				</p>
			</div>

			<!-- Grid View -->
			<div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 gap-3">
				<div
					v-for="compound in compoundClips"
					:key="compound.id"
					class="group relative p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
					:class="{
						'border-blue-500 ring-1 ring-blue-500':
							selectedCompoundId === compound.id,
					}"
					@click="selectedCompoundId = compound.id"
				>
					<!-- Thumbnail Placeholder -->
					<div class="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-2 flex items-center justify-center">
						<Icon name="mdi:layers" class="w-8 h-8 text-gray-400" />
					</div>

					<div class="flex items-center justify-between">
						<div class="flex-1 min-w-0">
							<div class="text-sm font-medium text-gray-900 dark:text-white truncate">
								{{ compound.name }}
							</div>
							<div class="text-xs text-gray-500">
								{{ compound.clips.length }} clips · {{
									formatDuration(compound.duration)
								}}
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-lg p-1">
						<button
							class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
							@click.stop="openCompound(compound.id)"
							title="Edit compound"
						>
							<Icon name="mdi:pencil" class="w-3.5 h-3.5" />
						</button>
						<button
							class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
							@click.stop="duplicateCompound(compound.id)"
							title="Duplicate"
						>
							<Icon name="mdi:content-copy" class="w-3.5 h-3.5" />
						</button>
						<button
							class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
							@click.stop="explodeCompound(compound.id)"
							title="Explode (break apart)"
						>
							<Icon name="mdi:link-off" class="w-3.5 h-3.5" />
						</button>
						<button
							class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
							@click.stop="deleteCompound(compound.id)"
							title="Delete"
						>
							<Icon name="mdi:delete" class="w-3.5 h-3.5" />
						</button>
					</div>

					<!-- Open Indicator -->
					<div
						v-if="compound.isOpen"
						class="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded"
					>
						OPEN
					</div>
				</div>
			</div>

			<!-- List View -->
			<div v-else class="space-y-2">
				<div
					v-for="compound in compoundClips"
					:key="compound.id"
					class="group flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
					:class="{
						'border-blue-500 ring-1 ring-blue-500':
							selectedCompoundId === compound.id,
					}"
					@click="selectedCompoundId = compound.id"
				>
					<!-- Icon -->
					<div class="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
						<Icon name="mdi:layers" class="w-5 h-5 text-gray-400" />
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-gray-900 dark:text-white">{{
								compound.name
							}}</span>
							<span
								v-if="compound.isOpen"
								class="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded"
							>
								OPEN
							</span>
						</div>
						<div class="text-xs text-gray-500">
							{{ compound.clips.length }} clips · {{
								formatDuration(compound.duration)
							}} · {{ formatDate(compound.createdAt) }}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
							@click.stop="openCompound(compound.id)"
							title="Edit"
						>
							<Icon name="mdi:pencil" class="w-4 h-4" />
						</button>
						<button
							class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
							@click.stop="duplicateCompound(compound.id)"
							title="Duplicate"
						>
							<Icon name="mdi:content-copy" class="w-4 h-4" />
						</button>
						<button
							class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
							@click.stop="explodeCompound(compound.id)"
							title="Explode"
						>
							<Icon name="mdi:link-off" class="w-4 h-4" />
						</button>
						<button
							class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
							@click.stop="deleteCompound(compound.id)"
							title="Delete"
						>
							<Icon name="mdi:delete" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Selected Compound Details -->
		<div
			v-if="selectedCompound"
			class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
		>
			<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
				SELECTED COMPOUND
			</div>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Icon name="mdi:layers" class="w-4 h-4 text-blue-500" />
					<span class="text-sm font-medium text-gray-900 dark:text-white">{{
						selectedCompound.name
					}}</span>
				</div>
				<div class="flex gap-2">
					<button
						class="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors flex items-center gap-1"
						@click="openCompound(selectedCompound.id)"
					>
						<Icon name="mdi:pencil" class="w-3 h-3" />
						Edit
					</button>
					<button
						class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg transition-colors flex items-center gap-1"
						@click="explodeCompound(selectedCompound.id)"
					>
						<Icon name="mdi:link-off" class="w-3 h-3" />
						Explode
					</button>
				</div>
			</div>
		</div>

		<!-- Tips -->
		<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
			<div class="flex items-start gap-2">
				<Icon name="mdi:information" class="w-4 h-4 text-blue-500 mt-0.5" />
				<div class="text-xs text-blue-700 dark:text-blue-300">
					<strong>Tip:</strong> Compound clips let you group multiple clips
					together. Double-click to edit the contents, or use "Explode" to break
					them apart.
				</div>
			</div>
		</div>
	</div>
</template>
