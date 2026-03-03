<script setup lang="ts">
const alignments = ["Left", "Center", "Right", "Justify"];
const selected = ref("Left");
const lineHeight = ref(1.5);
const letterSpacing = ref(0);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Text Spacing</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="a in alignments"
				:key="a"
				:class="[
					'flex-1 py-1 rounded text-xs',
					selected === a ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = a"
			>
				{{ a[0] }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Line Height: {{ lineHeight }}</label>
		<input
			v-model="lineHeight"
			type="range"
			min="0.8"
			max="3"
			step="0.1"
			class="w-full mb-1"
		>
		<label class="text-xs text-gray-500"
		>Letter Spacing: {{ letterSpacing }}px</label>
		<input
			v-model="letterSpacing"
			type="range"
			min="-2"
			max="10"
			class="w-full"
		>
	</div>
</template>
