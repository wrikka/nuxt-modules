<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const pattern = defineModel<string>("pattern", {
	default: "{date}_{project}_{resolution}p",
});
const autoIncrement = defineModel<boolean>("autoIncrement", { default: true });
const dateFormat = defineModel<string>("dateFormat", { default: "YYYYMMDD" });
const separator = defineModel<string>("separator", { default: "_" });

const variables = [
	{
		key: "{date}",
		label: "Date",
		example: "20250208",
		description: "Recording date",
	},
	{
		key: "{time}",
		label: "Time",
		example: "143022",
		description: "Recording time",
	},
	{
		key: "{project}",
		label: "Project",
		example: "Tutorial",
		description: "Project name",
	},
	{
		key: "{resolution}",
		label: "Resolution",
		example: "1080",
		description: "Video resolution",
	},
	{ key: "{fps}", label: "FPS", example: "60", description: "Frame rate" },
	{
		key: "{counter}",
		label: "Counter",
		example: "001",
		description: "Auto-increment number",
	},
	{
		key: "{random}",
		label: "Random",
		example: "a7x9k",
		description: "Random ID",
	},
	{
		key: "{type}",
		label: "Type",
		example: "Screen",
		description: "Recording type",
	},
];

const preview = computed(() => {
	let result = pattern.value;
	const now = new Date();
	result = result.replace(
		"{date}",
		now.toISOString().slice(0, 10).replace(/-/g, ""),
	);
	result = result.replace(
		"{time}",
		now.toTimeString().slice(0, 8).replace(/:/g, ""),
	);
	result = result.replace("{project}", "Tutorial");
	result = result.replace("{resolution}", "1080");
	result = result.replace("{fps}", "30");
	result = result.replace("{counter}", "001");
	result = result.replace("{random}", "a7x9k");
	result = result.replace("{type}", "Screen");
	return `${result}.mp4`;
});

const insertVariable = (key: string) => {
	pattern.value += key;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
					<Icon
						name="mdi:file-document"
						class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Smart File Naming
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Auto-generate filenames with variables
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon
						name="mdi:information"
						class="w-4 h-4 text-emerald-600 mt-0.5"
					/>
					<p class="text-xs text-emerald-700 dark:text-emerald-300">
						Create custom filename patterns using variables. Files are
						automatically named when recording stops.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Filename Pattern</label>
				<input
					v-model="pattern"
					type="text"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm font-mono"
				>
			</div>

			<div class="flex flex-wrap gap-1">
				<button
					v-for="variable in variables"
					:key="variable.key"
					class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded transition-colors"
					:title="variable.description"
					@click="insertVariable(variable.key)"
				>
					{{ variable.key }}
				</button>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Date Format</label>
					<select
						v-model="dateFormat"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option value="YYYYMMDD">YYYYMMDD</option>
						<option value="YYYY-MM-DD">YYYY-MM-DD</option>
						<option value="DD-MM-YYYY">DD-MM-YYYY</option>
						<option value="MM-DD-YYYY">MM-DD-YYYY</option>
					</select>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Separator</label>
					<select
						v-model="separator"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option value="_">Underscore (_)</option>
						<option value="-">Hyphen (-)</option>
						<option value=".">Dot (.)</option>
						<option value=" ">Space</option>
					</select>
				</div>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="autoIncrement"
					type="checkbox"
					class="w-4 h-4 text-emerald-600 rounded"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Auto-increment counter for duplicates</span>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Preview</label>
				<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg font-mono text-sm text-gray-700 dark:text-gray-300">
					{{ preview }}
				</div>
			</div>
		</div>
	</div>
</template>
