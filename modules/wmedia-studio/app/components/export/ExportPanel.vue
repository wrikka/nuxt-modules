<script setup lang="ts">
const showExport = ref(false);

const formats = [
	{ name: "PNG", ext: "png", icon: "🖼️" },
	{ name: "JPG", ext: "jpg", icon: "🖼️" },
	{ name: "SVG", ext: "svg", icon: "📐" },
	{ name: "PDF", ext: "pdf", icon: "📄" },
	{ name: "MP4", ext: "mp4", icon: "🎬" },
	{ name: "GIF", ext: "gif", icon: "🎞️" },
	{ name: "WebM", ext: "webm", icon: "🎥" },
];

const selectedFormat = ref("PNG");
const scale = ref(1);
const quality = ref(80);

const exportProject = () => {
	console.log(
		"Exporting as",
		selectedFormat.value,
		"at",
		scale.value,
		"x scale",
	);
};
</script>

<template>
	<div>
		<button
			class="fixed right-4 bottom-32 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-yellow-400 ring-offset-2': showExport }"
			@click="showExport = !showExport"
			title="Export"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="7 10 12 15 17 10" />
				<line x1="12" x2="12" y1="15" y2="3" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showExport"
				class="fixed bottom-48 right-4 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-yellow-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Export</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showExport = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-4">
					<!-- Formats -->
					<div class="mb-4 grid grid-cols-4 gap-2">
						<button
							v-for="format in formats"
							:key="format.name"
							class="rounded-lg border border-gray-200 py-3 text-center transition-colors dark:border-gray-700"
							:class="selectedFormat === format.name
							? 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30'
							: 'hover:bg-gray-50 dark:hover:bg-gray-800'"
							@click="selectedFormat = format.name"
						>
							<span class="text-lg">{{ format.icon }}</span>
							<p class="mt-1 text-[10px] font-medium">{{ format.name }}</p>
						</button>
					</div>

					<!-- Scale -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Scale: {{ scale }}x</label>
						<input
							v-model.number="scale"
							type="range"
							min="0.5"
							max="4"
							step="0.5"
							class="w-full"
						/>
						<div class="flex justify-between text-[10px] text-gray-500">
							<span>0.5x</span>
							<span>1x</span>
							<span>2x</span>
							<span>4x</span>
						</div>
					</div>

					<!-- Quality -->
					<div class="mb-4">
						<label
							class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
						>Quality: {{ quality }}%</label>
						<input
							v-model.number="quality"
							type="range"
							min="1"
							max="100"
							class="w-full"
						/>
					</div>

					<button
						class="w-full rounded-lg bg-yellow-600 py-3 font-medium text-white transition-colors hover:bg-yellow-700"
						@click="exportProject"
					>
						Export {{ selectedFormat }}
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
