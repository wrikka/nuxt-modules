<script setup lang="ts">
const isListening = ref(false);
const transcript = ref("");
const commands = [
	"Add text",
	"Insert image",
	"Change color",
	"Export",
	"Undo",
	"Redo",
	"Zoom in",
	"Zoom out",
];
const recent = ref(["Add text", "Undo"]);
</script>
<template>
	<div class="p-3 bg-white dark:bg-gray-800 rounded-lg border">
		<div class="flex items-center gap-2 mb-3">
			<button
				:class="[
					'p-2 rounded-full',
					isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-200',
				]"
				@click="isListening = !isListening"
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
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
					/>
				</svg>
			</button>
			<span class="text-sm">{{
				isListening ? "Listening..." : "Click to speak"
			}}</span>
		</div>
		<div class="text-xs text-gray-500 mb-2">
			Say: "Add text", "Undo", "Export"...
		</div>
		<div class="flex flex-wrap gap-1">
			<span
				v-for="cmd in commands"
				:key="cmd"
				class="px-2 py-1 bg-gray-100 rounded text-xs"
			>{{ cmd }}</span>
		</div>
	</div>
</template>
