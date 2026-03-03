<script setup lang="ts">
const foregroundColor = ref("#3B82F6");
const backgroundColor = ref("#FFFFFF");
const fontSize = ref(16);

const contrastRatio = computed(() => {
	const getLuminance = (hex: string) => {
		const rgb = parseInt(hex.slice(1), 16);
		const r = (rgb >> 16) & 0xff;
		const g = (rgb >> 8) & 0xff;
		const b = (rgb >> 0) & 0xff;
		const [rs, gs, bs] = [r, g, b].map(c => {
			c /= 255;
			return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
		}) as [number, number, number];
		return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
	};
	const l1 = getLuminance(foregroundColor.value);
	const l2 = getLuminance(backgroundColor.value);
	const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
	return ratio.toFixed(2);
});

const wcagAA = computed(() => parseFloat(contrastRatio.value) >= 4.5);
const wcagAAA = computed(() => parseFloat(contrastRatio.value) >= 7);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Color Accessibility
			</h3>
			<span
				class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded"
			>WCAG 2.1</span>
		</div>

		<!-- Preview -->
		<div
			class="h-24 rounded-lg flex items-center justify-center mb-4 transition-colors"
			:style="{ backgroundColor, color: foregroundColor, fontSize: `${fontSize}px` }"
		>
			<p class="font-medium">Sample Text Preview</p>
		</div>

		<!-- Color Pickers -->
		<div class="grid grid-cols-2 gap-4 mb-4">
			<div>
				<label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
				>Text Color</label>
				<div class="flex items-center gap-2">
					<input
						v-model="foregroundColor"
						type="color"
						class="w-10 h-10 rounded"
					/>
					<input
						v-model="foregroundColor"
						type="text"
						class="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
					/>
				</div>
			</div>
			<div>
				<label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
				>Background</label>
				<div class="flex items-center gap-2">
					<input
						v-model="backgroundColor"
						type="color"
						class="w-10 h-10 rounded"
					/>
					<input
						v-model="backgroundColor"
						type="text"
						class="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
					/>
				</div>
			</div>
		</div>

		<!-- Font Size Slider -->
		<div class="mb-4">
			<label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
			>Font Size: {{ fontSize }}px</label>
			<input
				v-model.number="fontSize"
				type="range"
				min="12"
				max="48"
				class="w-full"
			/>
		</div>

		<!-- Results -->
		<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm text-gray-600">Contrast Ratio</span>
				<span
					class="text-2xl font-bold"
					:class="wcagAAA
					? 'text-green-500'
					: wcagAA
					? 'text-yellow-500'
					: 'text-red-500'"
				>{{ contrastRatio }}:1</span>
			</div>
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-sm">WCAG AA (4.5:1)</span>
					<Icon
						:name="wcagAA ? 'mdi:check-circle' : 'mdi:close-circle'"
						:class="wcagAA ? 'text-green-500' : 'text-red-500'"
						class="w-5 h-5"
					/>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm">WCAG AAA (7:1)</span>
					<Icon
						:name="wcagAAA ? 'mdi:check-circle' : 'mdi:close-circle'"
						:class="wcagAAA ? 'text-green-500' : 'text-red-500'"
						class="w-5 h-5"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
