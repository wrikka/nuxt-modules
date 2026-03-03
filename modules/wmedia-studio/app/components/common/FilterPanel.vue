<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	filters: {
		id: string;
		label: string;
		type: "checkbox" | "radio" | "range" | "select";
		options?: string[];
		min?: number;
		max?: number;
		value: any;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	apply: [filters: typeof props.filters];
	reset: [];
}>();

const localFilters = ref([...props.filters]);

const updateFilter = (id: string, value: any) => {
	const filter = localFilters.value.find(f => f.id === id);
	if (filter) {
		filter.value = value;
	}
};

const applyFilters = () => {
	emit("apply", localFilters.value);
	emit("close");
};

const resetFilters = () => {
	localFilters.value = props.filters.map(f => ({
		...f,
		value: f.type === "checkbox" ? false : f.type === "range" ? f.min || 0 : "",
	}));
	emit("reset");
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Filter
				</h3>
				<div class="flex items-center gap-2">
					<button
						@click="resetFilters"
						class="text-sm text-gray-500 hover:text-gray-700"
					>
						Reset
					</button>
					<button
						@click="emit('close')"
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
					>
						<Icon name="mdi:close" class="w-5 h-5" />
					</button>
				</div>
			</div>

			<div class="flex-1 overflow-y-auto p-4 space-y-4">
				<div v-for="filter in localFilters" :key="filter.id">
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
					>{{ filter.label }}</label>

					<!-- Checkbox -->
					<div
						v-if="filter.type === 'checkbox'"
						class="flex items-center gap-3"
					>
						<button
							@click="updateFilter(filter.id, !filter.value)"
							:class="[
								'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
								filter.value
									? 'bg-blue-500 border-blue-500'
									: 'border-gray-300 dark:border-gray-600',
							]"
						>
							<Icon
								v-if="filter.value"
								name="mdi:check"
								class="w-3 h-3 text-white"
							/>
						</button>
						<span class="text-sm text-gray-600 dark:text-gray-400">{{
							filter.label
						}}</span>
					</div>

					<!-- Radio -->
					<div v-else-if="filter.type === 'radio'" class="space-y-2">
						<label
							v-for="option in filter.options"
							:key="option"
							class="flex items-center gap-3 cursor-pointer"
						>
							<input
								type="radio"
								:name="filter.id"
								:value="option"
								:checked="filter.value === option"
								@change="updateFilter(filter.id, option)"
								class="w-4 h-4 text-blue-500"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300">{{
								option
							}}</span>
						</label>
					</div>

					<!-- Range -->
					<div v-else-if="filter.type === 'range'" class="space-y-2">
						<div class="flex items-center justify-between text-sm text-gray-500">
							<span>{{ filter.min }}</span>
							<span class="font-medium text-gray-900 dark:text-white">{{
								filter.value
							}}</span>
							<span>{{ filter.max }}</span>
						</div>
						<input
							type="range"
							:min="filter.min"
							:max="filter.max"
							:value="filter.value"
							@input="updateFilter(
								filter.id,
								+($event.target as HTMLInputElement).value,
							)"
							class="w-full"
						/>
					</div>

					<!-- Select -->
					<select
						v-else-if="filter.type === 'select'"
						:value="filter.value"
						@change="updateFilter(
							filter.id,
							($event.target as HTMLSelectElement).value,
						)"
						class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm"
					>
						<option
							v-for="option in filter.options"
							:key="option"
							:value="option"
						>
							{{ option }}
						</option>
					</select>
				</div>
			</div>

			<div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
				<button
					@click="applyFilters"
					class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
				>
					Apply Filters
				</button>
			</div>
		</div>
	</div>
</template>
