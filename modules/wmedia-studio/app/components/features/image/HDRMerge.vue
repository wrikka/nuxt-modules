<script setup lang="ts">
const isMerging = ref(false);
const photos = ref([
	{ id: 1, exposure: "dark", file: "IMG_001.jpg" },
	{ id: 2, exposure: "normal", file: "IMG_002.jpg" },
	{ id: 3, exposure: "bright", file: "IMG_003.jpg" },
]);
const ghostRemoval = ref(true);
const alignImages = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">HDR Merge</h4>
		<div class="space-y-1 mb-2">
			<div
				v-for="p in photos"
				:key="p.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span>{{ p.file }}</span>
				<span
					:class="[
						'px-1.5 rounded',
						p.exposure === 'dark'
							? 'bg-gray-300'
							: p.exposure === 'bright'
							? 'bg-yellow-200'
							: 'bg-green-100',
					]"
				>{{ p.exposure }}</span>
			</div>
		</div>
		<label class="flex items-center gap-2 text-xs mb-1">
			<input v-model="ghostRemoval" type="checkbox"> Ghost removal
		</label>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="alignImages" type="checkbox"> Auto align
		</label>
		<button
			:disabled="isMerging"
			class="w-full py-2 bg-yellow-600 text-white rounded text-sm"
			@click="isMerging = true"
		>
			{{ isMerging ? "Merging..." : "✨ Merge HDR" }}
		</button>
	</div>
</template>
