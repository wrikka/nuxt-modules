<script setup lang="ts">
const emit = defineEmits<{
	(
		e: "distribute",
		direction: "horizontal" | "vertical",
		method: "space-evenly" | "start" | "center" | "end",
	): void;
	(
		e: "align",
		method:
			| "left"
			| "center"
			| "right"
			| "top"
			| "middle"
			| "bottom"
			| "distribute-h"
			| "distribute-v",
	): void;
}>();
</script>

<template>
	<div class="space-y-3">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>Distribute Objects</label>

		<div class="grid grid-cols-2 gap-2">
			<button
				type="button"
				class="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
				@click="$emit('align', 'distribute-h')"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<rect x="2" y="6" width="4" height="12" stroke-width="2" />
					<rect x="10" y="6" width="4" height="12" stroke-width="2" />
					<rect x="18" y="6" width="4" height="12" stroke-width="2" />
				</svg>
				<span class="text-xs">H-Even</span>
			</button>
			<button
				type="button"
				class="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
				@click="$emit('align', 'distribute-v')"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<rect x="6" y="2" width="12" height="4" stroke-width="2" />
					<rect x="6" y="10" width="12" height="4" stroke-width="2" />
					<rect x="6" y="18" width="12" height="4" stroke-width="2" />
				</svg>
				<span class="text-xs">V-Even</span>
			</button>
		</div>

		<div class="border-t border-gray-200 dark:border-gray-700 pt-2">
			<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
			>Horizontal Distribute</label>
			<div class="grid grid-cols-4 gap-1">
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Space Evenly"
					@click="$emit('distribute', 'horizontal', 'space-evenly')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="2" y="8" width="3" height="8" stroke-width="2" />
						<rect x="10.5" y="8" width="3" height="8" stroke-width="2" />
						<rect x="19" y="8" width="3" height="8" stroke-width="2" />
					</svg>
				</button>
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Align to Start"
					@click="$emit('distribute', 'horizontal', 'start')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="2" y="8" width="3" height="8" stroke-width="2" />
						<rect x="6" y="8" width="3" height="8" stroke-width="2" />
						<rect x="10" y="8" width="3" height="8" stroke-width="2" />
					</svg>
				</button>
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Align to Center"
					@click="$emit('distribute', 'horizontal', 'center')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="6" y="8" width="3" height="8" stroke-width="2" />
						<rect x="10.5" y="8" width="3" height="8" stroke-width="2" />
						<rect x="15" y="8" width="3" height="8" stroke-width="2" />
					</svg>
				</button>
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Align to End"
					@click="$emit('distribute', 'horizontal', 'end')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="11" y="8" width="3" height="8" stroke-width="2" />
						<rect x="15" y="8" width="3" height="8" stroke-width="2" />
						<rect x="19" y="8" width="3" height="8" stroke-width="2" />
					</svg>
				</button>
			</div>
		</div>

		<div class="border-t border-gray-200 dark:border-gray-700 pt-2">
			<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
			>Vertical Distribute</label>
			<div class="grid grid-cols-4 gap-1">
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Space Evenly"
					@click="$emit('distribute', 'vertical', 'space-evenly')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="8" y="2" width="8" height="3" stroke-width="2" />
						<rect x="8" y="10.5" width="8" height="3" stroke-width="2" />
						<rect x="8" y="19" width="8" height="3" stroke-width="2" />
					</svg>
				</button>
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Align to Top"
					@click="$emit('distribute', 'vertical', 'start')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="8" y="2" width="8" height="3" stroke-width="2" />
						<rect x="8" y="6" width="8" height="3" stroke-width="2" />
						<rect x="8" y="10" width="8" height="3" stroke-width="2" />
					</svg>
				</button>
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Align to Middle"
					@click="$emit('distribute', 'vertical', 'center')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="8" y="6" width="8" height="3" stroke-width="2" />
						<rect x="8" y="10.5" width="8" height="3" stroke-width="2" />
						<rect x="8" y="15" width="8" height="3" stroke-width="2" />
					</svg>
				</button>
				<button
					type="button"
					class="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					title="Align to Bottom"
					@click="$emit('distribute', 'vertical', 'end')"
				>
					<svg
						class="w-4 h-4 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="8" y="11" width="8" height="3" stroke-width="2" />
						<rect x="8" y="15" width="8" height="3" stroke-width="2" />
						<rect x="8" y="19" width="8" height="3" stroke-width="2" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
