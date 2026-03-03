<script setup lang="ts">
interface Asset {
	id: string;
	name: string;
	type: "image" | "video" | "audio";
	url: string;
	thumbnail?: string;
	category: string;
	tags: string[];
	isPremium: boolean;
	createdAt: Date;
}

interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();

defineEmits<{
	close: [];
	select: [asset: Asset];
}>();

const searchQuery = ref("");
const selectedType = ref("");
const loading = ref(false);
const assets = ref<Asset[]>([]);

const filteredAssets = computed(() => {
	let result = assets.value;

	if (searchQuery.value) {
		result = result.filter((a) =>
			a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| a.tags.some((t) =>
				t.toLowerCase().includes(searchQuery.value.toLowerCase())
			)
		);
	}

	if (selectedType.value) {
		result = result.filter((a) => a.type === selectedType.value);
	}

	return result;
});

const loadAssets = async () => {
	loading.value = true;
	try {
		const response = await $fetch<{ success: boolean; data: Asset[] }>(
			"/api/assets",
		);
		if (response.success) {
			assets.value = response.data;
		}
	} catch (error) {
		console.error("Failed to load assets:", error);
	} finally {
		loading.value = false;
	}
};

watch(() => props.isOpen, (isOpen) => {
	if (isOpen) {
		loadAssets();
	}
});
</script>

<template>
	<Modal :show="isOpen" size="lg" @close="$emit('close')">
		<template #header>
			<h2 class="text-xl font-semibold">Asset Library</h2>
		</template>
		<template #body>
			<div class="space-y-4">
				<div class="flex gap-2">
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search assets..."
						class="flex-1 px-3 py-2 border rounded"
					/>
					<select v-model="selectedType" class="px-3 py-2 border rounded">
						<option value="">All Types</option>
						<option value="image">Images</option>
						<option value="video">Videos</option>
						<option value="audio">Audio</option>
					</select>
				</div>
				<div v-if="loading" class="text-center py-8">Loading...</div>
				<div
					v-else-if="filteredAssets.length === 0"
					class="text-center py-8 text-gray-500"
				>
					No assets found
				</div>
				<div v-else class="grid grid-cols-3 gap-4">
					<div
						v-for="asset in filteredAssets"
						:key="asset.id"
						class="border rounded p-2 cursor-pointer hover:bg-gray-50"
						@click="$emit('select', asset)"
					>
						<img
							v-if="asset.thumbnail"
							:src="asset.thumbnail"
							:alt="asset.name"
							class="w-full h-24 object-cover rounded"
						/>
						<div
							v-else
							class="w-full h-24 bg-gray-200 rounded flex items-center justify-center"
						>
							<span class="text-gray-400">{{ asset.type }}</span>
						</div>
						<p class="mt-2 text-sm font-medium truncate">{{ asset.name }}</p>
					</div>
				</div>
			</div>
		</template>
	</Modal>
</template>
