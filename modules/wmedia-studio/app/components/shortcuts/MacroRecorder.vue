<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const isRecording = ref(false);
const macroName = ref("New Macro");
const recordedKeys = ref<string[]>([]);
const savedMacros = ref([
	{ id: "1", name: "Quick Export", keys: ["Ctrl+Shift+E", "Enter"], runs: 45 },
	{
		id: "2",
		name: "Add Transition",
		keys: ["Ctrl+T", "Tab", "Enter"],
		runs: 128,
	},
	{ id: "3", name: "Split Clip", keys: ["Ctrl+K"], runs: 342 },
]);

const startRecording = () => {
	isRecording.value = true;
	recordedKeys.value = [];
};

const stopRecording = () => {
	isRecording.value = false;
};

const saveMacro = () => {
	if (macroName.value && recordedKeys.value.length) {
		savedMacros.value.push({
			id: Math.random().toString(36).substr(2, 9),
			name: macroName.value,
			keys: [...recordedKeys.value],
			runs: 0,
		});
		recordedKeys.value = [];
		macroName.value = "New Macro";
	}
};

const runMacro = (id: string) => {
	const macro = savedMacros.value.find(m => m.id === id);
	if (macro) {
		macro.runs++;
	}
};

const deleteMacro = (id: string) => {
	savedMacros.value = savedMacros.value.filter(m => m.id !== id);
};

// Simulate key recording
if (isRecording.value) {
	setTimeout(() => {
		if (isRecording.value && recordedKeys.value.length < 5) {
			recordedKeys.value.push(
				"Ctrl+" + ["A", "C", "V", "S", "Z"][Math.floor(Math.random() * 5)],
			);
		}
	}, 1000);
}
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Keyboard Macro Recorder"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Record and replay custom keyboard shortcuts for repetitive tasks.
			</p>

			<!-- Recording Section -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Macro Name</label>
					<div class="flex items-center gap-2">
						<div
							v-if="isRecording"
							class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
						/>
						<span v-if="isRecording" class="text-xs text-red-500"
						>Recording...</span>
					</div>
				</div>
				<input
					v-model="macroName"
					type="text"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 mb-3"
					:disabled="isRecording"
				/>

				<!-- Recorded Keys Display -->
				<div class="min-h-[60px] bg-gray-900 rounded-lg p-3 flex flex-wrap gap-2 items-center">
					<template v-if="recordedKeys.length">
						<kbd
							v-for="(key, i) in recordedKeys"
							:key="i"
							class="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono"
						>
							{{ key }}
						</kbd>
					</template>
					<span v-else class="text-gray-500 text-sm"
					>Press keys to record...</span>
				</div>

				<div class="flex gap-2 mt-3">
					<button
						class="flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
						:class="isRecording
						? 'bg-red-500 hover:bg-red-600 text-white'
						: 'bg-blue-500 hover:bg-blue-600 text-white'"
						@click="isRecording ? stopRecording() : startRecording()"
					>
						<Icon
							:name="isRecording ? 'mdi:stop' : 'mdi:record'"
							class="w-4 h-4"
						/>
						{{ isRecording ? "Stop" : "Record" }}
					</button>
					<button
						class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
						:disabled="!recordedKeys.length || isRecording"
						@click="saveMacro"
					>
						<Icon name="mdi:content-save" class="w-4 h-4 inline mr-1" />
						Save
					</button>
				</div>
			</div>

			<!-- Saved Macros -->
			<div>
				<h4 class="font-medium text-gray-900 dark:text-white mb-3">
					Saved Macros ({{ savedMacros.length }})
				</h4>
				<div class="space-y-2">
					<div
						v-for="macro in savedMacros"
						:key="macro.id"
						class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
					>
						<div class="flex-1">
							<p class="font-medium text-sm text-gray-900 dark:text-white">
								{{ macro.name }}
							</p>
							<div class="flex flex-wrap gap-1 mt-1">
								<kbd
									v-for="(key, i) in macro.keys"
									:key="i"
									class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono"
								>
									{{ key }}
								</kbd>
							</div>
							<p class="text-xs text-gray-500 mt-1">
								Run {{ macro.runs }} times
							</p>
						</div>
						<div class="flex gap-1">
							<button
								class="p-2 text-green-500 hover:bg-green-50 rounded"
								@click="runMacro(macro.id)"
							>
								<Icon name="mdi:play" class="w-4 h-4" />
							</button>
							<button
								class="p-2 text-red-500 hover:bg-red-50 rounded"
								@click="deleteMacro(macro.id)"
							>
								<Icon name="mdi:delete" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
