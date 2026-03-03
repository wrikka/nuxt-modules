<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	items: { id: string; name: string; icon: string; shortcut?: string }[];
	placeholder?: string;
}>();

const emit = defineEmits<{
	close: [];
	select: [itemId: string];
}>();

const searchQuery = ref("");
const selectedIndex = ref(0);

const filteredItems = computed(() => {
	if (!searchQuery.value) return props.items;
	const query = searchQuery.value.toLowerCase();
	return props.items.filter(item => item.name.toLowerCase().includes(query));
});

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === "ArrowDown") {
		selectedIndex.value = (selectedIndex.value + 1)
			% filteredItems.value.length;
	} else if (e.key === "ArrowUp") {
		selectedIndex.value = (selectedIndex.value - 1 + filteredItems.value.length)
			% filteredItems.value.length;
	} else if (e.key === "Enter") {
		const item = filteredItems.value[selectedIndex.value];
		if (item) {
			emit("select", item.id);
			emit("close");
		}
	} else if (e.key === "Escape") {
		emit("close");
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
	<Teleport to="body">
		<div
			v-if="isOpen"
			class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
			@click.self="emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
				<!-- Search Input -->
				<div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
					<Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
					<input
						v-model="searchQuery"
						type="text"
						:placeholder="placeholder || 'Search...'"
						class="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
						autofocus
					/>
					<span
						class="text-xs text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
					>ESC</span>
				</div>

				<!-- Items List -->
				<div class="max-h-80 overflow-y-auto py-2">
					<button
						v-for="(item, index) in filteredItems"
						:key="item.id"
						:class="[
							'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
							index === selectedIndex
								? 'bg-blue-50 dark:bg-blue-900/30'
								: 'hover:bg-gray-50 dark:hover:bg-gray-700',
						]"
						@click='emit("select", item.id);
						emit("close");'
						@mouseenter="selectedIndex = index"
					>
						<Icon :name="item.icon" class="w-5 h-5 text-gray-500" />
						<span class="flex-1 text-gray-900 dark:text-white">{{
							item.name
						}}</span>
						<span v-if="item.shortcut" class="text-xs text-gray-400">{{
							item.shortcut
						}}</span>
					</button>

					<div
						v-if="filteredItems.length === 0"
						class="px-4 py-8 text-center text-gray-500"
					>
						No results found
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
