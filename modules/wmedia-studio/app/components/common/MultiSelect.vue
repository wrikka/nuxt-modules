<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	items: { id: string; label: string; checked: boolean }[];
}>();

const emit = defineEmits<{
	close: [];
	toggle: [itemId: string];
	selectAll: [];
	selectNone: [];
}>();

const allChecked = computed(() => props.items.every(i => i.checked));
const someChecked = computed(() =>
	props.items.some(i => i.checked) && !allChecked.value
);

const toggleAll = () => {
	if (allChecked.value) {
		emit("selectNone");
	} else {
		emit("selectAll");
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<button
						@click="toggleAll"
						class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
						:class="[
							allChecked
								? 'bg-blue-500 border-blue-500'
								: someChecked
								? 'bg-blue-500/50 border-blue-500'
								: 'border-gray-300 dark:border-gray-600',
						]"
					>
						<Icon
							v-if="allChecked || someChecked"
							name="mdi:check"
							class="w-3 h-3 text-white"
						/>
					</button>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Select Items
					</h3>
				</div>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="max-h-80 overflow-y-auto p-2">
				<div class="space-y-1">
					<button
						v-for="item in items"
						:key="item.id"
						@click="emit('toggle', item.id)"
						class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
					>
						<div
							class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
							:class="[
								item.checked
									? 'bg-blue-500 border-blue-500'
									: 'border-gray-300 dark:border-gray-600',
							]"
						>
							<Icon
								v-if="item.checked"
								name="mdi:check"
								class="w-3 h-3 text-white"
							/>
						</div>
						<span class="text-gray-700 dark:text-gray-300">{{
							item.label
						}}</span>
					</button>
				</div>
			</div>

			<div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
				<p class="text-sm text-gray-500 text-center">
					{{ items.filter(i => i.checked).length }} of {{ items.length }}
					selected
				</p>
			</div>
		</div>
	</div>
</template>
