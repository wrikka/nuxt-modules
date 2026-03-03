<script setup lang="ts">
const isRestoring = ref(false);
const damageType = ref("scratches");
const types = ["scratches", "dust", "tears", "fading", "noise"];
const intensity = ref(50);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Photo Restorer</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="t in types"
				:key="t"
				:class="[
					'px-2 py-1 rounded text-xs capitalize',
					damageType === t ? 'bg-amber-600 text-white' : 'bg-gray-100',
				]"
				@click="damageType = t"
			>
				{{ t }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Restoration: {{ intensity }}%</label>
			<input v-model="intensity" type="range" min="0" max="100" class="w-full">
		</div>
		<button
			:disabled="isRestoring"
			class="w-full py-2 bg-amber-600 text-white rounded text-sm"
			@click="isRestoring = true"
		>
			{{ isRestoring ? "Restoring..." : "🖼️ Restore Photo" }}
		</button>
	</div>
</template>
