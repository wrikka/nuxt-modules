<script setup lang="ts">
const props = defineProps<{
	projectName: string;
}>();

const emit = defineEmits<{
	duplicate: [options: DuplicateOptions];
	close: [];
}>();

interface DuplicateOptions {
	includeElements: boolean;
	includeComments: boolean;
	includeSettings: boolean;
	includeHistory: boolean;
}

const options = ref<DuplicateOptions>({
	includeElements: true,
	includeComments: false,
	includeSettings: true,
	includeHistory: false,
});
</script>

<template>
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/70" @click="emit('close')" />

		<!-- Modal -->
		<div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Duplicate "{{ projectName }}"
					</h2>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
						@click="emit('close')"
					>
						<svg
							class="w-5 h-5 text-gray-500"
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

				<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
					Choose what to include in the duplicate:
				</p>

				<div class="space-y-3">
					<label
						class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
					>
						<input
							v-model="options.includeElements"
							type="checkbox"
							class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-900 dark:text-white"
						>Include all elements & content</span>
					</label>
					<label
						class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
					>
						<input
							v-model="options.includeSettings"
							type="checkbox"
							class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-900 dark:text-white"
						>Include project settings</span>
					</label>
					<label
						class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
					>
						<input
							v-model="options.includeComments"
							type="checkbox"
							class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-900 dark:text-white">Include comments</span>
					</label>
					<label
						class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
					>
						<input
							v-model="options.includeHistory"
							type="checkbox"
							class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-900 dark:text-white"
						>Include version history</span>
					</label>
				</div>

				<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
					<button
						class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
						@click="emit('close')"
					>
						Cancel
					</button>
					<button
						class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
						@click="emit('duplicate', options)"
					>
						Duplicate
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
