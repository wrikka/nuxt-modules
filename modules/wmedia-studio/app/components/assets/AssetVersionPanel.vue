<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

interface AssetVersion {
	id: string;
	version: number;
	createdAt: string;
	size: string;
	author: string;
	changes: string;
}

const selectedAsset = ref("logo.png");

const versions = ref<AssetVersion[]>([
	{
		id: "1",
		version: 3,
		createdAt: "2024-02-08 14:30",
		size: "2.4 MB",
		author: "You",
		changes: "Updated color scheme",
	},
	{
		id: "2",
		version: 2,
		createdAt: "2024-02-07 10:15",
		size: "2.3 MB",
		author: "Alice",
		changes: "Added transparency",
	},
	{
		id: "3",
		version: 1,
		createdAt: "2024-02-06 09:00",
		size: "2.1 MB",
		author: "You",
		changes: "Initial upload",
	},
]);

const rollbackTo = (version: number) => {
	console.log("Rollback to version", version);
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Asset Version Control"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Track versions of imported assets with rollback capabilities.
			</p>

			<!-- Asset Selector -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
				>Selected Asset</label>
				<div class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
					<div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
						<Icon name="mdi:image" class="w-5 h-5 text-gray-500" />
					</div>
					<div class="flex-1">
						<p class="font-medium text-sm text-gray-900 dark:text-white">
							{{ selectedAsset }}
						</p>
						<p class="text-xs text-gray-500">{{ versions.length }} versions</p>
					</div>
					<button class="text-blue-500 text-sm">Change</button>
				</div>
			</div>

			<!-- Version Timeline -->
			<div class="space-y-2">
				<h4 class="font-medium text-gray-900 dark:text-white">
					Version History
				</h4>
				<div class="relative">
					<div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />
					<div class="space-y-3">
						<div
							v-for="(version, index) in versions"
							:key="version.id"
							class="relative flex items-start gap-3 pl-10"
						>
							<div
								class="absolute left-2 w-4 h-4 rounded-full border-2 z-10"
								:class="index === 0
								? 'bg-blue-500 border-blue-500'
								: 'bg-white dark:bg-gray-800 border-gray-400'"
							/>
							<div
								class="flex-1 p-3 rounded-lg border"
								:class="index === 0
								? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
								: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<span class="font-medium text-sm">v{{
												version.version
											}}</span>
										<span
											v-if="index === 0"
											class="text-xs px-2 py-0.5 bg-blue-500 text-white rounded"
										>Current</span>
									</div>
									<span class="text-xs text-gray-500">{{
										version.createdAt
									}}</span>
								</div>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{{ version.changes }}
								</p>
								<div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
									<span>{{ version.size }}</span>
									<span>by {{ version.author }}</span>
								</div>
								<div v-if="index > 0" class="mt-2 flex gap-2">
									<button
										class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
										@click="rollbackTo(version.version)"
									>
										Rollback
									</button>
									<button class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200">
										Preview
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
