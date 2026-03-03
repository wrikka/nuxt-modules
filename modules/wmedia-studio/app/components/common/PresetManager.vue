<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	presets: {
		id: string;
		name: string;
		description: string;
		values: Record<string, any>;
		isDefault?: boolean;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	apply: [presetId: string];
	save: [name: string, values: Record<string, any>];
	delete: [presetId: string];
	setDefault: [presetId: string];
}>();

const searchQuery = ref("");
const showSaveDialog = ref(false);
const newPresetName = ref("");
const newPresetDesc = ref("");

const filteredPresets = computed(() => {
	if (!searchQuery.value) return props.presets;
	return props.presets.filter(p =>
		p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

const saveNewPreset = () => {
	if (!newPresetName.value.trim()) return;
	emit("save", newPresetName.value, {});
	newPresetName.value = "";
	newPresetDesc.value = "";
	showSaveDialog.value = false;
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Presets
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
				<div class="relative">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search presets..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
				<button
					@click="showSaveDialog = true"
					class="w-full py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
				>
					<Icon name="mdi:plus" class="w-4 h-4" />
					Save Current as Preset
				</button>
			</div>

			<div class="max-h-80 overflow-y-auto p-2">
				<div class="space-y-2">
					<div
						v-for="preset in filteredPresets"
						:key="preset.id"
						class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group"
					>
						<button
							@click='emit("apply", preset.id);
							emit("close");'
							class="flex-1 text-left"
						>
							<div class="flex items-center gap-2">
								<p class="font-medium text-gray-900 dark:text-white">
									{{ preset.name }}
								</p>
								<span
									v-if="preset.isDefault"
									class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
								>Default</span>
							</div>
							<p class="text-sm text-gray-500 mt-0.5">
								{{ preset.description }}
							</p>
						</button>
						<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								v-if="!preset.isDefault"
								@click="emit('setDefault', preset.id)"
								class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
								title="Set as default"
							>
								<Icon name="mdi:star" class="w-4 h-4" />
							</button>
							<button
								@click="emit('delete', preset.id)"
								class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
								title="Delete"
							>
								<Icon name="mdi:delete" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Save Dialog -->
			<div
				v-if="showSaveDialog"
				class="absolute inset-0 bg-white dark:bg-gray-800 p-4 flex flex-col"
			>
				<h4 class="font-semibold text-gray-900 dark:text-white mb-4">
					Save Preset
				</h4>
				<div class="space-y-3 flex-1">
					<div>
						<label class="text-sm text-gray-500 mb-1 block">Name</label>
						<input
							v-model="newPresetName"
							type="text"
							placeholder="My Preset"
							class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
						/>
					</div>
					<div>
						<label class="text-sm text-gray-500 mb-1 block">Description</label>
						<textarea
							v-model="newPresetDesc"
							rows="2"
							placeholder="Optional description..."
							class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg resize-none"
						/>
					</div>
				</div>
				<div class="flex gap-3 mt-4">
					<button
						@click="showSaveDialog = false"
						class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
					>
						Cancel
					</button>
					<button
						@click="saveNewPreset"
						:disabled="!newPresetName.trim()"
						class="flex-1 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
