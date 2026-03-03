<script setup lang="ts">
const emit = defineEmits<{
	change: [range: { start: string; end: string; label: string }];
}>();

const presets = [
	{ label: "24h", days: 1 },
	{ label: "7d", days: 7 },
	{ label: "30d", days: 30 },
	{ label: "90d", days: 90 },
	{ label: "1y", days: 365 },
];

const selectedPreset = ref("7d");
const startDate = ref("");
const endDate = ref("");
const showCustom = ref(false);

function getDateString(daysAgo: number): string {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	return date.toISOString().split("T")[0]!;
}

function selectPreset(label: string, days: number) {
	selectedPreset.value = label;
	showCustom.value = false;
	const end = new Date().toISOString().split("T")[0]!;
	const start = getDateString(days);
	emit("change", { start, end, label });
}

function applyCustomRange() {
	if (startDate.value && endDate.value) {
		selectedPreset.value = "custom";
		emit("change", {
			start: startDate.value,
			end: endDate.value,
			label: "Custom",
		});
	}
}

function toggleCustom() {
	showCustom.value = !showCustom.value;
	if (showCustom.value) {
		selectedPreset.value = "custom";
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - 7);
		endDate.value = end.toISOString().split("T")[0]!;
		startDate.value = start.toISOString().split("T")[0]!;
	}
}

// Initialize with 7d
onMounted(() => {
	selectPreset("7d", 7);
});
</script>

<template>
	<div class="flex items-center gap-2">
		<div class="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
			<button
				v-for="preset in presets"
				:key="preset.label"
				class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
				:class="selectedPreset === preset.label
				? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
				@click="selectPreset(preset.label, preset.days)"
			>
				{{ preset.label }}
			</button>
			<button
				class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
				:class="showCustom
				? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
				@click="toggleCustom"
			>
				<i class="i-mdi-calendar-range" />
			</button>
		</div>

		<!-- Custom date inputs -->
		<div v-if="showCustom" class="flex items-center gap-2 animate-fade-in">
			<input
				v-model="startDate"
				type="date"
				class="px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
				@change="applyCustomRange"
			>
			<span class="text-gray-500 dark:text-gray-400">to</span>
			<input
				v-model="endDate"
				type="date"
				class="px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
				@change="applyCustomRange"
			>
		</div>
	</div>
</template>

<style scoped>
.animate-fade-in {
	animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-4px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
