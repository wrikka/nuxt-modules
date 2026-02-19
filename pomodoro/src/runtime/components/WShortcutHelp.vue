<script setup lang="ts">
import { useKeyboardShortcuts } from "#pomodoro"

const props = defineProps<{
	onStartPause: () => void
	onReset: () => void
	onSkip: () => void
	onFocusToggle: () => void
	onMiniToggle: () => void
}>()

const emit = defineEmits<{
	close: []
}>()

const { shortcuts } = useKeyboardShortcuts(
	props.onStartPause,
	props.onReset,
	props.onSkip,
	props.onFocusToggle,
	props.onMiniToggle,
	() => emit("close"),
)
</script>

<template>
	<Teleport to="body">
		<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
			<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold">Keyboard Shortcuts</h3>
					<button
						class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="space-y-2">
					<div
						v-for="shortcut in shortcuts"
						:key="shortcut.key"
						class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						<span class="text-sm text-gray-600 dark:text-gray-400">{{ shortcut.description }}</span>
						<kbd class="rounded bg-gray-200 px-2 py-1 text-sm font-medium dark:bg-gray-600">
							{{ shortcut.key }}
						</kbd>
					</div>
				</div>

				<p class="mt-4 text-center text-xs text-gray-500">
					Press ? to toggle this help
				</p>
			</div>
		</div>
	</Teleport>
</template>
