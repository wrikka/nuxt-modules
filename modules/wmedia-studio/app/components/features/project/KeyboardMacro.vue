<script setup lang="ts">
interface MacroStep {
	id: string;
	type: "key" | "delay" | "click" | "command";
	value: string;
	delay?: number;
}

const isRecording = ref(false);
const macroName = ref("");
const macroDescription = ref("");
const recordedSteps = ref<MacroStep[]>([]);
const playbackSpeed = ref(1);
const loopEnabled = ref(false);
const selectedMacro = ref<string | null>(null);

const savedMacros = ref([
	{
		id: "1",
		name: "Quick Export",
		description: "Export to MP4 with standard settings",
		steps: 5,
		lastUsed: "2 days ago",
	},
	{
		id: "2",
		name: "Color Correction",
		description: "Apply LUT and adjust levels",
		steps: 8,
		lastUsed: "1 week ago",
	},
	{
		id: "3",
		name: "Audio Normalize",
		description: "Normalize audio and add compressor",
		steps: 4,
		lastUsed: "3 days ago",
	},
]);

function startRecording() {
	isRecording.value = true;
	recordedSteps.value = [];
}

function stopRecording() {
	isRecording.value = false;
}

function addStep(type: MacroStep["type"], value: string) {
	recordedSteps.value.push({
		id: Date.now().toString(),
		type,
		value,
		delay: 100,
	});
}

function saveMacro() {
	if (macroName.value && recordedSteps.value.length > 0) {
		savedMacros.value.push({
			id: Date.now().toString(),
			name: macroName.value,
			description: macroDescription.value
				|| `${recordedSteps.value.length} steps`,
			steps: recordedSteps.value.length,
			lastUsed: "Just now",
		});
		macroName.value = "";
		macroDescription.value = "";
		recordedSteps.value = [];
	}
}

function playMacro(id: string) {
	alert(`Playing macro: ${savedMacros.value.find(m => m.id === id)?.name}`);
}

function deleteMacro(id: string) {
	const index = savedMacros.value.findIndex(m => m.id === id);
	if (index > -1) savedMacros.value.splice(index, 1);
}
</script>

<template>
	<div class="keyboard-macro">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:keyboard-variant" class="mr-2" />
			Keyboard Macro Recording
		</h2>
		<p class="text-gray-500 mb-6">Record and replay complex workflows</p>

		<div class="grid grid-cols-2 gap-6">
			<!-- Recorder Panel -->
			<div class="space-y-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold">Macro Recorder</h3>
						<span v-if="isRecording" class="text-red-500 animate-pulse"
						>● Recording</span>
					</div>

					<div class="flex gap-2 mb-4">
						<button
							v-if="!isRecording"
							@click="startRecording"
							class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
						>
							<Icon name="mdi:record-circle" class="mr-1" />
							Record
						</button>
						<button
							v-else
							@click="stopRecording"
							class="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
						>
							<Icon name="mdi:stop-circle" class="mr-1" />
							Stop
						</button>
						<button class="px-4 py-2 border rounded-lg hover:bg-gray-50">
							<Icon name="mdi:play" />
						</button>
					</div>

					<!-- Quick Actions -->
					<div v-if="isRecording" class="grid grid-cols-2 gap-2 text-sm">
						<button
							@click="addStep('delay', '500ms')"
							class="p-2 border rounded hover:bg-gray-100"
						>
							<Icon name="mdi:timer" class="mr-1" />Add Delay
						</button>
						<button
							@click="addStep('command', 'export')"
							class="p-2 border rounded hover:bg-gray-100"
						>
							<Icon name="mdi:export" class="mr-1" />Export Cmd
						</button>
					</div>
				</div>

				<!-- Recorded Steps -->
				<div v-if="recordedSteps.length > 0" class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">
						Recorded Steps ({{ recordedSteps.length }})
					</h3>
					<div class="space-y-2 max-h-48 overflow-y-auto">
						<div
							v-for="(step, index) in recordedSteps"
							:key="step.id"
							class="flex items-center gap-2 p-2 bg-white rounded text-sm"
						>
							<span class="text-gray-400 w-6">{{ index + 1 }}</span>
							<Icon
								:name="step.type === 'key'
								? 'mdi:keyboard'
								: step.type === 'delay'
								? 'mdi:timer'
								: 'mdi:cursor-pointer'"
							/>
							<span class="flex-1">{{ step.value }}</span>
							<button class="text-red-500 hover:bg-red-50 p-1 rounded">
								<Icon name="mdi:delete" size="14" />
							</button>
						</div>
					</div>
				</div>

				<!-- Save Form -->
				<div
					v-if="recordedSteps.length > 0"
					class="bg-gray-50 rounded-lg p-4 space-y-3"
				>
					<input
						v-model="macroName"
						placeholder="Macro name"
						class="w-full border rounded px-3 py-2"
					/>
					<input
						v-model="macroDescription"
						placeholder="Description (optional)"
						class="w-full border rounded px-3 py-2"
					/>
					<button
						@click="saveMacro"
						:disabled="!macroName"
						class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						Save Macro
					</button>
				</div>
			</div>

			<!-- Saved Macros -->
			<div class="space-y-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">
						Saved Macros ({{ savedMacros.length }})
					</h3>
					<div class="space-y-2">
						<div
							v-for="macro in savedMacros"
							:key="macro.id"
							class="flex items-center gap-3 p-3 bg-white rounded-lg"
							:class="{ 'ring-2 ring-blue-500': selectedMacro === macro.id }"
						>
							<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<Icon name="mdi:play-box" class="text-blue-600" />
							</div>
							<div class="flex-1">
								<p class="font-medium">{{ macro.name }}</p>
								<p class="text-xs text-gray-500">
									{{ macro.steps }} steps • {{ macro.lastUsed }}
								</p>
							</div>
							<div class="flex gap-1">
								<button
									@click="playMacro(macro.id)"
									class="p-2 text-green-600 hover:bg-green-50 rounded"
								>
									<Icon name="mdi:play" />
								</button>
								<button
									@click="deleteMacro(macro.id)"
									class="p-2 text-red-500 hover:bg-red-50 rounded"
								>
									<Icon name="mdi:delete" />
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Playback Settings -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Playback Settings</h3>
					<div class="space-y-3">
						<div>
							<label class="block text-sm mb-1"
							>Speed: {{ playbackSpeed }}x</label>
							<input
								v-model="playbackSpeed"
								type="range"
								min="0.5"
								max="3"
								step="0.5"
								class="w-full"
							/>
						</div>
						<label class="flex items-center gap-2">
							<input v-model="loopEnabled" type="checkbox" class="rounded" />
							<span class="text-sm">Loop playback</span>
						</label>
					</div>
				</div>

				<!-- Keyboard Shortcuts -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Shortcuts</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span>Record/Stop</span>
							<kbd class="px-2 py-1 bg-gray-200 rounded">Ctrl+Shift+R</kbd>
						</div>
						<div class="flex justify-between">
							<span>Play Macro</span>
							<kbd class="px-2 py-1 bg-gray-200 rounded">Ctrl+Shift+P</kbd>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.keyboard-macro {
	padding: 1.5rem;
}
</style>
