<script setup lang="ts">
interface Template {
	id: string;
	name: string;
	description: string;
	icon: string;
	objects: any[];
}

interface Props {
	isOpen: boolean;
}

defineProps<Props>();

defineEmits<{
	close: [];
	select: [template: Template];
}>();

const templates: Template[] = [
	{
		id: "blank",
		name: "Blank Canvas",
		description: "Start with a blank canvas",
		icon: "📄",
		objects: [],
	},
	{
		id: "social-post",
		name: "Social Post",
		description: "Instagram/Facebook post template",
		icon: "📱",
		objects: [
			{
				type: "rect",
				left: 0,
				top: 0,
				width: 1080,
				height: 1080,
				fill: "#667eea",
			},
			{
				type: "textbox",
				left: 540,
				top: 400,
				width: 800,
				text: "Your Headline Here",
				fontSize: 72,
				fontFamily: "Inter",
				fill: "#ffffff",
				textAlign: "center",
			},
		],
	},
	{
		id: "banner",
		name: "Banner",
		description: "Web banner template",
		icon: "🎨",
		objects: [
			{
				type: "rect",
				left: 0,
				top: 0,
				width: 1920,
				height: 600,
				fill: "#f093fb",
			},
			{
				type: "rect",
				left: 0,
				top: 0,
				width: 1920,
				height: 600,
				fill: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
			},
			{
				type: "textbox",
				left: 960,
				top: 250,
				width: 1200,
				text: "Your Banner Text",
				fontSize: 96,
				fontFamily: "Inter",
				fill: "#ffffff",
				textAlign: "center",
			},
		],
	},
];
</script>

<template>
	<Modal :show="isOpen" size="lg" @close="$emit('close')">
		<template #title>Choose Template</template>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<button
				v-for="template in templates"
				:key="template.id"
				class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
				@click="$emit('select', template)"
			>
				<div class="text-4xl mb-2">{{ template.icon }}</div>
				<h3 class="font-medium text-gray-900 dark:text-white">
					{{ template.name }}
				</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{{ template.description }}
				</p>
			</button>
		</div>
	</Modal>
</template>
