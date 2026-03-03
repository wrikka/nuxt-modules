<script setup lang="ts">
interface ColorItem {
	id: number;
	hex: string;
	name: string;
	pantone: string;
	cmyk: string;
}

const isScanning = ref(false);
const colors = ref<ColorItem[]>([
	{
		id: 1,
		hex: "#FF6B6B",
		name: "Coral",
		pantone: "16-1546",
		cmyk: "0,50,50,0",
	},
	{
		id: 2,
		hex: "#4ECDC4",
		name: "Turquoise",
		pantone: "15-5519",
		cmyk: "60,0,10,0",
	},
]);
const selectedColor = ref<ColorItem | null>(null);
const colorMode = ref<"hex" | "rgb" | "hsl" | "cmyk" | "pantone">("hex");
const modes = ["hex", "rgb", "hsl", "cmyk", "pantone"] as const;
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Color Scanner</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs uppercase',
					colorMode === m ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="colorMode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="space-y-1 mb-2 max-h-32 overflow-y-auto">
			<div
				v-for="c in colors"
				:key="c.id"
				class="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs cursor-pointer"
				@click="selectedColor = c"
			>
				<div class="w-6 h-6 rounded border" :style="{ background: c.hex }">
				</div>
				<div class="flex-1">
					<div class="font-medium">{{ c.name }}</div>
					<div class="text-gray-500">{{ c[colorMode as keyof ColorItem] }}</div>
				</div>
			</div>
		</div>
		<button
			:disabled="isScanning"
			class="w-full py-2 bg-blue-600 text-white rounded text-sm"
			@click="isScanning = true"
		>
			{{ isScanning ? "Scanning..." : "🎨 Scan Colors" }}
		</button>
	</div>
</template>
