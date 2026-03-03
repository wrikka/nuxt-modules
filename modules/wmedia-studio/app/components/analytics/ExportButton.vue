<script setup lang="ts">
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const props = defineProps<{
	data: Record<string, unknown>;
}>();

const isExporting = ref(false);
const showDropdown = ref(false);

async function exportToPDF() {
	isExporting.value = true;
	showDropdown.value = false;

	try {
		const element = document.querySelector(".analytics-container");
		if (!element) return;

		const canvas = await html2canvas(element as HTMLElement, {
			scale: 2,
			useCORS: true,
			logging: false,
		});

		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF("l", "mm", "a4");
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = pdf.internal.pageSize.getHeight();
		const imgWidth = canvas.width;
		const imgHeight = canvas.height;
		const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

		pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio);
		pdf.save(`analytics-report-${new Date().toISOString().split("T")[0]}.pdf`);
	} catch (error) {
		console.error("Export failed:", error);
	} finally {
		isExporting.value = false;
	}
}

function exportToCSV() {
	showDropdown.value = false;

	const csvData = [];
	csvData.push(["Metric", "Value"]);

	for (const [key, value] of Object.entries(props.data)) {
		if (typeof value === "object" && value !== null) {
			csvData.push([key, JSON.stringify(value)]);
		} else {
			csvData.push([key, String(value)]);
		}
	}

	const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(","))
		.join("\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `analytics-data-${
		new Date().toISOString().split("T")[0]
	}.csv`;
	link.click();
}

function exportToJSON() {
	showDropdown.value = false;

	const jsonContent = JSON.stringify(props.data, null, 2);
	const blob = new Blob([jsonContent], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `analytics-data-${
		new Date().toISOString().split("T")[0]
	}.json`;
	link.click();
}

// Close dropdown when clicking outside
onClickOutside(ref(null), () => {
	showDropdown.value = false;
});
</script>

<template>
	<div class="relative">
		<button
			class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
			:disabled="isExporting"
			@click="showDropdown = !showDropdown"
		>
			<i v-if="isExporting" class="i-mdi-loading animate-spin" />
			<i v-else class="i-mdi-download" />
			<span>{{ isExporting ? "Exporting..." : "Export Report" }}</span>
			<i class="i-mdi-chevron-down" />
		</button>

		<div
			v-if="showDropdown"
			class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
		>
			<button
				class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg flex items-center gap-2"
				@click="exportToPDF"
			>
				<i class="i-mdi-file-pdf text-red-500" />
				Export as PDF
			</button>
			<button
				class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
				@click="exportToCSV"
			>
				<i class="i-mdi-file-csv text-green-500" />
				Export as CSV
			</button>
			<button
				class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg flex items-center gap-2"
				@click="exportToJSON"
			>
				<i class="i-mdi-code-json text-blue-500" />
				Export as JSON
			</button>
		</div>
	</div>
</template>
