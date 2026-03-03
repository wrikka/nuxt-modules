<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	templates: {
		id: string;
		name: string;
		thumbnail: string;
		category: string;
		isDefault?: boolean;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	select: [templateId: string];
	setDefault: [templateId: string];
}>();

const searchQuery = ref("");
const selectedCategory = ref("All");

const categories = computed(() => {
	const cats = new Set(props.templates.map(t => t.category));
	return ["All", ...Array.from(cats)];
});

const filteredTemplates = computed(() => {
	let result = props.templates;
	if (selectedCategory.value !== "All") {
		result = result.filter(t => t.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(t => t.name.toLowerCase().includes(query));
	}
	return result;
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					New from Template
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
				<div class="relative">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search templates..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
				<div class="flex gap-2 flex-wrap">
					<button
						v-for="cat in categories"
						:key="cat"
						@click="selectedCategory = cat"
						:class="[
							'px-3 py-1.5 rounded-full text-sm',
							selectedCategory === cat
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600',
						]"
					>
						{{ cat }}
					</button>
				</div>
			</div>

			<div class="flex-1 overflow-y-auto p-4">
				<div class="grid grid-cols-3 md:grid-cols-4 gap-4">
					<div
						v-for="template in filteredTemplates"
						:key="template.id"
						@click="emit('select', template.id)"
						class="group cursor-pointer"
					>
						<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2 relative">
							<img
								v-if="template.thumbnail"
								:src="template.thumbnail"
								class="w-full h-full object-cover"
							/>
							<div
								v-else
								class="w-full h-full flex items-center justify-center text-gray-400"
							>
								<Icon name="mdi:image" class="w-8 h-8" />
							</div>
							<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<span
									class="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium"
								>Use Template</span>
							</div>
							<div
								v-if="template.isDefault"
								class="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
							>
								Default
							</div>
						</div>
						<p class="font-medium text-gray-900 dark:text-white text-sm truncate">
							{{ template.name }}
						</p>
						<p class="text-xs text-gray-500">{{ template.category }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
