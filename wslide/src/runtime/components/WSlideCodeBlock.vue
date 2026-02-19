<script setup lang="ts">
const props = defineProps<{
	code: string;
	language?: string;
	lineNumbers?: boolean;
	highlightLines?: number[];
}>();

const highlightedCode = computed(() => {
	// Simple syntax highlighting (in real implementation, use highlight.js or shiki)
	return props.code;
});

const lines = computed(() => props.code.split("\n"));
</script>

<template>
	<div class="relative group">
		<div class="bg-gray-900 rounded-lg overflow-hidden">
			<!-- Header with language -->
			<div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
				<span class="text-sm text-gray-400">{{ language || "text" }}</span>
				<button
					class="p-1.5 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
					@click="navigator.clipboard.writeText(code)"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
					</svg>
				</button>
			</div>

			<!-- Code content -->
			<div class="p-4 overflow-x-auto">
				<pre class="font-mono text-sm leading-relaxed"><code
					v-if="lineNumbers"
					class="grid"
					style="grid-template-columns: auto 1fr"
				><template
					v-for="(line, index) in lines"
					:key="index"
				><span
					class="text-gray-500 select-none pr-4 text-right"
					:class="{ 'bg-yellow-500/20 text-yellow-400': highlightLines?.includes(index + 1) }"
				>{{ index + 1 }}</span><span
					class="text-gray-300 whitespace-pre"
					:class="{ 'bg-yellow-500/20': highlightLines?.includes(index + 1) }"
				>{{ line || " " }}</span></template></code><code
					v-else
					class="text-gray-300 whitespace-pre"
				>{{ code }}</code></pre>
			</div>
		</div>
	</div>
</template>
