<script setup lang="ts">
import { useRecording } from "../../composables/useRecording";

const recording = useRecording();
const showPrintDialog = ref(false);

function printSlides() {
	window.print();
}

function exportPDF() {
	// Open browser print dialog with PDF option
	showPrintDialog.value = true;
	// Auto-trigger print after a short delay
	setTimeout(() => {
		window.print();
		showPrintDialog.value = false;
	}, 100);
}

function exportImages() {
	// Would trigger screenshot capture of each slide
	console.log("Exporting slides as images...");
}
</script>

<template>
	<div class="flex items-center gap-2">
		<button
			class="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
			@click="exportPDF"
			title="Export to PDF"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14 2 14 8 20 8" />
				<path d="M12 18v-6" />
				<path d="M9 15l3 3 3-3" />
			</svg>
			<span class="text-sm">PDF</span>
		</button>

		<button
			class="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
			@click="printSlides"
			title="Print"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="6 9 6 2 18 2 18 9" />
				<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
				<rect x="6" y="14" width="12" height="8" />
			</svg>
		</button>
	</div>
</template>
