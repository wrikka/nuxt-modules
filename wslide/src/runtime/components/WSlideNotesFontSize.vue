<script setup lang="ts">
const fontSize = ref(16);
const MIN_SIZE = 12;
const MAX_SIZE = 32;

function increaseSize() {
	if (fontSize.value < MAX_SIZE) {
		fontSize.value += 2;
		updateFontSize();
	}
}

function decreaseSize() {
	if (fontSize.value > MIN_SIZE) {
		fontSize.value -= 2;
		updateFontSize();
	}
}

function updateFontSize() {
	// Update CSS custom property for presenter notes
	document.documentElement.style.setProperty("--wslide-notes-font-size", `${fontSize.value}px`);
	localStorage.setItem("wslide-notes-font-size", String(fontSize.value));
}

onMounted(() => {
	const saved = localStorage.getItem("wslide-notes-font-size");
	if (saved) {
		fontSize.value = parseInt(saved, 10);
		updateFontSize();
	}
});
</script>

<template>
	<div class="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
		<span class="text-xs text-gray-400">Notes</span>
		<button
			class="p-1 hover:bg-gray-700 rounded transition-colors text-gray-300 disabled:opacity-50"
			:disabled="fontSize <= MIN_SIZE"
			@click="decreaseSize"
			title="Decrease font size"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M21 12H3" />
			</svg>
		</button>
		<span class="text-sm text-white w-8 text-center">{{ fontSize }}px</span>
		<button
			class="p-1 hover:bg-gray-700 rounded transition-colors text-gray-300 disabled:opacity-50"
			:disabled="fontSize >= MAX_SIZE"
			@click="increaseSize"
			title="Increase font size"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 5v14M5 12h14" />
			</svg>
		</button>
	</div>
</template>
