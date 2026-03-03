<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "restore", versionId: string): void;
	(e: "compare", versionIds: string[]): void;
	(e: "close"): void;
}>();

interface Version {
	id: string;
	versionNumber: number;
	createdAt: Date;
	createdBy: string;
	changes: string;
	thumbnail: string;
	isCurrent: boolean;
}

const versions = ref<Version[]>([
	{
		id: "v1",
		versionNumber: 3,
		createdAt: new Date("2024-01-25T14:30:00Z"),
		createdBy: "John Doe",
		changes: "Updated colors and logo placement",
		thumbnail: "https://picsum.photos/400/300?random=50",
		isCurrent: true,
	},
	{
		id: "v2",
		versionNumber: 2,
		createdAt: new Date("2024-01-20T10:00:00Z"),
		createdBy: "John Doe",
		changes: "Added social media icons",
		thumbnail: "https://picsum.photos/400/300?random=51",
		isCurrent: false,
	},
	{
		id: "v3",
		versionNumber: 1,
		createdAt: new Date("2024-01-15T09:00:00Z"),
		createdBy: "Jane Smith",
		changes: "Initial template creation",
		thumbnail: "https://picsum.photos/400/300?random=52",
		isCurrent: false,
	},
]);

const selectedVersions = ref<string[]>([]);

const formatDate = (date: Date) => {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const toggleVersion = (id: string) => {
	if (selectedVersions.value.includes(id)) {
		selectedVersions.value = selectedVersions.value.filter(v => v !== id);
	} else if (selectedVersions.value.length < 2) {
		selectedVersions.value.push(id);
	}
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div>
						<h2 class="text-xl font-bold text-gray-900 dark:text-white">
							Version History
						</h2>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Track and restore previous versions
						</p>
					</div>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400 text-xl" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-6">
					<div class="space-y-4">
						<div
							v-for="version in versions"
							:key="version.id"
							class="flex gap-4 p-4 rounded-lg border transition-all"
							:class="[
								version.isCurrent
									? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
									: 'border-gray-200 dark:border-gray-700',
								selectedVersions.includes(version.id)
									? 'ring-2 ring-purple-500'
									: '',
							]"
						>
							<div class="flex items-start pt-1">
								<input
									type="checkbox"
									:checked="selectedVersions.includes(version.id)"
									@change="toggleVersion(version.id)"
									class="w-4 h-4 rounded"
								/>
							</div>
							<img
								:src="version.thumbnail"
								class="w-24 h-16 object-cover rounded"
							/>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span
										class="font-semibold text-gray-900 dark:text-white"
									>Version {{ version.versionNumber }}</span>
									<span
										v-if="version.isCurrent"
										class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full"
									>Current</span>
								</div>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{{ version.changes }}
								</p>
								<div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
									<span><i class="i-mdi-account mr-1" />{{
											version.createdBy
										}}</span>
									<span><i class="i-mdi-clock-outline mr-1" />{{
											formatDate(version.createdAt)
										}}</span>
								</div>
							</div>
							<button
								v-if="!version.isCurrent"
								class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
								@click="$emit('restore', version.id)"
							>
								Restore
							</button>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
					<div class="text-sm text-gray-600 dark:text-gray-400">
						{{ selectedVersions.length }} selected for comparison
					</div>
					<button
						:disabled="selectedVersions.length !== 2"
						class="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
						@click="$emit('compare', selectedVersions)"
					>
						<i class="i-mdi-compare mr-1" />
						Compare Selected
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
