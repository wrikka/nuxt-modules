<script setup lang="ts">
import type { ComponentCategory, ComponentItem } from "#shared/types";

interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	selectComponent: [component: ComponentItem];
}>();

const searchQuery = ref("");
const selectedCategory = ref<string>("all");

const categories: ComponentCategory[] = [
	{ id: "all", name: "ทั้งหมด", icon: "mdi:view-grid" },
	{ id: "buttons", name: "Buttons", icon: "mdi:cursor-pointer" },
	{ id: "cards", name: "Cards", icon: "mdi:card-outline" },
	{ id: "forms", name: "Forms", icon: "mdi:form-textbox" },
	{ id: "navigation", name: "Navigation", icon: "mdi:menu" },
	{ id: "typography", name: "Typography", icon: "mdi:format-text" },
	{ id: "media", name: "Media", icon: "mdi:image" },
	{ id: "layout", name: "Layout", icon: "mdi:view-dashboard" },
];

const components: ComponentItem[] = [
	{
		id: "btn-primary",
		name: "Primary Button",
		category: "buttons",
		preview: "🔘",
		tags: ["button", "cta", "action"],
		properties: { variant: "primary", size: "md" },
	},
	{
		id: "btn-secondary",
		name: "Secondary Button",
		category: "buttons",
		preview: "🔘",
		tags: ["button", "outline", "subtle"],
		properties: { variant: "secondary", size: "md" },
	},
	{
		id: "btn-ghost",
		name: "Ghost Button",
		category: "buttons",
		preview: "👻",
		tags: ["button", "minimal", "subtle"],
		properties: { variant: "ghost", size: "md" },
	},
	{
		id: "card-basic",
		name: "Basic Card",
		category: "cards",
		preview: "🃏",
		tags: ["card", "container", "content"],
		properties: { padding: "md", shadow: "sm" },
	},
	{
		id: "card-media",
		name: "Media Card",
		category: "cards",
		preview: "🖼️",
		tags: ["card", "image", "media"],
		properties: { hasImage: true, layout: "vertical" },
	},
	{
		id: "card-profile",
		name: "Profile Card",
		category: "cards",
		preview: "👤",
		tags: ["card", "avatar", "profile"],
		properties: { hasAvatar: true, hasBio: true },
	},
	{
		id: "input-text",
		name: "Text Input",
		category: "forms",
		preview: "📝",
		tags: ["input", "text", "form"],
		properties: { type: "text", placeholder: "Enter text..." },
	},
	{
		id: "input-search",
		name: "Search Input",
		category: "forms",
		preview: "🔍",
		tags: ["input", "search", "form"],
		properties: { type: "search", hasIcon: true },
	},
	{
		id: "input-textarea",
		name: "Textarea",
		category: "forms",
		preview: "📄",
		tags: ["textarea", "multiline", "form"],
		properties: { rows: 4, resize: "vertical" },
	},
	{
		id: "nav-horizontal",
		name: "Horizontal Nav",
		category: "navigation",
		preview: "➡️",
		tags: ["nav", "menu", "horizontal"],
		properties: { direction: "horizontal", items: 5 },
	},
	{
		id: "nav-sidebar",
		name: "Sidebar Nav",
		category: "navigation",
		preview: "📋",
		tags: ["nav", "sidebar", "vertical"],
		properties: { direction: "vertical", collapsible: true },
	},
	{
		id: "heading-1",
		name: "Heading 1",
		category: "typography",
		preview: "H1",
		tags: ["heading", "title", "large"],
		properties: { level: 1, size: "4xl", weight: "bold" },
	},
	{
		id: "heading-2",
		name: "Heading 2",
		category: "typography",
		preview: "H2",
		tags: ["heading", "subtitle", "medium"],
		properties: { level: 2, size: "2xl", weight: "semibold" },
	},
	{
		id: "text-body",
		name: "Body Text",
		category: "typography",
		preview: "¶",
		tags: ["text", "body", "paragraph"],
		properties: { size: "base", lineHeight: "relaxed" },
	},
	{
		id: "image-placeholder",
		name: "Image Placeholder",
		category: "media",
		preview: "🖼️",
		tags: ["image", "placeholder", "media"],
		properties: { ratio: "16:9", fit: "cover" },
	},
	{
		id: "video-player",
		name: "Video Player",
		category: "media",
		preview: "🎬",
		tags: ["video", "player", "media"],
		properties: { controls: true, autoplay: false },
	},
	{
		id: "grid-2col",
		name: "2-Column Grid",
		category: "layout",
		preview: "⏹️⏹️",
		tags: ["grid", "2-col", "layout"],
		properties: { columns: 2, gap: "md" },
	},
	{
		id: "grid-3col",
		name: "3-Column Grid",
		category: "layout",
		preview: "⏹️⏹️⏹️",
		tags: ["grid", "3-col", "layout"],
		properties: { columns: 3, gap: "md" },
	},
	{
		id: "flex-row",
		name: "Flex Row",
		category: "layout",
		preview: "— — —",
		tags: ["flex", "row", "horizontal"],
		properties: { direction: "row", justify: "start", align: "center" },
	},
	{
		id: "flex-column",
		name: "Flex Column",
		category: "layout",
		preview: "| | |",
		tags: ["flex", "column", "vertical"],
		properties: { direction: "column", justify: "start", align: "stretch" },
	},
];

