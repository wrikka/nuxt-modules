<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	branches: {
		name: string;
		commits: number;
		ahead: number;
		behind: number;
		isDefault?: boolean;
	}[];
	currentBranch: string;
}>();

const emit = defineEmits<{
	close: [];
	switch: [branchName: string];
	create: [];
	merge: [branchName: string];
	delete: [branchName: string];
}>();

const searchQuery = ref("");

const filteredBranches = computed(() => {
	if (!searchQuery.value) return props.branches;
	return props.branches.filter(b =>
		b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
					<Icon name="mdi:source-branch" class="w-5 h-5" />
					Switch Branch
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
						placeholder="Find a branch..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
			</div>

			<div class="max-h-80 overflow-y-auto">
				<div class="divide-y divide-gray-100 dark:divide-gray-700">
					<div
						v-for="branch in filteredBranches"
						:key="branch.name"
						class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
					>
						<div class="flex items-center gap-3">
							<Icon
								:name="currentBranch === branch.name
								? 'mdi:check-circle'
								: 'mdi:source-branch'"
								:class="currentBranch === branch.name
								? 'text-blue-500'
								: 'text-gray-400'"
								class="w-5 h-5"
							/>
							<div>
								<p class="font-medium text-gray-900 dark:text-white">
									{{ branch.name }}
								</p>
								<p class="text-xs text-gray-500">
									{{ branch.commits }} commits
								</p>
							</div>
							<span
								v-if="branch.isDefault"
								class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
							>default</span>
						</div>

						<div class="flex items-center gap-2">
							<div
								v-if="branch.ahead > 0 || branch.behind > 0"
								class="text-xs text-gray-500"
							>
								<span v-if="branch.ahead > 0" class="text-green-500">+{{
										branch.ahead
									}}</span>
								<span v-if="branch.behind > 0" class="text-red-500 ml-1">-{{
										branch.behind
									}}</span>
							</div>

							<div class="flex items-center gap-1">
								<button
									v-if="currentBranch !== branch.name"
									@click='emit("switch", branch.name);
									emit("close");'
									class="px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
								>
									Switch
								</button>
								<button
									v-if="currentBranch !== branch.name"
									@click="emit('merge', branch.name)"
									class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
									title="Merge into current"
								>
									<Icon name="mdi:source-merge" class="w-4 h-4" />
								</button>
								<button
									v-if="!branch.isDefault && currentBranch !== branch.name"
									@click="emit('delete', branch.name)"
									class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
									title="Delete branch"
								>
									<Icon name="mdi:delete" class="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
				<button
					@click='emit("create");
					emit("close");'
					class="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-blue-500 hover:border-blue-300 rounded-lg transition-colors flex items-center justify-center gap-2"
				>
					<Icon name="mdi:plus" class="w-4 h-4" />
					Create New Branch
				</button>
			</div>
		</div>
	</div>
</template>
