<script setup lang="ts">
const isOpen = ref(false);
const selectedCategory = ref("all");

const categories = [
	{ id: "all", name: "All Components", icon: "📦" },
	{ id: "buttons", name: "Buttons", icon: "🔘" },
	{ id: "cards", name: "Cards", icon: "🃏" },
	{ id: "forms", name: "Forms", icon: "📝" },
	{ id: "navigation", name: "Navigation", icon: "🧭" },
];

const components = ref([
	{ id: 1, name: "Primary Button", category: "buttons", icon: "🔘", usage: 24 },
	{
		id: 2,
		name: "Secondary Button",
		category: "buttons",
		icon: "⚪",
		usage: 18,
	},
	{ id: 3, name: "Card Default", category: "cards", icon: "🃏", usage: 12 },
	{ id: 4, name: "Card Image", category: "cards", icon: "🖼️", usage: 8 },
	{ id: 5, name: "Text Input", category: "forms", icon: "📝", usage: 15 },
	{ id: 6, name: "Dropdown", category: "forms", icon: "📋", usage: 6 },
	{ id: 7, name: "Navbar", category: "navigation", icon: "🧭", usage: 3 },
	{ id: 8, name: "Tab Bar", category: "navigation", icon: "📑", usage: 5 },
]);

const filteredComponents = computed(() => {
	if (selectedCategory.value === "all") return components.value;
	return components.value.filter(c => c.category === selectedCategory.value);
});

const dragStart = (component: any) => {
	console.log("Dragging:", component.name);
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
			@click="isOpen = !isOpen"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
				/>
			</svg>
			<span class="text-sm font-medium">Components</span>
		</button>

		<!-- Panel -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed right-4 top-32 z-50 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
			>
				<!-- Header -->
				<div class="p-3 border-b border-gray-200 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<span>🧩</span> Component Library
					</h3>
				</div>

				<!-- Categories -->
				<div class="flex overflow-x-auto p-2 gap-2 border-b border-gray-200 dark:border-gray-700">
					<button
						v-for="cat in categories"
						:key="cat.id"
						:class="[
							'flex items-center gap-1 px-2 py-1 rounded-lg text-xs whitespace-nowrap transition-colors',
							selectedCategory === cat.id
								? 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300'
								: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
						]"
						@click="selectedCategory = cat.id"
					>
						<span>{{ cat.icon }}</span>
						<span>{{ cat.name }}</span>
					</button>
				</div>

				<!-- Components Grid -->
				<div class="p-3 max-h-64 overflow-y-auto">
					<div class="grid grid-cols-2 gap-2">
						<div
							v-for="component in filteredComponents"
							:key="component.id"
							class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-grab hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
							draggable="true"
							@dragstart="dragStart(component)"
						>
							<div class="text-2xl mb-2">{{ component.icon }}</div>
							<p class="text-sm font-medium truncate">{{ component.name }}</p>
							<p class="text-xs text-gray-500">
								Used {{ component.usage }} times
							</p>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
					<button class="w-full py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">
						+ Create New Component
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateX(20px);
}
</style>
