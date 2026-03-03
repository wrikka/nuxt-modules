<script setup lang="ts">
const isBracketing = ref(false);
const frames = ref(3);
const stops = ref(1);
const mode = ref("exposure");
const modes = ["exposure", "focus", "flash", "white-balance"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Focus Bracketing</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-teal-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m.replace("-", " ") }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Frames: {{ frames }}</label>
			<input v-model="frames" type="range" min="2" max="10" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Stops: {{ stops }}</label>
			<input
				v-model="stops"
				type="range"
				min="0.5"
				max="3"
				step="0.5"
				class="w-full"
			>
		</div>
		<button
			:disabled="isBracketing"
			class="w-full py-2 bg-teal-600 text-white rounded text-sm"
			@click="isBracketing = true"
		>
			{{ isBracketing ? "Capturing..." : "📸 Start Bracket" }}
		</button>
	</div>
</template>
