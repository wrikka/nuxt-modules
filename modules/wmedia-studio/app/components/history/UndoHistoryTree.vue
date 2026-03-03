<script setup lang="ts">
interface HistoryNode {
	id: string;
	action: string;
	timestamp: Date;
	author: string;
	parent?: string;
	children: string[];
	isActive: boolean;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	restore: [nodeId: string];
}>();

const history = ref<HistoryNode[]>([
	{
		id: "h1",
		action: "Initial commit",
		timestamp: new Date(Date.now() - 3600000),
		author: "You",
		children: ["h2"],
		isActive: false,
	},
	{
		id: "h2",
		action: "Added header",
		timestamp: new Date(Date.now() - 3000000),
		author: "You",
		parent: "h1",
		children: ["h3", "h5"],
		isActive: false,
	},
	{
		id: "h3",
		action: "Styled buttons",
		timestamp: new Date(Date.now() - 2400000),
		author: "Jane",
		parent: "h2",
		children: ["h4"],
		isActive: true,
	},
	{
		id: "h4",
		action: "Fixed spacing",
		timestamp: new Date(Date.now() - 1800000),
		author: "You",
		parent: "h3",
		children: [],
		isActive: false,
	},
	{
		id: "h5",
		action: "Alternative layout",
		timestamp: new Date(Date.now() - 2100000),
		author: "Bob",
		parent: "h2",
		children: ["h6"],
		isActive: false,
	},
	{
		id: "h6",
		action: "Added images",
		timestamp: new Date(Date.now() - 1500000),
		author: "Bob",
		parent: "h5",
		children: [],
		isActive: false,
	},
]);

const getBranchLevel = (nodeId: string): number => {
	const node = history.value.find(h => h.id === nodeId);
	if (!node?.parent) return 0;
	return getBranchLevel(node.parent) + 1;
};

const formatTime = (date: Date) => {
	const diff = Date.now() - date.getTime();
	if (diff < 60000) return "Just now";
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
	return `${Math.floor(diff / 3600000)}h ago`;
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:source-branch" class="w-7 h-7 text-purple-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Undo History Tree
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<!-- Tree -->
			<div class="flex-1 overflow-y-auto p-6">
				<div class="space-y-2">
					<div
						v-for="node in history"
						:key="node.id"
						class="flex items-center gap-4"
						:style="{ marginLeft: `${getBranchLevel(node.id) * 40}px` }"
					>
						<!-- Connector Line -->
						<div
							v-if="node.parent"
							class="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 -ml-4"
						/>

						<!-- Node -->
						<div
							:class="[
								'flex-1 p-3 rounded-lg border cursor-pointer transition-all',
								node.isActive
									? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
									: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300',
							]"
							@click="emit('restore', node.id)"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										:class="[
											'w-3 h-3 rounded-full',
											node.isActive ? 'bg-blue-500' : 'bg-gray-400',
										]"
									/>
									<div>
										<p class="font-medium text-gray-900 dark:text-white text-sm">
											{{ node.action }}
										</p>
										<p class="text-xs text-gray-500">
											{{ node.author }} • {{ formatTime(node.timestamp) }}
										</p>
									</div>
								</div>
								<span
									v-if="node.isActive"
									class="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
								>
									Current
								</span>
							</div>
						</div>

						<!-- Branch indicator -->
						<div
							v-if="node.children.length > 1"
							class="flex items-center gap-1"
						>
							<span class="text-xs text-purple-500 font-medium">{{
									node.children.length
								}} branches</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
