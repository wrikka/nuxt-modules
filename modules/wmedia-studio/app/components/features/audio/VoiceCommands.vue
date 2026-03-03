<script setup lang="ts">
const isListening = ref(false);
const transcript = ref("");
const recognizedCommand = ref<string | null>(null);
const commands = ref([
	{
		phrase: "Add text",
		action: "Text tool activated",
		icon: "mdi:format-text",
	},
	{
		phrase: "Change color to blue",
		action: "Color changed",
		icon: "mdi:palette",
	},
	{ phrase: "Export as PNG", action: "Export started", icon: "mdi:export" },
	{ phrase: "Zoom in", action: "Zoom: 150%", icon: "mdi:magnify-plus" },
	{ phrase: "Undo", action: "Last action undone", icon: "mdi:undo" },
	{ phrase: "Save project", action: "Project saved", icon: "mdi:content-save" },
]);

const toggleListening = () => {
	isListening.value = !isListening.value;
	if (isListening.value) {
		setTimeout(() => {
			recognizedCommand.value = commands.value[0]?.phrase ?? null;
			setTimeout(() => {
				recognizedCommand.value = null;
				isListening.value = false;
			}, 2000);
		}, 1500);
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Voice Commands
			</h3>
			<span
				class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
			>Beta</span>
		</div>

		<!-- Mic Button -->
		<div class="flex justify-center mb-6">
			<button
				@click="toggleListening"
				:class="isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'"
				class="w-20 h-20 rounded-full text-white flex items-center justify-center transition-all"
			>
				<Icon
					:name="isListening ? 'mdi:microphone' : 'mdi:microphone-outline'"
					class="w-10 h-10"
				/>
			</button>
		</div>

		<!-- Status -->
		<p class="text-center text-sm text-gray-500 mb-4">
			{{
				isListening
				? "Listening... Say a command"
				: "Click microphone to start"
			}}
		</p>

		<!-- Recognized Command -->
		<div
			v-if="recognizedCommand"
			class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg mb-4"
		>
			<p class="text-sm text-green-700 dark:text-green-300 text-center">
				Recognized: "{{ recognizedCommand }}"
			</p>
		</div>

		<!-- Available Commands -->
		<div>
			<p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
				Try saying:
			</p>
			<div class="space-y-1">
				<div
					v-for="cmd in commands.slice(0, 4)"
					:key="cmd.phrase"
					class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
				>
					<Icon :name="cmd.icon" class="w-4 h-4 text-gray-400" />
					<span class="text-sm">"{{ cmd.phrase }}"</span>
				</div>
			</div>
		</div>
	</div>
</template>
