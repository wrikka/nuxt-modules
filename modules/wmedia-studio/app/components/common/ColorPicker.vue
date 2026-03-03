<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	initialColor?: string;
}>();

const emit = defineEmits<{
	close: [];
	select: [color: string];
}>();

const colors = [
	[
		"#ef4444",
		"#f97316",
		"#f59e0b",
		"#eab308",
		"#84cc16",
		"#22c55e",
		"#10b981",
		"#14b8a6",
	],
	[
		"#06b6d4",
		"#0ea5e9",
		"#3b82f6",
		"#6366f1",
		"#8b5cf6",
		"#a855f7",
		"#d946ef",
		"#ec4899",
	],
	[
		"#f43f5e",
		"#000000",
		"#ffffff",
		"#78716c",
		"#525252",
		"#404040",
		"#262626",
		"#171717",
	],
];

const customColor = ref(props.initialColor || "#3b82f6");
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl p-4 w-full max-w-xs shadow-2xl">
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Pick a Color
				</h3>
				<button
					@click="emit('close')"
					class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<!-- Color Grid -->
			<div class="space-y-2">
				<div
					v-for="(row, i) in colors"
					:key="i"
					class="flex gap-2 justify-center"
				>
					<button
						v-for="color in row"
						:key="color"
						@click='emit("select", color);
						emit("close");'
						:class="[
							'w-8 h-8 rounded-lg border-2 border-transparent hover:scale-110 transition-transform',
							customColor === color && 'border-gray-900 dark:border-white',
						]"
						:style="{ backgroundColor: color }"
					/>
				</div>
			</div>

			<!-- Custom Color -->
			<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<label class="text-xs text-gray-500 mb-1 block">Custom</label>
				<div class="flex gap-2">
					<input
						v-model="customColor"
						type="color"
						class="w-10 h-10 rounded cursor-pointer"
					/>
					<input
						v-model="customColor"
						type="text"
						class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm"
						placeholder="#000000"
					/>
					<button
						@click='emit("select", customColor);
						emit("close");'
						class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
