<script setup lang="ts">
export interface SearchFilters {
	search: string;
	type: "all" | "image" | "audio" | "video";
	dateFrom: string;
	dateTo: string;
	sizeMin: number;
	sizeMax: number;
	tags: string[];
}

const props = defineProps<{
	availableTags?: string[];
}>();

const emit = defineEmits<{
	(event: 'search', filters: SearchFilters): void
}>();

const filters = ref<SearchFilters>({
	search: "",
	type: "all",
	dateFrom: "",
	dateTo: "",
	sizeMin: 0,
	sizeMax: 0,
	tags: [],
});

const showFilters = ref(false);

const hasActiveFilters = computed(() => {
	return (
		filters.value.search !== ""
		|| filters.value.type !== "all"
		|| filters.value.dateFrom !== ""
		|| filters.value.dateTo !== ""
		|| filters.value.sizeMin > 0
		|| filters.value.sizeMax > 0
		|| filters.value.tags.length > 0
	);
});

const handleSearch = () => {
	emit("search", filters.value);
};

const handleReset = () => {
	filters.value = {
		search: "",
		type: "all",
		dateFrom: "",
		dateTo: "",
		sizeMin: 0,
		sizeMax: 0,
		tags: [],
	};
	emit("search", filters.value);
};

const toggleTag = (tag: string) => {
	const index = filters.value.tags.indexOf(tag);
	if (index > -1) {
		filters.value.tags.splice(index, 1);
	} else {
		filters.value.tags.push(tag);
	}
};

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
		sizes[i]
	}`;
};
</script>

<template>
	<div class="advanced-search">
		<div class="flex items-center gap-2">
			<div class="relative flex-1">
				<i
					class="i-mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
				/>
				<input
					v-model="filters.search"
					type="text"
					placeholder="Search media..."
					class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					@keyup.enter="handleSearch"
				/>
			</div>
			<button
				@click="showFilters = !showFilters"
				:class="showFilters
				? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
				: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
				class="rounded-md px-3 py-2"
				title="Advanced Filters"
			>
				<i class="i-mdi-filter-variant" />
			</button>
			<button
				@click="handleSearch"
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				Search
			</button>
			<button
				v-if="hasActiveFilters"
				@click="handleReset"
				class="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			>
				Reset
			</button>
		</div>

		<div
			v-if="showFilters"
			class="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div>
					<label
						class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Type</label>
					<select
						v-model="filters.type"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<option value="all">All Types</option>
						<option value="image">Images</option>
						<option value="audio">Audio</option>
						<option value="video">Videos</option>
					</select>
				</div>

				<div>
					<label
						class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Date From</label>
					<input
						v-model="filters.dateFrom"
						type="date"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Date To</label>
					<input
						v-model="filters.dateTo"
						type="date"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Size Range</label>
					<div class="flex items-center gap-2">
						<input
							v-model.number="filters.sizeMin"
							type="number"
							placeholder="Min"
							min="0"
							class="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
						<span class="text-gray-500">-</span>
						<input
							v-model.number="filters.sizeMax"
							type="number"
							placeholder="Max"
							min="0"
							class="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						/>
					</div>
				</div>
			</div>

			<div v-if="availableTags && availableTags.length > 0" class="mt-4">
				<label
					class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Tags</label>
				<div class="flex flex-wrap gap-2">
					<button
						v-for="tag in availableTags"
						:key="tag"
						@click="toggleTag(tag)"
						:class="filters.tags.includes(tag)
						? 'bg-blue-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
						class="rounded-full px-3 py-1 text-sm"
					>
						{{ tag }}
					</button>
				</div>
			</div>

			<div v-if="filters.tags.length > 0" class="mt-4">
				<label
					class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Selected Tags</label>
				<div class="flex flex-wrap gap-2">
					<span
						v-for="tag in filters.tags"
						:key="tag"
						class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
					>
						{{ tag }}
						<button
							@click="toggleTag(tag)"
							class="ml-1 rounded-full p-0.5 text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-800"
						>
							<i class="i-mdi-close text-xs" />
						</button>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
