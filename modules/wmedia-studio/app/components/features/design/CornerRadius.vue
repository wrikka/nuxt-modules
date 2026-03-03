<script setup lang="ts">
const corners = ["None", "Small", "Medium", "Large", "Circle"];
const selected = ref("Medium");
const topLeft = ref(true);
const topRight = ref(true);
const bottomLeft = ref(true);
const bottomRight = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Corner Radius</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="c in corners"
				:key="c"
				:class="[
					'px-2 py-1 rounded text-xs',
					selected === c ? 'bg-teal-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = c"
			>
				{{ c }}
			</button>
		</div>
		<div class="grid grid-cols-2 gap-1">
			<label class="flex items-center gap-1 text-xs"><input
					v-model="topLeft"
					type="checkbox"
				> TL</label>
			<label class="flex items-center gap-1 text-xs"><input
					v-model="topRight"
					type="checkbox"
				> TR</label>
			<label class="flex items-center gap-1 text-xs"><input
					v-model="bottomLeft"
					type="checkbox"
				> BL</label>
			<label class="flex items-center gap-1 text-xs"><input
					v-model="bottomRight"
					type="checkbox"
				> BR</label>
		</div>
	</div>
</template>
