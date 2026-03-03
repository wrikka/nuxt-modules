<script setup lang="ts">
export interface SlideTemplate {
	id: string;
	name: string;
	layout: "title" | "content" | "split" | "grid" | "blank";
	preview?: string;
}

const props = defineProps<{
	templates?: SlideTemplate[];
}>();

const emit = defineEmits<{
	select: [template: SlideTemplate];
}>();

const isOpen = ref(false);

const defaultTemplates: SlideTemplate[] = [
	{
		id: "title",
		name: "Title Slide",
		layout: "title",
		preview: "h1",
	},
	{
		id: "content",
		name: "Content",
		layout: "content",
		preview: "h2 + p",
	},
	{
		id: "split",
		name: "Two Columns",
		layout: "split",
		preview: "◫",
	},
	{
		id: "grid",
		name: "Grid",
		layout: "grid",
		preview: "▦",
	},
	{
		id: "blank",
		name: "Blank",
		layout: "blank",
		preview: "▭",
	},
];

const allTemplates = computed(() => props.templates || defaultTemplates);

function selectTemplate(template: SlideTemplate) {
	emit("select", template);
	isOpen.value = false;
}
</script>

<template>
	<div class="relative">
		<button
			class="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
			@click="isOpen = !isOpen"
			title="Slide Templates"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="3" y="3" width="7" height="7" />
				<rect x="14" y="3" width="7" height="7" />
				<rect x="14" y="14" width="7" height="7" />
				<rect x="3" y="14" width="7" height="7" />
			</svg>
			<span class="text-sm">Templates</span>
		</button>

		<div
			v-if="isOpen"
			class="absolute bottom-full mb-2 left-0 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-3 min-w-[200px] z-50"
		>
			<div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Choose Template</div>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="template in allTemplates"
					:key="template.id"
					class="p-3 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all text-center"
					@click="selectTemplate(template)"
				>
					<div class="text-2xl mb-1 text-gray-300">{{ template.preview }}</div>
					<div class="text-xs text-gray-400">{{ template.name }}</div>
				</button>
			</div>
		</div>
	</div>
</template>
