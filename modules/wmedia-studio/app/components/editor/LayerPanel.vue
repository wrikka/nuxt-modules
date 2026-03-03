<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	elements: {
		id: string;
		name: string;
		type: string;
		x: number;
		y: number;
		width: number;
		height: number;
		visible: boolean;
		locked: boolean;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	select: [elementId: string];
	toggleVisibility: [elementId: string];
	toggleLock: [elementId: string];
	reorder: [elementIds: string[]];
}>();

const searchQuery = ref("");
const selectedIds = ref<string[]>([]);

const filteredElements = computed(() => {
	if (!searchQuery.value) return props.elements;
	const query = searchQuery.value.toLowerCase();
	return props.elements.filter(el => el.name.toLowerCase().includes(query));
});

const typeIcons: Record<string, string> = {
	text: "mdi:format-text",
	image: "mdi:image",
	shape: "mdi:shape",
	group: "mdi:layers",
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed right-0 top-16 bottom-0 w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-40 flex flex-col"
	>
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="font-semibold text-gray-900 dark:text-white">Layers</h3>
			<button
				@click="emit('close')"
				class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<div class="p-3 border-b border-gray-200 dark:border-gray-700">
			<div class="relative">
				<Icon
					name="mdi:magnify"
					class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
				/>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search layers..."
					class="w-full pl-9 pr-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm"
				/>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto">
			<div class="divide-y divide-gray-100 dark:divide-gray-800">
				<div
					v-for="element in filteredElements"
					:key="element.id"
					@click="emit('select', element.id)"
					:class="[
						'flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
						selectedIds.includes(element.id)
						&& 'bg-blue-50 dark:bg-blue-900/20',
					]"
				>
					<Icon
						:name="typeIcons[element.type] || 'mdi:package-variant'"
						class="w-4 h-4 text-gray-500"
					/>
					<span
						class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate"
					>{{ element.name }}</span>
					<button
						@click.stop="emit('toggleVisibility', element.id)"
						:class="[
							'w-6 h-6 flex items-center justify-center rounded',
							element.visible ? 'text-gray-500' : 'text-gray-300',
						]"
					>
						<Icon
							:name="element.visible ? 'mdi:eye' : 'mdi:eye-off'"
							class="w-4 h-4"
						/>
					</button>
					<button
						@click.stop="emit('toggleLock', element.id)"
						:class="[
							'w-6 h-6 flex items-center justify-center rounded',
							element.locked ? 'text-amber-500' : 'text-gray-300',
						]"
					>
						<Icon
							:name="element.locked ? 'mdi:lock' : 'mdi:lock-open'"
							class="w-4 h-4"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
