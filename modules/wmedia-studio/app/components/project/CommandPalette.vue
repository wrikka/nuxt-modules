<script setup lang="ts">
import type { Project } from "#shared/types";

const props = defineProps<{
	projects: Project[];
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	openProject: [projectId: string];
	createProject: [];
}>();

const searchQuery = ref("");
const selectedIndex = ref(0);

const commands = computed(() => {
	const query = searchQuery.value.toLowerCase();
	const items: Array<{
		id: string;
		type: "action" | "project";
		name: string;
		icon: string;
		subtitle?: string;
		handler: () => void;
	}> = [];

	// Actions
	if (!query || "new".includes(query) || "create".includes(query)) {
		items.push({
			id: "new-project",
			type: "action",
			name: "Create New Project",
			icon: "➕",
			subtitle: "Start from scratch",
			handler: () => emit("createProject"),
		});
	}

	if (!query || "trash".includes(query)) {
		items.push({
			id: "view-trash",
			type: "action",
			name: "View Trash",
			icon: "🗑️",
			subtitle: "Restore deleted projects",
			handler: () => {},
		});
	}

	// Projects
	const filteredProjects = props.projects
		.filter(p => p.name.toLowerCase().includes(query))
		.slice(0, 5);

	filteredProjects.forEach(project => {
		items.push({
			id: project.id,
			type: "project",
			name: project.name,
			icon: project.type === "video-editor"
				? "🎬"
				: project.type === "audio-editor"
				? "🎵"
				: "🎨",
			subtitle: `Open ${project.type || "designer"} project`,
			handler: () => emit("openProject", project.id),
		});
	});

	return items;
});

watch(commands, () => {
	selectedIndex.value = 0;
});

const handleKeydown = (e: KeyboardEvent) => {
	switch (e.key) {
		case "ArrowDown":
			e.preventDefault();
			selectedIndex.value = (selectedIndex.value + 1) % commands.value.length;
			break;
		case "ArrowUp":
			e.preventDefault();
			selectedIndex.value = (selectedIndex.value - 1 + commands.value.length)
				% commands.value.length;
			break;
		case "Enter":
			e.preventDefault();
			if (commands.value[selectedIndex.value]?.handler) {
				commands.value[selectedIndex.value]?.handler();
				emit("close");
			}
			break;
		case "Escape":
			e.preventDefault();
			emit("close");
			break;
	}
};

watch(() => props.isOpen, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			searchQuery.value = "";
			selectedIndex.value = 0;
		});
	}
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 z-50 flex items-start justify-center pt-24"
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/50" @click="emit('close')" />

		<!-- Modal -->
		<div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
			<!-- Search Input -->
			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				<input
					ref="searchInput"
					v-model="searchQuery"
					type="text"
					placeholder="Search projects or commands..."
					class="w-full px-4 py-3 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
					@keydown="handleKeydown"
				/>
			</div>

			<!-- Results -->
			<div class="max-h-96 overflow-auto">
				<div
					v-for="(command, index) in commands"
					:key="command.id"
					class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
					:class="index === selectedIndex
					? 'bg-blue-50 dark:bg-blue-900/30'
					: 'hover:bg-gray-50 dark:hover:bg-gray-700'"
					@click='command.handler();
					emit("close");'
				>
					<span class="text-xl">{{ command.icon }}</span>
					<div class="flex-1">
						<p class="font-medium text-gray-900 dark:text-white">
							{{ command.name }}
						</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ command.subtitle }}
						</p>
					</div>
					<span
						v-if="index === selectedIndex"
						class="text-xs text-gray-400"
					>
						Enter ↵
					</span>
				</div>

				<div
					v-if="commands.length === 0"
					class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
				>
					No results found
				</div>
			</div>

			<!-- Footer -->
			<div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
				<span>↑↓ to navigate</span>
				<span>Enter to select</span>
				<span>Esc to close</span>
			</div>
		</div>
	</div>
</template>
