<script setup lang="ts">
const items = ref([
	{ name: "Layer 1", visible: true, locked: false },
	{ name: "Layer 2", visible: true, locked: true },
	{ name: "Layer 3", visible: false, locked: false },
]);
const selectedIndex = ref(0);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Layer Manager</h4>
		<div class="space-y-1">
			<div
				v-for="(item, i) in items"
				:key="i"
				:class="[
					'flex items-center justify-between p-2 rounded text-xs',
					selectedIndex === i ? 'bg-blue-100' : 'bg-gray-50',
				]"
				@click="selectedIndex = i"
			>
				<span>{{ item.name }}</span>
				<div class="flex gap-1">
					<button
						:class="['p-1', item.visible ? 'text-blue-600' : 'text-gray-300']"
						@click.stop="item.visible = !item.visible"
					>
						👁
					</button>
					<button
						:class="['p-1', item.locked ? 'text-red-600' : 'text-gray-300']"
						@click.stop="item.locked = !item.locked"
					>
						🔒
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
