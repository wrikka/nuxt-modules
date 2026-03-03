<script setup lang="ts">
const isDodging = ref(false);
const type = ref("dodge");
const types = ["dodge", "burn", "sponge"];
const exposure = ref(50);
const range = ref("midtones");
const ranges = ["shadows", "midtones", "highlights"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Dodge & Burn</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="t in types"
				:key="t"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					type === t ? 'bg-amber-600 text-white' : 'bg-gray-100',
				]"
				@click="type = t"
			>
				{{ t }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Exposure: {{ exposure }}%</label>
			<input v-model="exposure" type="range" min="0" max="100" class="w-full">
		</div>
		<div class="flex gap-1 mb-2">
			<button
				v-for="r in ranges"
				:key="r"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					range === r ? 'bg-amber-200' : 'bg-gray-100',
				]"
				@click="range = r"
			>
				{{ r }}
			</button>
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isDodging ? 'bg-amber-600' : 'bg-gray-400',
			]"
			@click="isDodging = !isDodging"
		>
			{{ isDodging ? "✓ Active" : "Activate Tool" }}
		</button>
	</div>
</template>
