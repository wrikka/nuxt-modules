<script setup lang="ts">
const isDragging = ref(false);
const draggedItem = ref<{ type: string; name: string } | null>(null);
const targetElement = ref<HTMLElement | null>(null);

const handleDragStart = (
	e: DragEvent,
	item: { type: string; name: string },
) => {
	draggedItem.value = item;
	isDragging.value = true;
	if (e.dataTransfer) {
		e.dataTransfer.effectAllowed = "copy";
		e.dataTransfer.setData("text/plain", JSON.stringify(item));
	}
};

const handleDragOver = (e: DragEvent) => {
	e.preventDefault();
	if (e.dataTransfer) {
		e.dataTransfer.dropEffect = "copy";
	}
};

const handleDrop = (e: DragEvent) => {
	e.preventDefault();
	isDragging.value = false;
	if (draggedItem.value && targetElement.value) {
		alert(`Replaced with: ${draggedItem.value.name}`);
	}
	draggedItem.value = null;
};

const mediaLibrary = [
	{ type: "image", name: "new-hero.jpg", preview: "🖼️" },
	{ type: "image", name: "team-photo.png", preview: "👥" },
	{ type: "video", name: "intro.mp4", preview: "🎬" },
	{ type: "image", name: "background.svg", preview: "🎨" },
];
</script>

<template>
	<div class="relative">
		<!-- Media Library Sidebar -->
		<div class="w-64 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
			<h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
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
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				Drag to Replace
			</h4>

			<!-- Draggable Items -->
			<div class="grid grid-cols-2 gap-2">
				<div
					v-for="item in mediaLibrary"
					:key="item.name"
					class="p-3 bg-white dark:bg-gray-800 rounded-lg cursor-grab hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
					draggable="true"
					@dragstart="(e) => handleDragStart(e as unknown as DragEvent, item)"
				>
					<div class="text-2xl mb-2 text-center">{{ item.preview }}</div>
					<p class="text-xs text-center truncate">{{ item.name }}</p>
					<p class="text-xs text-center text-gray-400">{{ item.type }}</p>
				</div>
			</div>

			<!-- Instructions -->
			<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
				<p class="flex items-center gap-1">
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
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Drag any media onto canvas elements to replace them
				</p>
			</div>
		</div>

		<!-- Canvas Drop Zone Preview -->
		<div
			v-if="isDragging"
			class="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
		>
			<div class="w-96 h-64 border-4 border-dashed border-blue-500 bg-blue-500/10 rounded-xl flex items-center justify-center">
				<div class="text-center">
					<svg
						class="w-12 h-12 mx-auto mb-2 text-blue-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
					<p class="text-blue-600 font-medium">Drop to replace media</p>
					<p class="text-blue-400 text-sm">{{ draggedItem?.name }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
