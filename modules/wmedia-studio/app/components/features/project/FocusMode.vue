<script setup lang="ts">
const isFocusMode = ref(false);

const toggleFocusMode = () => {
	isFocusMode.value = !isFocusMode.value;
	if (isFocusMode.value) {
		document.documentElement.classList.add("focus-mode");
	} else {
		document.documentElement.classList.remove("focus-mode");
	}
};

// Exit on Escape
onMounted(() => {
	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isFocusMode.value) {
			isFocusMode.value = false;
			document.documentElement.classList.remove("focus-mode");
		}
	});
});
</script>

<template>
	<div>
		<!-- Focus Mode Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
			:class="{
				'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300':
					isFocusMode,
			}"
			@click="toggleFocusMode"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					v-if="!isFocusMode"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
				/>
				<path
					v-else
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
			<span class="text-sm font-medium">{{
				isFocusMode ? "Exit Focus" : "Focus Mode"
			}}</span>
		</button>

		<!-- Focus Mode Overlay -->
		<Transition>
			<div
				v-if="isFocusMode"
				class="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col items-center justify-center"
			>
				<!-- Floating Toolbar (Minimal) -->
				<div class="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-lg">
					<button
						class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
						title="Undo"
					>
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
								d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
							/>
						</svg>
					</button>
					<button
						class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
						title="Redo"
					>
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
								d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
							/>
						</svg>
					</button>
					<div class="w-px h-4 bg-gray-300 dark:bg-gray-600" />
					<button
						class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
						title="Save"
					>
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
								d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
							/>
						</svg>
					</button>
				</div>

				<!-- Canvas Area (Placeholder) -->
				<div class="w-full max-w-6xl h-[80vh] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
					<div class="text-center">
						<div class="text-6xl mb-4">🎨</div>
						<p class="text-gray-500 text-lg">Your Canvas</p>
						<p class="text-sm text-gray-400 mt-2">
							All distractions hidden. Press ESC to exit.
						</p>
					</div>
				</div>

				<!-- Bottom Bar -->
				<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-lg text-sm text-gray-600">
					<span>Focus Mode Active</span>
					<span class="text-gray-400">|</span>
					<span>Auto-saving...</span>
					<button
						class="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs hover:bg-indigo-700"
						@click="toggleFocusMode"
					>
						Exit (ESC)
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
