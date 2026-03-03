<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	teams: {
		id: string;
		name: string;
		members: number;
		projects: number;
		avatar?: string;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	select: [teamId: string];
	create: [];
}>();

const searchQuery = ref("");

const filteredTeams = computed(() => {
	if (!searchQuery.value) return props.teams;
	return props.teams.filter(t =>
		t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Select Team
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
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
						placeholder="Search teams..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
			</div>

			<div class="max-h-80 overflow-y-auto p-2">
				<button
					v-for="team in filteredTeams"
					:key="team.id"
					@click='emit("select", team.id);
					emit("close");'
					class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
				>
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
						{{ team.avatar || team.name[0] }}
					</div>
					<div class="flex-1 text-left">
						<p class="font-medium text-gray-900 dark:text-white">
							{{ team.name }}
						</p>
						<p class="text-sm text-gray-500">
							{{ team.members }} members · {{ team.projects }} projects
						</p>
					</div>
					<Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
				</button>
			</div>

			<div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
				<button
					@click='emit("create");
					emit("close");'
					class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
				>
					<Icon name="mdi:plus" class="w-5 h-5" />
					Create New Team
				</button>
			</div>
		</div>
	</div>
</template>
