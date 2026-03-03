<script setup lang="ts">
interface ContrastResult {
	foreground: string;
	background: string;
	ratio: number;
	aa: boolean;
	aaa: boolean;
	largeAA: boolean;
	largeAAA: boolean;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	applyColors: [fg: string, bg: string];
}>();

const foreground = ref("#1F2937");
const background = ref("#FFFFFF");

const luminance = (color: string): number => {
	const hex = color.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16) / 255;
	const g = parseInt(hex.substring(2, 4), 16) / 255;
	const b = parseInt(hex.substring(4, 6), 16) / 255;

	const toLinear = (c: number): number =>
		c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

	return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const contrastRatio = computed((): ContrastResult => {
	const l1 = luminance(foreground.value);
	const l2 = luminance(background.value);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	const ratio = (lighter + 0.05) / (darker + 0.05);

	return {
		foreground: foreground.value,
		background: background.value,
		ratio: Math.round(ratio * 100) / 100,
		aa: ratio >= 4.5,
		aaa: ratio >= 7,
		largeAA: ratio >= 3,
		largeAAA: ratio >= 4.5,
	};
});

const suggestions = computed(() => {
	if (contrastRatio.value.aa) return [];

	// Generate better contrast suggestions
	return [
		{ fg: "#000000", bg: background.value, ratio: 21 },
		{ fg: "#FFFFFF", bg: "#1F2937", ratio: 16.1 },
		{ fg: "#1F2937", bg: "#F9FAFB", ratio: 11.2 },
	].filter(s => s.ratio >= 4.5);
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:eyedropper" class="w-6 h-6 text-purple-500" />
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">
						Color Contrast Checker
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<div class="p-6 space-y-6">
				<!-- Preview -->
				<div
					class="p-8 rounded-xl text-center transition-colors"
					:style="{ backgroundColor: background, color: foreground }"
				>
					<p class="text-xl font-medium">
						The quick brown fox jumps over the lazy dog
					</p>
					<p class="text-sm mt-2 opacity-75">
						Sample text for contrast testing
					</p>
				</div>

				<!-- Color Inputs -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
						>Foreground</label>
						<div class="flex items-center gap-2">
							<input
								v-model="foreground"
								type="color"
								class="w-10 h-10 rounded-lg cursor-pointer"
							>
							<input
								v-model="foreground"
								type="text"
								class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm uppercase"
							>
						</div>
					</div>
					<div>
						<label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
						>Background</label>
						<div class="flex items-center gap-2">
							<input
								v-model="background"
								type="color"
								class="w-10 h-10 rounded-lg cursor-pointer"
							>
							<input
								v-model="background"
								type="text"
								class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm uppercase"
							>
						</div>
					</div>
				</div>

				<!-- Results -->
				<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
					<div class="flex items-center justify-between mb-4">
						<span class="text-gray-600 dark:text-gray-400">Contrast Ratio</span>
						<span
							class="text-2xl font-bold"
							:class="contrastRatio.aa ? 'text-green-500' : 'text-red-500'"
						>
							{{ contrastRatio.ratio }}:1
						</span>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div
							class="p-3 rounded-lg text-center"
							:class="contrastRatio.aa
							? 'bg-green-100 dark:bg-green-900/30'
							: 'bg-red-100 dark:bg-red-900/30'"
						>
							<p
								class="font-semibold"
								:class="contrastRatio.aa ? 'text-green-700' : 'text-red-700'"
							>
								AA
							</p>
							<p class="text-xs text-gray-500">Normal Text</p>
							<p
								class="text-xs font-medium mt-1"
								:class="contrastRatio.aa ? 'text-green-600' : 'text-red-600'"
							>
								{{ contrastRatio.aa ? "✓ Pass" : "✗ Fail" }}
							</p>
						</div>
						<div
							class="p-3 rounded-lg text-center"
							:class="contrastRatio.aaa
							? 'bg-green-100 dark:bg-green-900/30'
							: 'bg-red-100 dark:bg-red-900/30'"
						>
							<p
								class="font-semibold"
								:class="contrastRatio.aaa ? 'text-green-700' : 'text-red-700'"
							>
								AAA
							</p>
							<p class="text-xs text-gray-500">Normal Text</p>
							<p
								class="text-xs font-medium mt-1"
								:class="contrastRatio.aaa ? 'text-green-600' : 'text-red-600'"
							>
								{{ contrastRatio.aaa ? "✓ Pass" : "✗ Fail" }}
							</p>
						</div>
					</div>
				</div>

				<!-- Suggestions -->
				<div
					v-if="suggestions.length > 0"
					class="border-t border-gray-200 dark:border-gray-700 pt-4"
				>
					<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
						Suggested Improvements
					</h3>
					<div class="space-y-2">
						<button
							v-for="s in suggestions"
							:key="`${s.fg}-${s.bg}`"
							class="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
							@click="emit('applyColors', s.fg, s.bg)"
						>
							<div class="flex items-center gap-2">
								<div
									class="w-6 h-6 rounded"
									:style="{ backgroundColor: s.fg }"
								/>
								<Icon name="mdi:arrow-right" class="w-4 h-4 text-gray-400" />
								<div
									class="w-6 h-6 rounded"
									:style="{ backgroundColor: s.bg }"
								/>
							</div>
							<span class="text-sm font-medium text-green-600">{{
									s.ratio
								}}:1</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
