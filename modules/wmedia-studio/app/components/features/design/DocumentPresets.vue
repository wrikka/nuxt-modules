<script setup lang="ts">
const presets = ["Web", "Print", "Mobile", "Social"] as const;
const selected = ref<typeof presets[number]>("Web");
const presets_list = {
	Web: { width: 1920, height: 1080, dpi: 72 },
	Print: { width: 2480, height: 3508, dpi: 300 },
	Mobile: { width: 375, height: 812, dpi: 72 },
	Social: { width: 1080, height: 1080, dpi: 72 },
};
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Document Presets</h4>
		<div class="space-y-1 mb-2">
			<button
				v-for="p in presets"
				:key="p"
				:class="[
					'w-full py-2 rounded text-xs text-left px-3',
					selected === p ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = p"
			>
				<div class="font-medium">{{ p }}</div>
				<div class="opacity-75 text-[10px]">
					{{ presets_list[p].width }}×{{ presets_list[p].height }} @ {{
						presets_list[p].dpi
					}}dpi
				</div>
			</button>
		</div>
	</div>
</template>
