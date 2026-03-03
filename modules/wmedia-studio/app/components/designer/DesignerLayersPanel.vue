<script setup lang="ts">
export interface DesignerLayerItem {
	id: string;
	name: string;
	type: string;
	visible: boolean;
	locked: boolean;
}

interface Props {
	layers: DesignerLayerItem[];
	selectedId: string | null;
}

const props = defineProps<Props>();

const searchQuery = ref("");
const showHidden = ref(true);
const showLocked = ref(true);

const filteredLayers = computed(() => {
	let result = props.layers;

	// Filter by search query
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter((layer: DesignerLayerItem) =>
			layer.name.toLowerCase().includes(query)
			|| layer.type.toLowerCase().includes(query)
		);
	}

	// Filter by visibility
	if (!showHidden.value) {
		result = result.filter((layer: DesignerLayerItem) => layer.visible);
	}

	// Filter by lock status
	if (!showLocked.value) {
		result = result.filter((layer: DesignerLayerItem) => !layer.locked);
	}

	return result;
});

const clearSearch = () => {
	searchQuery.value = "";
};

const emit = defineEmits<{
	select: [id: string];
	toggleVisible: [id: string];
	toggleLocked: [id: string];
	rename: [id: string, newName: string];
}>();

const editingId = ref<string | null>(null);
const editingName = ref("");

const startRename = (id: string, name: string, event: Event) => {
	event.stopPropagation();
	editingId.value = id;
	editingName.value = name;
};

const finishRename = () => {
	if (editingId.value && editingName.value.trim()) {
		emit("rename", editingId.value, editingName.value.trim());
	}
	editingId.value = null;
	editingName.value = "";
};

const cancelRename = () => {
	editingId.value = null;
	editingName.value = "";
};

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === "Enter") {
		finishRename();
	} else if (event.key === "Escape") {
		cancelRename();
	}
};
</script>

<template>
	<div class="w-72 bg-white dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 flex flex-col">
		<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600 space-y-2">
			<h2 class="text-sm font-semibold text-gray-900 dark:text-white">
				Layers
			</h2>
			<!-- Search -->
			<div class="relative">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search layers..."
					class="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					v-if="searchQuery"
					@click="clearSearch"
					class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
				>
					<svg
						class="w-4 h-4"
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
			<!-- Filters -->
			<div class="flex gap-2 text-xs">
				<label class="flex items-center gap-1 cursor-pointer">
					<input
						type="checkbox"
						v-model="showHidden"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-gray-600 dark:text-gray-400">Show hidden</span>
				</label>
				<label class="flex items-center gap-1 cursor-pointer">
					<input
						type="checkbox"
						v-model="showLocked"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-gray-600 dark:text-gray-400">Show locked</span>
				</label>
			</div>
		</div>
		<div class="flex-1 overflow-y-auto">
			<button
				v-for="layer in filteredLayers"
				:key="layer.id"
				:class="[
					'w-full text-left px-4 py-2 border-b border-gray-100 dark:border-gray-600 text-sm flex items-center justify-between gap-2',
					layer.id === selectedId
						? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
						: 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200',
					!layer.visible ? 'opacity-50' : '',
				]"
				@click="$emit('select', layer.id)"
			>
				<div class="flex items-center gap-2 flex-1 min-w-0">
					<button
						class="shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
						:title="layer.visible ? 'Hide' : 'Show'"
						@click.stop="$emit('toggleVisible', layer.id)"
					>
						<svg
							v-if="layer.visible"
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
						<svg
							v-else
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
					</button>
					<button
						class="shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
						:title="layer.locked ? 'Unlock' : 'Lock'"
						@click.stop="$emit('toggleLocked', layer.id)"
					>
						<svg
							v-if="layer.locked"
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<svg
							v-else
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
							/>
						</svg>
					</button>
					<span
						class="truncate flex-1"
						@dblclick.stop="startRename(layer.id, layer.name, $event)"
					>
						<span v-if="editingId !== layer.id">{{ layer.name }}</span>
						<input
							v-else
							v-model="editingName"
							class="w-full px-1 py-0 text-sm bg-white dark:bg-gray-800 border border-blue-500 rounded"
							@blur="finishRename"
							@keydown="handleKeyDown"
							@click.stop
						/>
					</span>
				</div>
				<span class="text-xs opacity-70 shrink-0">{{ layer.type }}</span>
			</button>
			<!-- Empty state -->
			<div
				v-if="filteredLayers.length === 0"
				class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
			>
				<template v-if="searchQuery">
					No layers match "{{ searchQuery }}"
				</template>
				<template v-else>
					No layers
				</template>
			</div>
		</div>
	</div>
</template>
