<script setup lang="ts">
interface Macro {
	id: string;
	name: string;
	description: string;
	steps: number;
	lastRun: string | null;
	isRecording: boolean;
}

const macros = ref<Macro[]>([
	{
		id: "1",
		name: "Normalize & Export",
		description: "Normalize audio and export to MP3",
		steps: 5,
		lastRun: "2 hours ago",
		isRecording: false,
	},
	{
		id: "2",
		name: "Remove Silence",
		description: "Auto-detect and remove silent sections",
		steps: 3,
		lastRun: "Yesterday",
		isRecording: false,
	},
	{
		id: "3",
		name: "Mastering Chain",
		description: "Apply EQ, compression, and limiting",
		steps: 7,
		lastRun: null,
		isRecording: false,
	},
]);

const isRecording = ref(false);
const recordedSteps = ref<string[]>([]);
const showCreateDialog = ref(false);
const newMacroName = ref("");
const newMacroDescription = ref("");
const selectedMacro = ref<string | null>(null);

const startRecording = () => {
	isRecording.value = true;
	recordedSteps.value = [];
};

const stopRecording = () => {
	isRecording.value = false;
	showCreateDialog.value = true;
};

const saveMacro = () => {
	if (!newMacroName.value.trim()) return;

	const macro: Macro = {
		id: Date.now().toString(),
		name: newMacroName.value,
		description: newMacroDescription.value,
		steps: recordedSteps.value.length,
		lastRun: null,
		isRecording: false,
	};

	macros.value.push(macro);
	newMacroName.value = "";
	newMacroDescription.value = "";
	showCreateDialog.value = false;
	recordedSteps.value = [];
};

const runMacro = (macro: Macro) => {
	console.log("Running macro:", macro.name);
	macro.lastRun = "Just now";
};

const deleteMacro = (id: string) => {
	macros.value = macros.value.filter(m => m.id !== id);
};

const editMacro = (macro: Macro) => {
	selectedMacro.value = macro.id;
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Scripting & Macros
			</h3>
			<button
				v-if="!isRecording"
				@click="startRecording"
				class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center gap-1"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="12" r="6" />
				</svg>
				Record
			</button>
			<button
				v-else
				@click="stopRecording"
				class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors flex items-center gap-1"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<rect x="6" y="6" width="12" height="12" />
				</svg>
				Stop ({{ recordedSteps.length }} steps)
			</button>
		</div>

		<div class="p-3 bg-green-900/20 border border-green-800 rounded-lg">
			<p class="text-xs text-green-300">
				Record and replay repetitive editing tasks. Create macros to automate
				common workflows and save time.
			</p>
		</div>

		<!-- Recording Status -->
		<div
			v-if="isRecording"
			class="p-3 bg-red-900/20 border border-red-800 rounded-lg"
		>
			<div class="flex items-center gap-2">
				<span class="relative flex h-3 w-3">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
					></span>
					<span
						class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
					></span>
				</span>
				<span class="text-sm text-red-400">Recording in progress...</span>
			</div>
			<div class="mt-2 text-xs text-gray-500">
				Steps recorded: {{ recordedSteps.length }}
			</div>
			<div
				v-if="recordedSteps.length > 0"
				class="mt-1 max-h-24 overflow-y-auto space-y-1"
			>
				<div
					v-for="(step, index) in recordedSteps"
					:key="index"
					class="text-xs text-gray-400"
				>
					{{ index + 1 }}. {{ step }}
				</div>
			</div>
		</div>

		<!-- Macros List -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Saved Macros</label>
			<div class="max-h-64 overflow-y-auto space-y-1">
				<div
					v-for="macro in macros"
					:key="macro.id"
					class="group p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<span class="font-medium text-white">{{ macro.name }}</span>
								<span
									class="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded"
								>{{ macro.steps }} steps</span>
							</div>
							<div class="text-xs text-gray-500 mt-1">
								{{ macro.description }}
							</div>
							<div v-if="macro.lastRun" class="text-xs text-gray-600 mt-1">
								Last run: {{ macro.lastRun }}
							</div>
						</div>
						<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								@click="runMacro(macro)"
								class="p-1.5 text-green-400 hover:bg-green-900/30 rounded transition-colors"
								title="Run"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							</button>
							<button
								@click="editMacro(macro)"
								class="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors"
								title="Edit"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</button>
							<button
								@click="deleteMacro(macro.id)"
								class="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors"
								title="Delete"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="flex gap-2">
			<button class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
				Import Macro
			</button>
			<button class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
				Export All
			</button>
		</div>

		<!-- Create Dialog -->
		<div
			v-if="showCreateDialog"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-gray-900 rounded-lg p-6 w-96 space-y-4">
				<h4 class="text-lg font-semibold text-white">Save Macro</h4>

				<div class="space-y-3">
					<div>
						<label class="text-xs text-gray-400 block mb-1">Macro Name</label>
						<input
							v-model="newMacroName"
							type="text"
							placeholder="My Macro"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
						/>
					</div>

					<div>
						<label class="text-xs text-gray-400 block mb-1">Description</label>
						<input
							v-model="newMacroDescription"
							type="text"
							placeholder="What does this macro do?"
							class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
						/>
					</div>

					<div class="p-3 bg-gray-800 rounded-lg">
						<div class="text-xs text-gray-400">
							Recorded Steps: {{ recordedSteps.length }}
						</div>
					</div>
				</div>

				<div class="flex gap-2">
					<button
						@click="showCreateDialog = false;
						isRecording = false;"
						class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
					>
						Discard
					</button>
					<button
						@click="saveMacro"
						:disabled="!newMacroName.trim()"
						class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
