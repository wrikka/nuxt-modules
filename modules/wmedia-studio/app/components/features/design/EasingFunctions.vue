<script setup lang="ts">
const curves = ["Linear", "Ease", "EaseIn", "EaseOut", "EaseInOut", "Bounce"];
const selected = ref("Ease");
const duration = ref(300);
const delay = ref(0);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Easing Functions</h4>
		<div class="grid grid-cols-2 gap-1 mb-2">
			<button
				v-for="c in curves"
				:key="c"
				:class="[
					'py-1 rounded text-xs',
					selected === c ? 'bg-pink-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = c"
			>
				{{ c }}
			</button>
		</div>
		<div class="space-y-1 text-xs">
			<div class="flex justify-between items-center">
				<span>Duration: {{ duration }}ms</span>
				<input
					v-model="duration"
					type="range"
					min="0"
					max="2000"
					step="50"
					class="w-24"
				>
			</div>
			<div class="flex justify-between items-center">
				<span>Delay: {{ delay }}ms</span>
				<input
					v-model="delay"
					type="range"
					min="0"
					max="1000"
					step="50"
					class="w-24"
				>
			</div>
		</div>
	</div>
</template>
