<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

interface Command {
	id: string;
	label: string;
	shortcut?: string;
	action: () => void;
	icon?: string;
}

const props = defineProps<{
	commands: Command[];
}>();

const isOpen = ref(false);
const searchQuery = ref("");
const selectedIndex = ref(0);
const commandRef = ref<HTMLElement | null>(null);

onClickOutside(commandRef, () => {
	isOpen.value = false;
});

const filteredCommands = computed(() => {
	if (!searchQuery.value.trim()) return props.commands;
	const query = searchQuery.value.toLowerCase();
	return props.commands.filter(cmd => cmd.label.toLowerCase().includes(query));
});

const openPalette = () => {
	isOpen.value = true;
	searchQuery.value = "";
	selectedIndex.value = 0;
	nextTick(() => {
		const input = commandRef.value?.querySelector("input");
		input?.focus();
	});
};

const closePalette = () => {
	isOpen.value = false;
};

const executeCommand = (command: Command) => {
	command.action();
	closePalette();
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === "ArrowDown") {
		e.preventDefault();
		selectedIndex.value = (selectedIndex.value + 1)
			% filteredCommands.value.length;
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		selectedIndex.value =
			(selectedIndex.value - 1 + filteredCommands.value.length)
			% filteredCommands.value.length;
	} else if (e.key === "Enter") {
		e.preventDefault();
		const cmd = filteredCommands.value[selectedIndex.value];
		if (cmd) executeCommand(cmd);
	} else if (e.key === "Escape") {
		closePalette();
	}
};

// Expose open method for global access
defineExpose({ openPalette, closePalette });
</script>

<template>
	<Teleport to="body">
		<div
			v-if="isOpen"
			class="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]"
		>
			<div
				ref="commandRef"
				class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
			>
				<div class="p-4 border-b border-gray-200 dark:border-gray-700">
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Type a command or search..."
						class="w-full px-4 py-2 text-lg bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
						@keydown="handleKeydown"
					>
				</div>
				<div class="max-h-[60vh] overflow-y-auto">
					<div
						v-for="(cmd, index) in filteredCommands"
						:key="cmd.id"
						:class="[
							'px-4 py-3 flex items-center justify-between cursor-pointer transition-colors',
							index === selectedIndex
								? 'bg-blue-50 dark:bg-blue-900/30'
								: 'hover:bg-gray-50 dark:hover:bg-gray-700',
						]"
						@click="executeCommand(cmd)"
					>
						<div class="flex items-center gap-3">
							<span v-if="cmd.icon" class="text-gray-400">{{ cmd.icon }}</span>
							<span class="text-gray-700 dark:text-gray-200">{{
								cmd.label
							}}</span>
						</div>
						<kbd
							v-if="cmd.shortcut"
							class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded"
						>
							{{ cmd.shortcut }}
						</kbd>
					</div>
					<div
						v-if="filteredCommands.length === 0"
						class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
					>
						No commands found
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
