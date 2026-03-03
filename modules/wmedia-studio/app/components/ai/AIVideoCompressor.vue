<script setup lang="ts">
const emit = defineEmits<
	{ close: []; compress: [quality: number, format: string] }
>();
const targetSize = ref(50);
const quality = ref("high");
const format = ref("mp4");
const originalSize = ref(450);
const estimatedSize = computed(() =>
	Math.round(originalSize.value * (targetSize.value / 100))
);

const compress = () => emit("compress", targetSize.value, format.value);
</script>
<template>
	<div class="ai-video-compressor bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:zip-box" class="w-5 h-5 text-purple-500" />
				AI Video Compressor
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="flex justify-between text-sm mb-2">
				<span class="text-gray-600 dark:text-gray-400"
				>Original: {{ originalSize }} MB</span>
				<span class="text-green-500 font-medium"
				>Target: ~{{ estimatedSize }} MB</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
				<div
					class="h-full bg-green-500 rounded-full transition-all"
					:style="{ width: `${targetSize}%` }"
				/>
			</div>
			<div class="text-gray-500 dark:text-gray-500 text-xs mt-1">
				Compression ratio: {{ targetSize }}%
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Target File Size</span>
				<span class="text-purple-500 font-medium">{{ targetSize }}%</span>
			</div>
			<input
				v-model="targetSize"
				type="range"
				min="10"
				max="95"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Output Format</label>
			<div class="flex gap-2">
				<button
					v-for='f in ["mp4", "webm", "mov"]'
					:key="f"
					class="flex-1 p-2 rounded-lg text-sm uppercase transition-all"
					:class="format === f
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="format = f"
				>
					{{ f }}
				</button>
			</div>
		</div>
		<label
			class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
		>
			<input
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
				checked
			>
			<span>Preserve original resolution when possible</span>
		</label>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="compress"
		>
			Compress Video
		</button>
	</div>
</template>
