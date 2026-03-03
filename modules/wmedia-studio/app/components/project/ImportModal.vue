<script setup lang="ts">
const emit = defineEmits<{
	import: [type: string];
	close: [];
}>();

const importOptions = [
	{
		id: "figma",
		name: "Figma",
		icon: "🎨",
		description: "Import from Figma file or URL",
	},
	{
		id: "canva",
		name: "Canva",
		icon: "🖼️",
		description: "Import Canva designs",
	},
	{
		id: "sketch",
		name: "Sketch",
		icon: "📝",
		description: "Import Sketch files (.sketch)",
	},
	{
		id: "adobe",
		name: "Adobe XD",
		icon: "🎯",
		description: "Import Adobe XD files",
	},
	{
		id: "json",
		name: "JSON/Backup",
		icon: "📦",
		description: "Import from project backup",
	},
];
</script>

<template>
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/70" @click="emit('close')" />

		<!-- Modal -->
		<div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Import Project
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

				<div class="space-y-3">
					<button
						v-for="option in importOptions"
						:key="option.id"
						class="w-full p-4 flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
						@click="emit('import', option.id)"
					>
						<span class="text-3xl">{{ option.icon }}</span>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								{{ option.name }}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{{ option.description }}
							</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
