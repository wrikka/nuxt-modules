<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	items: {
		id: string;
		name: string;
		icon: string;
		shortcut?: string;
		children?: { id: string; name: string; action: () => void }[];
	}[];
}>();

const emit = defineEmits<{
	close: [];
	select: [itemId: string];
}>();

const activeItem = ref<string | null>(null);
const searchQuery = ref("");

const filteredItems = computed(() => {
	if (!searchQuery.value) return props.items;
	const query = searchQuery.value.toLowerCase();
	return props.items.filter(item =>
		item.name.toLowerCase().includes(query)
		|| item.children?.some(child => child.name.toLowerCase().includes(query))
	);
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50"
		@click.self="emit('close')"
	>
		<div class="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
			<!-- Search -->
			<div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
				<Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search menu..."
					class="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
					autofocus
				/>
				<span
					class="text-xs text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
				>ESC</span>
			</div>

			<!-- Menu Items -->
			<div class="max-h-96 overflow-y-auto py-2">
				<div v-for="item in filteredItems" :key="item.id">
					<button
						@click="item.children
						? activeItem = activeItem === item.id ? null : item.id
						: emit('select', item.id)"
						class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						<Icon :name="item.icon" class="w-5 h-5 text-gray-500" />
						<span class="flex-1 text-left text-gray-900 dark:text-white">{{
							item.name
						}}</span>
						<span v-if="item.shortcut" class="text-xs text-gray-400">{{
							item.shortcut
						}}</span>
						<Icon
							v-if="item.children"
							name="mdi:chevron-right"
							:class="[
								'w-4 h-4 text-gray-400 transition-transform',
								activeItem === item.id && 'rotate-90',
							]"
						/>
					</button>

					<!-- Submenu -->
					<div
						v-if="item.children && activeItem === item.id"
						class="bg-gray-50 dark:bg-gray-700/50"
					>
						<button
							v-for="child in item.children"
							:key="child.id"
							@click='child.action();
							emit("close");'
							class="w-full text-left px-12 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
						>
							{{ child.name }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
