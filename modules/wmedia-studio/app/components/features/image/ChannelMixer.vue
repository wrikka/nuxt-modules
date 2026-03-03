<script setup lang="ts">
const channels = ref({
	red: true,
	green: true,
	blue: true,
	alpha: true,
});
const activeChannel = ref("RGB");
const channels_list = ["RGB", "Red", "Green", "Blue", "Alpha"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Channel Mixer</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="c in channels_list"
				:key="c"
				:class="[
					'px-2 py-1 rounded text-xs',
					activeChannel === c ? 'bg-gray-800 text-white' : 'bg-gray-100',
				]"
				@click="activeChannel = c"
			>
				{{ c }}
			</button>
		</div>
		<div class="space-y-1">
			<label
				v-for="(active, name) in channels"
				:key="name"
				class="flex items-center gap-2 text-xs p-1 hover:bg-gray-50 rounded"
			>
				<input v-model="channels[name]" type="checkbox"> {{
					name.charAt(0).toUpperCase() + name.slice(1)
				}} Channel
			</label>
		</div>
	</div>
</template>
