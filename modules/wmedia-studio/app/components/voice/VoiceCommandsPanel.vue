<script setup lang="ts">
interface VoiceCommand {
	command: string;
	description: string;
	icon: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	execute: [command: string];
}>();

const isListening = ref(false);
const transcript = ref("");
const recognizedCommand = ref<VoiceCommand | null>(null);

const commands: VoiceCommand[] = [
	{
		command: "new project",
		description: "Create a new project",
		icon: "mdi:plus",
	},
	{
		command: "save",
		description: "Save current project",
		icon: "mdi:content-save",
	},
	{ command: "export", description: "Export the design", icon: "mdi:download" },
	{ command: "undo", description: "Undo last action", icon: "mdi:undo" },
	{ command: "redo", description: "Redo last action", icon: "mdi:redo" },
	{ command: "zoom in", description: "Zoom in", icon: "mdi:magnify-plus" },
	{ command: "zoom out", description: "Zoom out", icon: "mdi:magnify-minus" },
	{
		command: "add text",
		description: "Add text element",
		icon: "mdi:format-text",
	},
	{ command: "add image", description: "Add image", icon: "mdi:image" },
	{ command: "delete", description: "Delete selection", icon: "mdi:delete" },
	{
		command: "duplicate",
		description: "Duplicate selection",
		icon: "mdi:content-copy",
	},
	{
		command: "align center",
		description: "Center align elements",
		icon: "mdi:format-align-center",
	},
];

const startListening = () => {
	isListening.value = true;
	transcript.value = "";
	recognizedCommand.value = null;

	// Simulate voice recognition
	setTimeout(() => {
		transcript.value = "create new project";
		recognizedCommand.value = commands[0] ?? null;
	}, 2000);
};

const stopListening = () => {
	isListening.value = false;
};

const executeCommand = () => {
	if (recognizedCommand.value) {
		emit("execute", recognizedCommand.value.command);
		emit("close");
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:microphone" class="w-7 h-7 text-red-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Voice Commands
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<div class="p-6">
				<!-- Voice Interface -->
				<div class="text-center mb-8">
					<button
						:class="[
							'w-20 h-20 rounded-full flex items-center justify-center transition-all mb-4 mx-auto',
							isListening
								? 'bg-red-500 animate-pulse'
								: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200',
						]"
						@click="isListening ? stopListening() : startListening()"
					>
						<Icon
							:name="isListening ? 'mdi:microphone' : 'mdi:microphone-off'"
							class="w-10 h-10"
							:class="isListening ? 'text-white' : 'text-gray-500'"
						/>
					</button>

					<p v-if="!isListening" class="text-gray-500 dark:text-gray-400">
						Click the microphone to start
					</p>
					<p v-else class="text-red-500 animate-pulse">
						Listening...
					</p>

					<!-- Transcript -->
					<div
						v-if="transcript"
						class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
					>
						<p class="text-sm text-gray-500 mb-1">Heard:</p>
						<p class="text-lg text-gray-900 dark:text-white">
							"{{ transcript }}"
						</p>
					</div>

					<!-- Recognized Command -->
					<div
						v-if="recognizedCommand"
						class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<Icon
									:name="recognizedCommand.icon"
									class="w-6 h-6 text-blue-500"
								/>
								<div>
									<p class="font-medium text-gray-900 dark:text-white">
										{{ recognizedCommand.description }}
									</p>
									<p class="text-xs text-gray-500">
										Command: {{ recognizedCommand.command }}
									</p>
								</div>
							</div>
							<button
								class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
								@click="executeCommand"
							>
								Execute
							</button>
						</div>
					</div>
				</div>

				<!-- Command List -->
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
						Available Commands
					</h3>
					<div class="grid grid-cols-2 gap-2">
						<div
							v-for="cmd in commands"
							:key="cmd.command"
							class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
						>
							<Icon :name="cmd.icon" class="w-4 h-4 text-gray-400" />
							<div>
								<p class="text-xs text-gray-500 font-medium">
									"{{ cmd.command }}"
								</p>
								<p class="text-xs text-gray-400">{{ cmd.description }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
