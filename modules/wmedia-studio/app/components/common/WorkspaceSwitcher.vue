<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	currentWorkspace: string;
	workspaces: { id: string; name: string; icon: string; color: string }[];
}>();

const emit = defineEmits<{
	close: [];
	switch: [workspaceId: string];
	create: [];
}>();

const searchQuery = ref("");

const filteredWorkspaces = computed(() => {
	if (!searchQuery.value) return props.workspaces;
	const query = searchQuery.value.toLowerCase();
	return props.workspaces.filter(w => w.name.toLowerCase().includes(query));
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Switch Workspace
				</h3>
			</div>

			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				<div class="relative">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search workspaces..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
			</div>

			<div class="max-h-80 overflow-y-auto p-2">
				<button
					v-for="workspace in filteredWorkspaces"
					:key="workspace.id"
					@click='emit("switch", workspace.id);
					emit("close");'
					:class="[
						'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
						currentWorkspace === workspace.id
							? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
							: 'hover:bg-gray-50 dark:hover:bg-gray-700',
					]"
				>
					<div
						:class="[
							'w-10 h-10 rounded-lg flex items-center justify-center',
							workspace.color,
						]"
					>
						<Icon :name="workspace.icon" class="w-5 h-5 text-white" />
					</div>
					<div class="flex-1 text-left">
						<p class="font-medium text-gray-900 dark:text-white">
							{{ workspace.name }}
						</p>
						<p
							v-if="currentWorkspace === workspace.id"
							class="text-xs text-blue-500"
						>
							Current
						</p>
					</div>
					<Icon
						v-if="currentWorkspace === workspace.id"
						name="mdi:check"
						class="w-5 h-5 text-blue-500"
					/>
				</button>
			</div>

			<div class="p-4 border-t border-gray-200 dark:border-gray-700">
				<button
					@click='emit("create");
					emit("close");'
					class="w-full flex items-center gap-2 justify-center p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
				>
					<Icon name="mdi:plus" class="w-5 h-5" />
					Create New Workspace
				</button>
			</div>
		</div>
	</div>
</template>
