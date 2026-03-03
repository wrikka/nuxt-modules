<script setup lang="ts">
interface ExportPreset {
	id: string;
	name: string;
	format: string;
	width: number;
	height: number;
	quality: number;
	transparent: boolean;
	isDefault?: boolean;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	applyPreset: [preset: ExportPreset];
}>();

const presets = ref<ExportPreset[]>([
	{
		id: "p1",
		name: "Instagram Post",
		format: "PNG",
		width: 1080,
		height: 1080,
		quality: 95,
		transparent: false,
		isDefault: true,
	},
	{
		id: "p2",
		name: "YouTube Thumbnail",
		format: "JPG",
		width: 1280,
		height: 720,
		quality: 90,
		transparent: false,
	},
	{
		id: "p3",
		name: "Twitter Card",
		format: "PNG",
		width: 1200,
		height: 628,
		quality: 95,
		transparent: false,
	},
	{
		id: "p4",
		name: "Web Hero",
		format: "JPG",
		width: 1920,
		height: 1080,
		quality: 85,
		transparent: false,
	},
	{
		id: "p5",
		name: "Logo Export",
		format: "SVG",
		width: 512,
		height: 512,
		quality: 100,
		transparent: true,
	},
	{
		id: "p6",
		name: "App Icon",
		format: "PNG",
		width: 1024,
		height: 1024,
		quality: 100,
		transparent: true,
	},
]);

const newPresetName = ref("");
const showCreateForm = ref(false);

const createPreset = () => {
	if (!newPresetName.value.trim()) return;

	const preset: ExportPreset = {
		id: `custom-${Date.now()}`,
		name: newPresetName.value,
		format: "PNG",
		width: 1080,
		height: 1080,
		quality: 95,
		transparent: false,
	};

	presets.value.push(preset);
	newPresetName.value = "";
	showCreateForm.value = false;
};

const deletePreset = (id: string) => {
	presets.value = presets.value.filter(p => p.id !== id);
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:download" class="w-7 h-7 text-green-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Export Presets
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<div class="p-6 space-y-4">
				<!-- Presets List -->
				<div class="space-y-3">
					<div
						v-for="preset in presets"
						:key="preset.id"
						class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
					>
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
								<Icon name="mdi:file-image" class="w-6 h-6 text-blue-500" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-medium text-gray-900 dark:text-white">
										{{ preset.name }}
									</h3>
									<span
										v-if="preset.isDefault"
										class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
									>
										Default
									</span>
								</div>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{{ preset.format }} • {{ preset.width }}×{{ preset.height }} •
									{{ preset.quality }}%
									{{ preset.transparent ? "• Transparent" : "" }}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
								@click="emit('applyPreset', preset)"
							>
								Export
							</button>
							<button
								v-if="!preset.isDefault"
								class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
								@click="deletePreset(preset.id)"
							>
								<Icon name="mdi:delete" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				<!-- Create New -->
				<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
					<button
						v-if="!showCreateForm"
						class="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
						@click="showCreateForm = true"
					>
						<Icon name="mdi:plus" class="w-5 h-5" />
						Create New Preset
					</button>

					<div v-else class="space-y-3">
						<input
							v-model="newPresetName"
							type="text"
							placeholder="Preset name..."
							class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
						>
						<div class="flex gap-2">
							<button
								class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
								@click="createPreset"
							>
								Create
							</button>
							<button
								class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
								@click="showCreateForm = false"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
