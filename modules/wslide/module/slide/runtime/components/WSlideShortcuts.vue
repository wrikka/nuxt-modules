<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

const shortcuts = [
	{ key: "→ ↓ Space", action: "Next slide" },
	{ key: "← ↑", action: "Previous slide" },
	{ key: "Home", action: "First slide" },
	{ key: "End", action: "Last slide" },
	{ key: "O", action: "Toggle overview" },
	{ key: "T", action: "Start/stop timer" },
	{ key: "S", action: "Toggle spotlight" },
	{ key: "L", action: "Toggle laser pointer" },
	{ key: "D", action: "Toggle drawing" },
	{ key: "A", action: "Toggle autoplay" },
	{ key: "R", action: "Start/stop recording" },
	{ key: "0", action: "Reset zoom" },
	{ key: "? / H", action: "Show shortcuts" },
	{ key: "Escape", action: "Close/cancel" },
];
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-all duration-300"
			leave-active-class="transition-all duration-300"
			enter-from-class="opacity-0 scale-95"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
				@click.self="emit('close')"
			>
				<div class="bg-gray-900 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-bold text-white">Keyboard Shortcuts</h2>
						<button
							class="p-2 text-gray-400 hover:text-white transition-colors"
							@click="emit('close')"
						>
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
					</div>

					<div class="grid gap-2">
						<div
							v-for="shortcut in shortcuts"
							:key="shortcut.key"
							class="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
						>
							<span class="text-gray-300">{{ shortcut.action }}</span>
							<kbd
								class="px-2 py-1 bg-gray-800 text-white text-sm rounded font-mono min-w-[100px] text-center"
							>
								{{ shortcut.key }}
							</kbd>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
