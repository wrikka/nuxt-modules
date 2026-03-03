<script setup lang="ts">
const showShortcuts = ref(false);

const shortcuts = [
	{
		category: "General",
		items: [
			{ key: "Ctrl + S", action: "Save" },
			{ key: "Ctrl + Z", action: "Undo" },
			{ key: "Ctrl + Shift + Z", action: "Redo" },
			{ key: "Ctrl + C", action: "Copy" },
			{ key: "Ctrl + V", action: "Paste" },
			{ key: "Delete", action: "Delete" },
		],
	},
	{
		category: "Canvas",
		items: [
			{ key: "Space + Drag", action: "Pan" },
			{ key: "Ctrl + +", action: "Zoom In" },
			{ key: "Ctrl + -", action: "Zoom Out" },
			{ key: "Ctrl + 0", action: "Reset Zoom" },
		],
	},
	{
		category: "Selection",
		items: [
			{ key: "Ctrl + A", action: "Select All" },
			{ key: "Ctrl + D", action: "Duplicate" },
			{ key: "Ctrl + G", action: "Group" },
			{ key: "Ctrl + Shift + G", action: "Ungroup" },
			{ key: "Arrow Keys", action: "Nudge" },
			{ key: "Shift + Arrow", action: "Nudge 10px" },
		],
	},
	{
		category: "Layers",
		items: [
			{ key: "Ctrl + ]", action: "Bring Forward" },
			{ key: "Ctrl + [", action: "Send Backward" },
			{ key: "Ctrl + Shift + ]", action: "Bring to Front" },
			{ key: "Ctrl + Shift + [", action: "Send to Back" },
		],
	},
	{
		category: "Timeline",
		items: [
			{ key: "Space", action: "Play/Pause" },
			{ key: "J", action: "Previous Frame" },
			{ key: "K", action: "Next Frame" },
			{ key: "L", action: "Loop Playback" },
		],
	},
];
</script>

<template>
	<div>
		<button
			class="fixed right-4 top-68 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg transition-transform hover:scale-110"
			@click="showShortcuts = !showShortcuts"
			title="Keyboard Shortcuts"
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
				<rect width="20" height="16" x="2" y="4" rx="2" />
				<path d="M6 8h.01" />
				<path d="M10 8h.01" />
				<path d="M14 8h.01" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="scale-95 opacity-0"
			enter-to-class="scale-100 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="scale-100 opacity-100"
			leave-to-class="scale-95 opacity-0"
		>
			<div
				v-if="showShortcuts"
				class="fixed left-1/2 top-1/2 z-50 w-[600px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gray-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Keyboard Shortcuts</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showShortcuts = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
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

				<div class="max-h-[60vh] overflow-y-auto p-6">
					<div class="grid grid-cols-2 gap-6">
						<div v-for="category in shortcuts" :key="category.category">
							<h3 class="mb-3 text-sm font-bold text-gray-900 dark:text-white">
								{{ category.category }}
							</h3>
							<div class="space-y-2">
								<div
									v-for="item in category.items"
									:key="item.key"
									class="flex items-center justify-between"
								>
									<span class="text-sm text-gray-600 dark:text-gray-400">{{
										item.action
									}}</span>
									<kbd
										class="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-300"
									>{{ item.key }}</kbd>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
