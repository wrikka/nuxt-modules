<script setup lang="ts">
const presets = [
	{ name: "Instagram Post", dimensions: "1080 × 1080", icon: "📱" },
	{ name: "Instagram Story", dimensions: "1080 × 1920", icon: "📲" },
	{ name: "TikTok Video", dimensions: "1080 × 1920", icon: "🎵" },
	{ name: "YouTube Thumbnail", dimensions: "1280 × 720", icon: "🎬" },
	{ name: "Facebook Cover", dimensions: "820 × 312", icon: "👥" },
	{ name: "Twitter/X Post", dimensions: "1200 × 675", icon: "🐦" },
	{ name: "LinkedIn Banner", dimensions: "1584 × 396", icon: "💼" },
	{ name: "Pinterest Pin", dimensions: "1000 × 1500", icon: "📌" },
];

const selectedPreset = ref<string | null>(null);

const applyPreset = (preset: typeof presets[0]) => {
	selectedPreset.value = preset.name;
	alert(`Resizing canvas to ${preset.dimensions} (${preset.name})`);
};
</script>

<template>
	<div class="relative">
		<!-- Trigger Button -->
		<button class="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
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
					d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
				/>
			</svg>
			<span class="text-sm font-medium">Resize</span>
		</button>

		<!-- Presets Dropdown -->
		<div class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
			<div class="p-3">
				<p class="text-xs text-gray-500 mb-2">Quick resize presets:</p>
				<div class="space-y-1">
					<button
						v-for="preset in presets"
						:key="preset.name"
						:class="[
							'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
							selectedPreset === preset.name
								? 'bg-purple-100 dark:bg-purple-900'
								: 'hover:bg-gray-100 dark:hover:bg-gray-700',
						]"
						@click="applyPreset(preset)"
					>
						<span class="text-lg">{{ preset.icon }}</span>
						<div class="flex-1">
							<p class="text-sm font-medium">{{ preset.name }}</p>
							<p class="text-xs text-gray-500">{{ preset.dimensions }}</p>
						</div>
						<svg
							v-if="selectedPreset === preset.name"
							class="w-4 h-4 text-purple-600"
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
			</div>

			<!-- Custom Size -->
			<div class="p-3 border-t border-gray-200 dark:border-gray-700">
				<p class="text-xs text-gray-500 mb-2">Custom size:</p>
				<div class="flex gap-2">
					<input
						type="number"
						placeholder="Width"
						class="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
					/>
					<span class="text-gray-400">×</span>
					<input
						type="number"
						placeholder="Height"
						class="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
