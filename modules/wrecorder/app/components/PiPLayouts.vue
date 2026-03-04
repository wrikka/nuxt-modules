<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue: string;
	}>(),
	{
		modelValue: "bottom-right",
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const layouts = [
	{
		id: "bottom-right",
		name: "Bottom Right",
		icon: "mdi:picture-in-picture-bottom-right",
		desc: "Camera in bottom right corner",
	},
	{
		id: "bottom-left",
		name: "Bottom Left",
		icon: "mdi:picture-in-picture-bottom-left",
		desc: "Camera in bottom left corner",
	},
	{
		id: "top-right",
		name: "Top Right",
		icon: "mdi:picture-in-picture-top-right",
		desc: "Camera in top right corner",
	},
	{
		id: "top-left",
		name: "Top Left",
		icon: "mdi:picture-in-picture-top-left",
		desc: "Camera in top left corner",
	},
	{
		id: "side-by-side",
		name: "Side by Side",
		icon: "mdi:view-agenda-outline",
		desc: "Split screen 50/50",
	},
	{
		id: "fullscreen-cam",
		name: "Fullscreen + Small Screen",
		icon: "mdi:fullscreen",
		desc: "Camera main, screen small",
	},
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
			Picture-in-Picture Layout
		</h3>

		<div class="grid grid-cols-2 gap-3">
			<button
				v-for="layout in layouts"
				:key="layout.id"
				:class="[
					'p-4 rounded-lg border-2 text-left transition-all',
					props.modelValue === layout.id
						? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
						: 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700',
				]"
				@click="emit('update:modelValue', layout.id)"
			>
				<span
					:class="[
						layout.icon,
						'w-8 h-8 mb-2',
						props.modelValue === layout.id
							? 'text-purple-500'
							: 'text-gray-400',
					]"
				/>
				<p class="font-medium text-gray-900 dark:text-white text-sm">
					{{ layout.name }}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
					{{ layout.desc }}
				</p>
			</button>
		</div>
	</div>
</template>
