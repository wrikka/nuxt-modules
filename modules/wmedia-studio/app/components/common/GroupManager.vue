<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	groups: { id: string; name: string; members: string[]; color: string }[];
	availableItems: { id: string; name: string; type: string }[];
}>();

const emit = defineEmits<{
	close: [];
	create: [name: string, color: string];
	delete: [groupId: string];
	addToGroup: [groupId: string, itemIds: string[]];
	removeFromGroup: [groupId: string, itemId: string];
}>();

const showCreateDialog = ref(false);
const newGroupName = ref("");
const newGroupColor = ref("#3b82f6");
const selectedGroup = ref<string | null>(null);
const selectedItems = ref<string[]>([]);

const colors = [
	"#3b82f6",
	"#ef4444",
	"#10b981",
	"#f59e0b",
	"#8b5cf6",
	"#ec4899",
	"#6366f1",
	"#14b8a6",
];

const createGroup = () => {
	if (!newGroupName.value.trim()) return;
	emit("create", newGroupName.value, newGroupColor.value);
	newGroupName.value = "";
	showCreateDialog.value = false;
};

const addItemsToGroup = () => {
	if (selectedGroup.value && selectedItems.value.length > 0) {
		emit("addToGroup", selectedGroup.value, selectedItems.value);
		selectedItems.value = [];
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl h-[80vh] shadow-2xl overflow-hidden flex flex-col">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Layer Groups
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="flex-1 flex overflow-hidden">
				<!-- Groups List -->
				<div class="w-1/2 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
					<button
						@click="showCreateDialog = true"
						class="w-full mb-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-blue-500 hover:border-blue-300 rounded-lg transition-colors flex items-center justify-center gap-2"
					>
						<Icon name="mdi:plus" class="w-4 h-4" />
						New Group
					</button>

					<div class="space-y-2">
						<div
							v-for="group in groups"
							:key="group.id"
							@click="selectedGroup = group.id"
							:class="[
								'p-3 rounded-lg cursor-pointer transition-colors',
								selectedGroup === group.id
									? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
									: 'hover:bg-gray-50 dark:hover:bg-gray-700',
							]"
						>
							<div class="flex items-center gap-3">
								<div
									class="w-4 h-4 rounded"
									:style="{ backgroundColor: group.color }"
								/>
								<span class="font-medium text-gray-900 dark:text-white">{{
									group.name
								}}</span>
								<span class="text-xs text-gray-500 ml-auto">{{
										group.members.length
									}} items</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Group Details -->
				<div class="w-1/2 p-4 overflow-y-auto">
					<div
						v-if="!selectedGroup"
						class="h-full flex items-center justify-center text-gray-500"
					>
						<p>Select a group to manage</p>
					</div>

					<div v-else class="space-y-4">
						<div class="flex items-center justify-between">
							<h4 class="font-medium text-gray-900 dark:text-white">
								{{ groups.find(g => g.id === selectedGroup)?.name }}
							</h4>
							<button
								@click="emit('delete', selectedGroup)"
								class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg"
							>
								<Icon name="mdi:delete" class="w-4 h-4" />
							</button>
						</div>

						<!-- Add Items -->
						<div class="space-y-2">
							<p class="text-sm text-gray-500">Add items to group:</p>
							<div class="max-h-32 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
								<label
									v-for="item in availableItems"
									:key="item.id"
									class="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
								>
									<input
										type="checkbox"
										:value="item.id"
										v-model="selectedItems"
										class="w-4 h-4"
									/>
									<span class="text-sm text-gray-700 dark:text-gray-300">{{
										item.name
									}}</span>
								</label>
							</div>
							<button
								@click="addItemsToGroup"
								:disabled="selectedItems.length === 0"
								class="w-full py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50"
							>
								Add {{ selectedItems.length }} item(s)
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Create Group Dialog -->
			<div
				v-if="showCreateDialog"
				class="absolute inset-0 bg-white dark:bg-gray-800 p-6 flex flex-col"
			>
				<h4 class="font-semibold text-gray-900 dark:text-white mb-4">
					Create New Group
				</h4>
				<div class="space-y-4 flex-1">
					<div>
						<label class="text-sm text-gray-500 mb-1 block">Group Name</label>
						<input
							v-model="newGroupName"
							type="text"
							placeholder="My Group"
							class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
						/>
					</div>
					<div>
						<label class="text-sm text-gray-500 mb-2 block">Color</label>
						<div class="flex gap-2 flex-wrap">
							<button
								v-for="color in colors"
								:key="color"
								@click="newGroupColor = color"
								:class="[
									'w-8 h-8 rounded-lg transition-transform',
									newGroupColor === color
									&& 'ring-2 ring-offset-2 ring-blue-500',
								]"
								:style="{ backgroundColor: color }"
							/>
						</div>
					</div>
				</div>
				<div class="flex gap-3 mt-6">
					<button
						@click="showCreateDialog = false"
						class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
					>
						Cancel
					</button>
					<button
						@click="createGroup"
						:disabled="!newGroupName.trim()"
						class="flex-1 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
