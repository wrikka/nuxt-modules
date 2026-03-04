<script setup lang="ts">
export interface Artboard {
	id: string;
	name: string;
	width: number;
	height: number;
	thumbnail?: string;
	selected: boolean;
}

const props = defineProps<{
	artboards: Artboard[];
	activeArtboardId: string | null;
}>();

const emit = defineEmits<{
	(e: "select", artboardId: string): void;
	(e: "add"): void;
	(e: "duplicate", artboardId: string): void;
	(e: "rename", artboardId: string, name: string): void;
	(e: "delete", artboardId: string): void;
	(e: "reorder", artboardIds: string[]): void;
}>();

const editingArtboard = ref<string | null>(null);
const editName = ref("");

const startEdit = (artboard: Artboard) => {
	editingArtboard.value = artboard.id;
	editName.value = artboard.name;
};

const saveEdit = (artboardId: string) => {
	emit("rename", artboardId, editName.value);
	editingArtboard.value = null;
};

const cancelEdit = () => {
	editingArtboard.value = null;
	editName.value = "";
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Artboards ({{ artboards.length }})
			</h3>
			<button
				type="button"
				class="p-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1 text-xs"
				@click="$emit('add')"
			>
				<svg
					class="w-3 h-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				New Artboard
			</button>
		</div>

		<div
			v-if="artboards.length === 0"
			class="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
		>
			No artboards
		</div>

		<div v-else class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
			<div
				v-for="artboard in artboards"
				:key="artboard.id"
				class="group relative p-2 rounded-lg border transition-all cursor-pointer"
				:class="activeArtboardId === artboard.id
				? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-200'
				: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
				@click="$emit('select', artboard.id)"
			>
				<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center mb-2 overflow-hidden">
					<div
						class="bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500"
						:style="{
							width: `${Math.min(artboard.width / 20, 100)}px`,
							height: `${Math.min(artboard.height / 20, 60)}px`,
						}"
					>
						<span class="text-xs text-gray-400 absolute">{{ artboard.width }}×{{
								artboard.height
							}}</span>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div
						v-if="editingArtboard === artboard.id"
						class="flex items-center gap-1 flex-1"
					>
						<input
							v-model="editName"
							type="text"
							class="flex-1 px-1.5 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
							@keyup.enter="saveEdit(artboard.id)"
							@keyup.escape="cancelEdit"
							@click.stop
						>
						<button
							type="button"
							class="p-0.5 text-green-600 hover:text-green-700"
							@click.stop="saveEdit(artboard.id)"
						>
							<svg
								class="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</button>
					</div>
					<span
						v-else
						class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate"
					>{{ artboard.name }}</span>

					<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-blue-500"
							title="Duplicate"
							@click.stop="$emit('duplicate', artboard.id)"
						>
							<svg
								class="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
								/>
							</svg>
						</button>
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-gray-600"
							title="Rename"
							@click.stop="startEdit(artboard)"
						>
							<svg
								class="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
								/>
							</svg>
						</button>
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-red-500"
							title="Delete"
							@click.stop="$emit('delete', artboard.id)"
						>
							<svg
								class="w-3 h-3"
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
				</div>
			</div>
		</div>
	</div>
</template>
