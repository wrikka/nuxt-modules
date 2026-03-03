<script setup lang="ts">
import type { Element } from "#shared/types";

const elementStore = useElementStore();

const { elements, selectedElements } = storeToRefs(elementStore);

const sortedElements = computed(() => {
	return Array.from(elements.value.entries()).sort(([, a], [, b]) =>
		b.zIndex - a.zIndex
	);
});

const getElementTypeIcon = (type: Element["type"]): string => {
	const icons: Record<Element["type"], string> = {
		text: "T",
		image: "🖼️",
		video: "🎬",
		shape: "◻️",
		icon: "🎨",
		chart: "📊",
		qr: "🔳",
		group: "📁",
		"smart-component": "🧩",
	};
	return icons[type] || "📄";
};

const getElementName = (element: Element): string => {
	if (element.type === "text") {
		return element.content || "Text";
	}
	if (element.type === "image") {
		return element.alt || "Image";
	}
	if (element.type === "video") {
		return "Video";
	}
	if (element.type === "shape") {
		return element.shape || "Shape";
	}
	if (element.type === "icon") {
		return element.icon || "Icon";
	}
	if (element.type === "chart") {
		return element.chartType || "Chart";
	}
	if (element.type === "qr") {
		return "QR Code";
	}
	if (element.type === "group") {
		return "Group";
	}
	return "Element";
};

const handleSelectElement = (id: string) => {
	elementStore.selectElement(id);
};

const handleSelectElementWithEvent = (id: string, event: MouseEvent) => {
	const addToSelection = event.ctrlKey || event.metaKey;
	elementStore.selectElement(id, addToSelection);
};

const handleToggleVisibility = (id: string) => {
	const element = elements.value.get(id);
	if (element) {
		elementStore.updateElement(id, { visible: !element.visible });
	}
};

const handleToggleLock = (id: string) => {
	const element = elements.value.get(id);
	if (element) {
		elementStore.updateElement(id, { locked: !element.locked });
	}
};

const handleBringToFront = () => {
	const selectedIds = Array.from(selectedElements.value);
	if (selectedIds.length === 1) {
		elementStore.bringToFront(selectedIds[0]!);
	}
};

const handleSendToBack = () => {
	const selectedIds = Array.from(selectedElements.value);
	if (selectedIds.length === 1) {
		elementStore.sendToBack(selectedIds[0]!);
	}
};
</script>

<template>
	<div class="w-64 bg-white dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 flex flex-col">
		<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
			<h2 class="text-sm font-semibold text-gray-900 dark:text-white">
				Layers
			</h2>
			<div class="flex gap-1">
				<button
					:class="[
						'p-1 rounded transition-colors',
						'hover:bg-gray-100 dark:hover:bg-gray-600',
					]"
					title="Bring to Front"
					@click="handleBringToFront"
				>
					↑
				</button>
				<button
					:class="[
						'p-1 rounded transition-colors',
						'hover:bg-gray-100 dark:hover:bg-gray-600',
					]"
					title="Send to Back"
					@click="handleSendToBack"
				>
					↓
				</button>
			</div>
		</div>
		<div class="flex-1 overflow-y-auto">
			<div
				v-for="([id, element]) in sortedElements"
				:key="id"
				:class="[
					'px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors',
					selectedElements.has(id)
						? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
						: 'hover:bg-gray-50 dark:hover:bg-gray-600 border-l-4 border-transparent',
				]"
				@click="handleSelectElementWithEvent(id, $event)"
			>
				<span class="text-lg">{{ getElementTypeIcon(element.type) }}</span>
				<span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
					{{ getElementName(element) }}
				</span>
				<button
					class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
					@click.stop="handleToggleVisibility(id)"
				>
					{{ element.visible ? "👁️" : "👁️‍🗨️" }}
				</button>
				<button
					class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
					@click.stop="handleToggleLock(id)"
				>
					{{ element.locked ? "🔒" : "🔓" }}
				</button>
			</div>
		</div>
	</div>
</template>
