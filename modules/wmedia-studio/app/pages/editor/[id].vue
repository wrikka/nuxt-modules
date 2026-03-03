<script setup lang="ts">
import { useCollaborationStore } from "~/stores/collaboration";
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();
const collaborationStore = useCollaborationStore();

const route = useRoute();

onMounted(async () => {
	const projectId = route.params.id as string;
	if (projectId) {
		await projectStore.loadProject(projectId);
		await collaborationStore.connect(projectId);
	}
});

onUnmounted(() => {
	collaborationStore.disconnect();
});
</script>

<template>
	<div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 overflow-hidden">
		<TheHeader />
		<div class="flex-1 flex overflow-hidden">
			<TheSidebar />
			<main class="flex-1 flex flex-col overflow-hidden">
				<TheToolbar />
				<div class="flex-1 flex overflow-hidden">
					<TheCanvas />
					<ThePropertiesPanel />
				</div>
			</main>
			<TheLayersPanel />
			<SmartComponentPanel />
		</div>
		<TheCollaborationCursors />
	</div>
</template>
