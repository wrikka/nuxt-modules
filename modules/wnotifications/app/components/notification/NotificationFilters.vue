<script setup lang="ts">
const props = defineProps<{
	filters: { searchQuery: string; type: string; priority: string; unreadOnly: boolean; dateRange?: { start: string; end: string }; tags: string[] }
	tagsInput: string
	showAdvanced: boolean
	hasActiveFilters: boolean
	activeFilterId: string | null
	quickFilterPresets: Array<{ id: string; name: string; icon: string }>
	savedFilters: Array<{ id: string; name: string }>
	showSavedFilters: boolean
	showSearch: boolean
	showFilters: boolean
	showAdvancedFilters: boolean
}>()

const emit = defineEmits<{
	"update:filters": [filters: typeof props.filters]
	"update:tagsInput": [value: string]
	"update:showAdvanced": [value: boolean]
	"update:showSavedFilters": [value: boolean]
	applyPreset: [id: string]
	reset: []
	save: []
	loadFilter: [id: string]
	deleteFilter: [id: string]
}>()

const handleTagsChange = (value: string) => {
	emit("update:tagsInput", value);
	const newFilters = { ...props.filters, tags: value.split(",").map(t => t.trim()).filter(t => t.length > 0) };
	emit("update:filters", newFilters);
};
</script>

<template>
	<div class="border-b p-4 dark:border-gray-700">
		<div v-if="showSearch" class="mb-3">
			<div class="relative">
				<div class="i-heroicons-magnifying-glass absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					:value="filters.searchQuery"
					type="text"
					placeholder="Search notifications..."
					class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
					@input="emit('update:filters', { ...filters, searchQuery: ($event.target as HTMLInputElement).value })"
				/>
			</div>
		</div>

		<div v-if="showFilters" class="flex flex-wrap gap-2">
			<select :value="filters.type" class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800" @change="emit('update:filters', { ...filters, type: ($event.target as HTMLSelectElement).value })">
				<option value="all">All Types</option>
				<option value="info">Info</option>
				<option value="success">Success</option>
				<option value="warning">Warning</option>
				<option value="error">Error</option>
				<option value="system">System</option>
				<option value="message">Message</option>
			</select>

			<select :value="filters.priority" class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800" @change="emit('update:filters', { ...filters, priority: ($event.target as HTMLSelectElement).value })">
				<option value="all">All Priorities</option>
				<option value="urgent">Urgent</option>
				<option value="high">High</option>
				<option value="normal">Normal</option>
				<option value="low">Low</option>
			</select>

			<label class="flex items-center gap-1.5 text-sm">
				<input :checked="filters.unreadOnly" type="checkbox" class="rounded border-gray-300" @change="emit('update:filters', { ...filters, unreadOnly: ($event.target as HTMLInputElement).checked })" />
				Unread only
			</label>
		</div>

		<div v-if="showSearch || showFilters" class="mt-3 flex flex-wrap gap-2">
			<button
				v-for="preset in quickFilterPresets"
				:key="preset.id"
				:class="[
					'flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
					{ 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': activeFilterId === preset.id }
				]"
				@click="emit('applyPreset', preset.id)"
			>
				<div :class="preset.icon" class="h-4 w-4" />
				{{ preset.name }}
			</button>
		</div>

		<div v-if="showAdvancedFilters" class="mt-3 flex items-center justify-between">
			<button class="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600" @click="emit('update:showAdvanced', !showAdvanced)">
				<div :class="showAdvanced ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="h-4 w-4" />
				{{ showAdvanced ? 'Hide' : 'Show' }} advanced filters
			</button>
			<div class="flex items-center gap-2">
				<button v-if="hasActiveFilters" class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" @click="emit('reset')">Reset filters</button>
				<button class="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" @click="emit('update:showSavedFilters', !showSavedFilters)">
					<div class="i-heroicons-bookmark h-4 w-4" />
					Saved ({{ savedFilters.length }})
				</button>
			</div>
		</div>

		<div v-if="showAdvanced && showAdvancedFilters" class="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
			<div>
				<label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Date Range</label>
				<div class="flex gap-2">
					<input :value="filters.dateRange?.start" type="date" class="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900" @input="emit('update:filters', { ...filters, dateRange: { ...filters.dateRange, start: ($event.target as HTMLInputElement).value } })" />
					<input :value="filters.dateRange?.end" type="date" class="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900" @input="emit('update:filters', { ...filters, dateRange: { ...filters.dateRange, end: ($event.target as HTMLInputElement).value } })" />
				</div>
			</div>
			<div>
				<label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Tags</label>
				<input :value="tagsInput" type="text" placeholder="Comma-separated tags" class="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900" @input="handleTagsChange(($event.target as HTMLInputElement).value)" />
			</div>
			<button class="w-full rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600" @click="emit('save')">Save current filters</button>
		</div>

		<div v-if="showSavedFilters && savedFilters.length > 0" class="mt-3 space-y-2">
			<div class="text-xs font-medium text-gray-600 dark:text-gray-400">Saved Filters</div>
			<div
				v-for="filter in savedFilters"
				:key="filter.id"
				class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
				:class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/30': activeFilterId === filter.id }"
			>
				<button class="flex-1 text-left text-sm" @click="emit('loadFilter', filter.id)">{{ filter.name }}</button>
				<button class="rounded p-1 text-gray-400 hover:text-red-500" @click="emit('deleteFilter', filter.id)">
					<div class="i-heroicons-trash h-4 w-4" />
				</button>
			</div>
		</div>
	</div>
</template>
