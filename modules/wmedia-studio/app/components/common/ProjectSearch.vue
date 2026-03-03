<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	projects: {
		id: string;
		name: string;
		type: string;
		thumbnail?: string;
		path: string;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	navigate: [path: string];
}>();

const searchQuery = ref("");

const recentProjects = computed(() => props.projects.slice(0, 10));

const filteredProjects = computed(() => {
	if (!searchQuery.value) return [];
	const query = searchQuery.value.toLowerCase();
	return props.projects.filter(p => p.name.toLowerCase().includes(query));
});

const typeIcons: Record<string, string> = {
	designer: "mdi:palette",
	editor: "mdi:image",
	"video-editor": "mdi:video",
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === "Escape") {
		emit("close");
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
	<Teleport to="body">
		<div
			v-if="isOpen"
			class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[15vh]"
			@click.self="emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
				<!-- Search -->
				<div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
					<Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search projects..."
						class="flex-1 bg-transparent outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
						autofocus
					/>
					<span
						class="text-xs text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
					>ESC</span>
				</div>

				<!-- Results -->
				<div class="max-h-[60vh] overflow-y-auto">
					<!-- Search Results -->
					<div v-if="searchQuery" class="py-2">
						<div
							v-if="filteredProjects.length === 0"
							class="px-4 py-8 text-center text-gray-500"
						>
							No projects found matching "{{ searchQuery }}"
						</div>
						<button
							v-for="project in filteredProjects"
							:key="project.id"
							@click='emit("navigate", project.path);
							emit("close");'
							class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							<Icon
								:name="typeIcons[project.type] || 'mdi:file'"
								class="w-5 h-5 text-gray-500"
							/>
							<div class="flex-1 text-left">
								<p class="font-medium text-gray-900 dark:text-white">
									{{ project.name }}
								</p>
								<p class="text-xs text-gray-500 capitalize">
									{{ project.type }}
								</p>
							</div>
							<Icon name="mdi:arrow-right" class="w-4 h-4 text-gray-400" />
						</button>
					</div>

					<!-- Recent Projects -->
					<div v-else class="py-2">
						<p class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
							Recent Projects
						</p>
						<button
							v-for="project in recentProjects"
							:key="project.id"
							@click='emit("navigate", project.path);
							emit("close");'
							class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							<Icon
								:name="typeIcons[project.type] || 'mdi:file'"
								class="w-5 h-5 text-gray-500"
							/>
							<div class="flex-1 text-left">
								<p class="font-medium text-gray-900 dark:text-white">
									{{ project.name }}
								</p>
								<p class="text-xs text-gray-500 capitalize">
									{{ project.type }}
								</p>
							</div>
						</button>
					</div>
				</div>

				<!-- Footer -->
				<div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
					<div class="flex items-center gap-4">
						<span class="flex items-center gap-1"><kbd
								class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded"
							>↑↓</kbd> to navigate</span>
						<span class="flex items-center gap-1"><kbd
								class="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded"
							>↵</kbd> to open</span>
					</div>
					<span>{{ projects.length }} projects</span>
				</div>
			</div>
		</div>
	</Teleport>
</template>