const filteredComponents = computed(() => {
	let filtered = components;

	if (selectedCategory.value !== "all") {
		filtered = filtered.filter(c => c.category === selectedCategory.value);
	}

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(c =>
			c.name.toLowerCase().includes(query)
			|| c.tags.some((t: string) => t.toLowerCase().includes(query))
		);
	}

	return filtered;
});

const handleDragStart = (component: ComponentItem, event: DragEvent) => {
	event.dataTransfer?.setData("application/json", JSON.stringify(component));
	event.dataTransfer!.effectAllowed = "copy";
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed left-16 top-16 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-30"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<Icon name="mdi:view-module" class="w-5 h-5 text-blue-500" />
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Component Library
				</h3>
			</div>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<!-- Search -->
		<div class="p-3 border-b border-gray-200 dark:border-gray-700">
			<div class="relative">
				<Icon
					name="mdi:magnify"
					class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
				/>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="ค้นหา components..."
					class="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
				>
			</div>
		</div>

		<!-- Categories -->
		<div class="flex gap-1 p-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
			<button
				v-for="category in categories"
				:key="category.id"
				:class="[
					'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors',
					selectedCategory === category.id
						? 'bg-blue-500 text-white'
						: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
				]"
				@click="selectedCategory = category.id"
			>
				<Icon :name="category.icon" class="w-3.5 h-3.5" />
				{{ category.name }}
			</button>
		</div>

		<!-- Components Grid -->
		<div class="flex-1 overflow-y-auto p-3">
			<div class="grid grid-cols-2 gap-2">
				<div
					v-for="component in filteredComponents"
					:key="component.id"
					draggable="true"
					class="group bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg p-3 cursor-move transition-all"
					@dragstart="handleDragStart(component, $event)"
					@click="emit('selectComponent', component)"
				>
					<div class="text-2xl mb-2 text-center">{{ component.preview }}</div>
					<p class="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate">
						{{ component.name }}
					</p>
					<div class="flex flex-wrap gap-1 mt-2 justify-center">
						<span
							v-for="tag in component.tags.slice(0, 2)"
							:key="tag"
							class="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded"
						>
							{{ tag }}
						</span>
					</div>
				</div>
			</div>

			<!-- Empty State -->
			<div v-if="filteredComponents.length === 0" class="text-center py-8">
				<Icon
					name="mdi:magnify-close"
					class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
				/>
				<p class="text-sm text-gray-500 dark:text-gray-400">ไม่พบ components</p>
			</div>
		</div>

		<!-- Footer -->
		<div class="p-3 border-t border-gray-200 dark:border-gray-700">
			<button class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
				<Icon name="mdi:plus" class="w-4 h-4" />
				สร้าง Component ใหม่
			</button>
		</div>
	</div>
</template>
