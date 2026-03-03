<script setup lang="ts">
const emit = defineEmits<
	{ close: []; import: [format: string, data: any]; export: [format: string] }
>();
const activeTab = ref("export");
const exportFormat = ref("json");
const importFormat = ref("json");
const formats = [{ id: "json", name: "JSON" }, { id: "csv", name: "CSV" }, {
	id: "xml",
	name: "XML",
}, { id: "pdf", name: "PDF Report" }];
</script>
<template>
	<div class="data-import-export bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:swap-horizontal" class="w-5 h-5 text-blue-500" />
				Import / Export
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<button
				v-for='t in ["export", "import"]'
				:key="t"
				class="flex-1 px-4 py-2 rounded-lg text-sm capitalize transition-all"
				:class="activeTab === t
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="activeTab = t"
			>
				{{ t }}
			</button>
		</div>
		<div v-if="activeTab === 'export'">
			<div class="mb-4">
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
				>Export Format</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="f in formats"
						:key="f.id"
						class="p-3 rounded-lg text-center text-sm transition-all"
						:class="exportFormat === f.id
						? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
						: 'bg-gray-50 dark:bg-gray-700/50'"
						@click="exportFormat = f.id"
					>
						{{ f.name }}
					</button>
				</div>
			</div>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<input
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				<span>Include media files</span>
			</label>
			<button
				class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('export', exportFormat)"
			>
				Export Data
			</button>
		</div>
		<div v-else>
			<div class="mb-4 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center bg-gray-50 dark:bg-gray-700/30">
				<Icon name="mdi:upload" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
				<div class="text-gray-600 dark:text-gray-300 text-sm">
					Drop file here or click to upload
				</div>
				<div class="text-gray-500 dark:text-gray-500 text-xs mt-1">
					Supports JSON, CSV, XML
				</div>
			</div>
			<button
				class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('import', importFormat, {})"
			>
				Import Data
			</button>
		</div>
	</div>
</template>
