<script setup lang="ts">
const isOpen = ref(false);
const searchQuery = ref("");

const shortcuts = [
	{
		category: "General",
		items: [
			{ key: "Ctrl + S", action: "Save project", icon: "💾" },
			{ key: "Ctrl + Z", action: "Undo", icon: "↩️" },
			{ key: "Ctrl + Y", action: "Redo", icon: "↪️" },
			{ key: "Ctrl + C", action: "Copy", icon: "📋" },
			{ key: "Ctrl + V", action: "Paste", icon: "📌" },
			{ key: "Delete", action: "Delete selected", icon: "🗑️" },
		],
	},
	{
		category: "View",
		items: [
			{ key: "Space + Drag", action: "Pan canvas", icon: "✋" },
			{ key: "Ctrl + +", action: "Zoom in", icon: "🔍+" },
			{ key: "Ctrl + -", action: "Zoom out", icon: "🔍-" },
			{ key: "Ctrl + 0", action: "Reset zoom", icon: "🎯" },
			{ key: "F", action: "Fit to screen", icon: "🖥️" },
		],
	},
	{
		category: "Tools",
		items: [
			{ key: "V", action: "Move tool", icon: "↔️" },
			{ key: "T", action: "Text tool", icon: "T" },
			{ key: "R", action: "Rectangle", icon: "▭" },
			{ key: "C", action: "Circle", icon: "○" },
			{ key: "L", action: "Line", icon: "/" },
			{ key: "I", action: "Image", icon: "🖼️" },
		],
	},
	{
		category: "Layers",
		items: [
			{ key: "Ctrl + G", action: "Group", icon: "⧉" },
			{ key: "Ctrl + Shift + G", action: "Ungroup", icon: "☐☐" },
			{ key: "Ctrl + ]", action: "Bring forward", icon: "↑" },
			{ key: "Ctrl + [", action: "Send backward", icon: "↓" },
			{ key: "Ctrl + Shift + ]", action: "Bring to front", icon: "⤴️" },
			{ key: "Ctrl + Shift + [", action: "Send to back", icon: "⤵️" },
		],
	},
];

const filteredShortcuts = computed(() => {
	if (!searchQuery.value) return shortcuts;
	return shortcuts.map(cat => ({
		...cat,
		items: cat.items.filter(item =>
			item.action.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| item.key.toLowerCase().includes(searchQuery.value.toLowerCase())
		),
	})).filter(cat => cat.items.length > 0);
});

onMounted(() => {
	window.addEventListener("keydown", (e) => {
		if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
			isOpen.value = true;
		}
		if (e.key === "Escape") {
			isOpen.value = false;
		}
	});
});
</script>

<template>
	<div>
		<!-- Keyboard Shortcut Hint -->
		<div class="fixed bottom-4 left-4 z-40">
			<button
				class="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm opacity-70 hover:opacity-100 transition-opacity"
				@click="isOpen = true"
			>
				<span class="px-1.5 py-0.5 bg-gray-700 rounded text-xs">?</span>
				<span>Keyboard shortcuts</span>
			</button>
		</div>

		<!-- Cheat Sheet Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
				@click.self="isOpen = false"
			>
				<div class="w-[800px] max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Keyboard Shortcuts
							</h3>
							<span class="text-xs text-gray-500">(Press ? anytime)</span>
						</div>
						<div class="flex items-center gap-4">
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search shortcuts..."
								class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm w-48"
							/>
							<button
								class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
								@click="isOpen = false"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Shortcuts Grid -->
					<div class="p-4 overflow-y-auto max-h-[60vh]">
						<div class="grid grid-cols-2 gap-6">
							<div
								v-for="category in filteredShortcuts"
								:key="category.category"
								class="space-y-2"
							>
								<h4 class="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">
									{{ category.category }}
								</h4>
								<div class="space-y-1">
									<div
										v-for="item in category.items"
										:key="item.action"
										class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										<div class="flex items-center gap-2">
											<span class="text-lg">{{ item.icon }}</span>
											<span class="text-sm text-gray-600 dark:text-gray-400">{{
												item.action
											}}</span>
										</div>
										<kbd
											class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono"
										>
											{{ item.key }}
										</kbd>
									</div>
								</div>
							</div>
						</div>

						<div
							v-if="filteredShortcuts.length === 0"
							class="text-center py-8 text-gray-500"
						>
							No shortcuts found matching "{{ searchQuery }}"
						</div>
					</div>

					<!-- Footer -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
						<p class="text-xs text-gray-500 text-center">
							Tip: You can customize these shortcuts in Settings > Keyboard
						</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
