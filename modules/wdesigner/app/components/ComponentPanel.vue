<script setup lang="ts">
export interface ComponentInstance {
	id: string;
	name: string;
	type: string;
	overrides: Record<string, unknown>;
	masterId: string;
}

export interface ComponentMaster {
	id: string;
	name: string;
	type: string;
	objects: unknown[];
	thumbnail?: string;
}

const props = defineProps<{
	masters: ComponentMaster[];
	instances: ComponentInstance[];
	selectedMasterId: string | null;
}>();

const emit = defineEmits<{
	(e: "createMaster"): void;
	(e: "selectMaster", masterId: string): void;
	(
		e: "updateMaster",
		masterId: string,
		updates: Partial<ComponentMaster>,
	): void;
	(e: "deleteMaster", masterId: string): void;
	(e: "createInstance", masterId: string): void;
	(
		e: "updateInstance",
		instanceId: string,
		overrides: Record<string, unknown>,
	): void;
	(e: "detachInstance", instanceId: string): void;
}>();

const activeTab = ref<"masters" | "instances">("masters");
const editingMaster = ref<string | null>(null);
const editName = ref("");

const startEdit = (master: ComponentMaster) => {
	editingMaster.value = master.id;
	editName.value = master.name;
};

const saveEdit = (masterId: string) => {
	emit("updateMaster", masterId, { name: editName.value });
	editingMaster.value = null;
};

const cancelEdit = () => {
	editingMaster.value = null;
	editName.value = "";
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex border-b border-gray-200 dark:border-gray-700">
			<button
				type="button"
				class="px-3 py-1.5 text-sm transition-colors"
				:class="activeTab === 'masters'
				? 'text-blue-600 border-b-2 border-blue-600'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
				@click="activeTab = 'masters'"
			>
				Masters ({{ masters.length }})
			</button>
			<button
				type="button"
				class="px-3 py-1.5 text-sm transition-colors"
				:class="activeTab === 'instances'
				? 'text-blue-600 border-b-2 border-blue-600'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
				@click="activeTab = 'instances'"
			>
				Instances ({{ instances.length }})
			</button>
		</div>

		<div v-if="activeTab === 'masters'" class="space-y-2">
			<button
				type="button"
				class="w-full p-2 rounded border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
				@click="$emit('createMaster')"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Create Component
			</button>

			<div
				v-if="masters.length === 0"
				class="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
			>
				No components yet
			</div>

			<div v-else class="space-y-1 max-h-48 overflow-y-auto">
				<div
					v-for="master in masters"
					:key="master.id"
					class="group flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					:class="{
						'ring-2 ring-blue-200 border-blue-300':
							selectedMasterId === master.id,
					}"
				>
					<div class="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
						<svg
							class="w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
							/>
						</svg>
					</div>

					<div class="flex-1 min-w-0">
						<div
							v-if="editingMaster === master.id"
							class="flex items-center gap-1"
						>
							<input
								v-model="editName"
								type="text"
								class="flex-1 px-1.5 py-0.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@keyup.enter="saveEdit(master.id)"
								@keyup.escape="cancelEdit"
							>
							<button
								type="button"
								class="p-1 text-green-600 hover:text-green-700"
								@click="saveEdit(master.id)"
							>
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</button>
						</div>
						<div
							v-else
							class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
						>
							{{ master.name }}
						</div>
						<div class="text-xs text-gray-500">{{ master.type }}</div>
					</div>

					<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-blue-500"
							title="Create Instance"
							@click="$emit('createInstance', master.id)"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
								/>
							</svg>
						</button>
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-gray-600"
							title="Rename"
							@click="startEdit(master)"
						>
							<svg
								class="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
								/>
							</svg>
						</button>
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-red-500"
							title="Delete"
							@click="$emit('deleteMaster', master.id)"
						>
							<svg
								class="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="space-y-2">
			<div
				v-if="instances.length === 0"
				class="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
			>
				No instances yet
			</div>

			<div v-else class="space-y-1 max-h-48 overflow-y-auto">
				<div
					v-for="instance in instances"
					:key="instance.id"
					class="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700"
				>
					<div class="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
						<svg
							class="w-4 h-4 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
							/>
						</svg>
					</div>

					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
							{{ instance.name }}
						</div>
						<div class="text-xs text-gray-500">
							Instance of {{
								masters.find(m => m.id === instance.masterId)?.name
								|| "Unknown"
							}}
						</div>
					</div>

					<button
						type="button"
						class="p-1 text-gray-400 hover:text-orange-500"
						title="Detach Instance"
						@click="$emit('detachInstance', instance.id)"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
