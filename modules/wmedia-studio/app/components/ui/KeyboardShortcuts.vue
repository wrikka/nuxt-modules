<script setup lang="ts">
const emit = defineEmits<{ close: []; save: [shortcuts: any] }>();
const shortcuts = ref([
	{
		category: "File",
		items: [{ key: "Ctrl+N", action: "New Project", editable: false }, {
			key: "Ctrl+O",
			action: "Open",
			editable: false,
		}, { key: "Ctrl+S", action: "Save", editable: true }],
	},
	{
		category: "Edit",
		items: [{ key: "Ctrl+Z", action: "Undo", editable: false }, {
			key: "Ctrl+Y",
			action: "Redo",
			editable: false,
		}, { key: "Ctrl+X", action: "Cut", editable: false }],
	},
	{
		category: "View",
		items: [{ key: "F11", action: "Fullscreen", editable: true }, {
			key: "Ctrl+Shift+F",
			action: "Find",
			editable: true,
		}],
	},
]);
const editingKey = ref<string | null>(null);
const tempKey = ref("");

const startEditing = (key: string) => {
	editingKey.value = key;
	tempKey.value = key;
};
const saveKey = () => {
	editingKey.value = null;
};
</script>
<template>
	<div class="keyboard-shortcuts bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:keyboard" class="w-5 h-5 text-blue-500" />
				Keyboard Shortcuts
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-4">
			<div v-for="cat in shortcuts" :key="cat.category">
				<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
					{{ cat.category }}
				</div>
				<div class="space-y-2">
					<div
						v-for="item in cat.items"
						:key="item.action"
						class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
					>
						<span class="text-gray-900 dark:text-white text-sm">{{
							item.action
						}}</span>
						<div v-if="editingKey === item.key" class="flex items-center gap-2">
							<input
								v-model="tempKey"
								type="text"
								class="w-24 bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm text-center border-0"
								@keydown.enter="saveKey"
							/>
							<button class="text-green-500" @click="saveKey">
								<Icon name="mdi:check" class="w-4 h-4" />
							</button>
						</div>
						<div v-else class="flex items-center gap-2">
							<kbd
								class="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
							>{{ item.key }}</kbd>
							<button
								v-if="item.editable"
								class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
								@click="startEditing(item.key)"
							>
								<Icon name="mdi:pencil" class="w-3 h-3" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			class="mt-4 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="emit('save', shortcuts)"
		>
			Save Changes
		</button>
	</div>
</template>
