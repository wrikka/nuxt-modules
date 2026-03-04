<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	export: [format: string];
}>();

const formats = [
	{ id: "png", label: "PNG Image", description: "High quality raster image" },
	{ id: "svg", label: "SVG Vector", description: "Scalable vector graphics" },
	{ id: "pdf", label: "PDF Document", description: "Print-ready document" },
	{ id: "json", label: "JSON Data", description: "Editable project data" },
];

const selectedFormat = ref("png");
const includeBackground = ref(true);
const quality = ref("high");

const handleExport = () => {
	emit("export", selectedFormat.value);
	emit("close");
};
</script>

<template>
	<Modal :show="isOpen" size="md" @close="$emit('close')">
		<div class="p-6">
			<h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
				Export Design
			</h2>

			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>Format</label>
					<div class="grid grid-cols-2 gap-2">
						<button
							v-for="fmt in formats"
							:key="fmt.id"
							:class="[
								'p-3 border rounded-lg text-left transition-colors',
								selectedFormat === fmt.id
									? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
									: 'border-gray-200 dark:border-gray-600 hover:border-gray-300',
							]"
							@click="selectedFormat = fmt.id"
						>
							<div class="font-medium text-sm">{{ fmt.label }}</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">
								{{ fmt.description }}
							</div>
						</button>
					</div>
				</div>

				<div>
					<label class="flex items-center gap-2">
						<input
							v-model="includeBackground"
							type="checkbox"
							class="rounded border-gray-300"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Include background</span>
					</label>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>Quality</label>
					<select
						v-model="quality"
						class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-800"
					>
						<option value="low">Low (Fast)</option>
						<option value="medium">Medium</option>
						<option value="high">High (Best)</option>
					</select>
				</div>

				<div class="flex gap-2 pt-4">
					<Button variant="primary" class="flex-1" @click="handleExport">
						Export
					</Button>
					<Button variant="secondary" class="flex-1" @click="$emit('close')">
						Cancel
					</Button>
				</div>
			</div>
		</div>
	</Modal>
</template>
