<script setup lang="ts">
const { sharedItems, loading, error, fetchSharedItems, unshareItem } =
	useCollaboration();

onMounted(() => {
	fetchSharedItems();
});

const getEntityIcon = (entityType: string) => {
	if (entityType === "project") return "i-mdi-folder";
	if (entityType === "media") return "i-mdi-image";
	return "i-mdi-file";
};

const getPermissionClass = (permission: string) => {
	const classes: Record<string, string> = {
		view: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
		edit: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
		admin:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	};
	return classes[permission] || "";
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
};

const handleUnshare = async (sharedId: string) => {
	if (confirm("Are you sure you want to unshare this item?")) {
		await unshareItem(sharedId);
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Shared Items
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Manage items you've shared with others
				</p>
			</div>

			<div v-if="loading" class="flex items-center justify-center py-12">
				<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
			</div>

			<div
				v-else-if="error"
				class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
			>
				{{ error }}
			</div>

			<div
				v-else-if="sharedItems.length === 0"
				class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-share-variant text-6xl" />
				<p class="mt-2 text-lg">No shared items</p>
				<p class="text-sm">Items you share will appear here</p>
			</div>

			<div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="item in sharedItems"
					:key="item.id"
					class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3">
							<i
								:class="getEntityIcon(item.entityType)"
								class="text-2xl text-gray-500"
							/>
							<div>
								<h3 class="text-sm font-medium text-gray-900 dark:text-white">
									{{ item.entityName }}
								</h3>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									Shared with {{ item.sharedWith }}
								</p>
							</div>
						</div>
						<span
							class="px-2 py-0.5 rounded-full text-xs"
							:class="getPermissionClass(item.permission)"
						>{{ item.permission }}</span>
					</div>
					<div class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
						<span>{{ formatDate(item.createdAt) }}</span>
						<button
							@click="handleUnshare(item.id)"
							class="text-red-500 hover:text-red-700"
						>
							Unshare
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
