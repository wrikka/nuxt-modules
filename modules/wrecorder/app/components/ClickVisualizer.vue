<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const threshold = defineModel<number>("threshold", { default: 30 });
const visualStyle = defineModel<"ripple" | "circle" | "highlight">(
	"visualStyle",
	{ default: "ripple" },
);

const styles: Array<
	{
		id: "ripple" | "circle" | "highlight";
		name: string;
		icon: string;
		desc: string;
	}
> = [
	{
		id: "ripple",
		name: "Ripple",
		icon: "mdi:signal-distance-variant",
		desc: "Expanding circle effect",
	},
	{
		id: "circle",
		name: "Circle",
		icon: "mdi:checkbox-blank-circle-outline",
		desc: "Simple circle around cursor",
	},
	{
		id: "highlight",
		name: "Highlight",
		icon: "mdi:cursor-pointer",
		desc: "Cursor highlight effect",
	},
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Mouse Click Visualizer
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="enabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="enabled" class="space-y-3">
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="style in styles"
					:key="style.id"
					:class="[
						'p-2 rounded-lg border text-center transition-all',
						visualStyle === style.id
							? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
							: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
					]"
					@click="visualStyle = style.id"
				>
					<Icon
						:name="style.icon"
						class="w-5 h-5 mx-auto mb-1"
						:class="visualStyle === style.id ? 'text-purple-500' : 'text-gray-400'"
					/>
					<p class="text-xs font-medium text-gray-900 dark:text-white">
						{{ style.name }}
					</p>
				</button>
			</div>

			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Effect Size: {{ threshold }}px</label>
				<input
					v-model.number="threshold"
					type="range"
					min="10"
					max="100"
					class="w-full"
				/>
			</div>
		</div>
	</div>
</template>
