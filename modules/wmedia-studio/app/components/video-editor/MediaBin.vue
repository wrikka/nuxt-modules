<script setup lang="ts">
import type { MediaAsset } from "#shared/types";

interface Props {
	assets: MediaAsset[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(
		e: "addToTimeline",
		asset: MediaAsset,
		trackId: string,
		startTime: number,
	): void;
	(e: "remove", assetId: string): void;
	(e: "updateTags", assetId: string, tags: string[]): void;
	(e: "autoTag", assetId: string): void;
}>();

const { autoTagMediaAsset } = useVideoEditor();
const taggingAssetId = ref<string | null>(null);

const searchQuery = ref("");
const selectedFilter = ref<"all" | "video" | "audio" | "image">("all");

const filteredAssets = computed(() => {
	let result = props.assets;

	// Filter by type
	if (selectedFilter.value !== "all") {
		result = result.filter((a) => a.type === selectedFilter.value);
	}

	// Filter by search query
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(
			(a) =>
				a.name.toLowerCase().includes(query)
				|| a.tags?.some((t) => t.toLowerCase().includes(query)),
		);
	}

	return result;
});

const assetCounts = computed(() => ({
	all: props.assets.length,
	video: props.assets.filter((a) => a.type === "video").length,
	audio: props.assets.filter((a) => a.type === "audio").length,
	image: props.assets.filter((a) => a.type === "image").length,
}));

const formatDuration = (seconds?: number): string => {
	if (!seconds) return "--:--";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes?: number): string => {
	if (!bytes) return "--";
	const mb = bytes / (1024 * 1024);
	if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${mb.toFixed(1)} MB`;
};

const handleDragStart = (event: DragEvent, asset: MediaAsset) => {
	event.dataTransfer?.setData("mediaAsset", JSON.stringify(asset));
};

const handleAssetClick = (asset: MediaAsset) => {
	// Could open preview or details panel
	console.log("Asset clicked:", asset.name);
};

const handleAutoTag = async (asset: MediaAsset) => {
	if (asset.type === "audio") return;
	taggingAssetId.value = asset.id;
	await autoTagMediaAsset(asset.id);
	taggingAssetId.value = null;
};
</script>

<template>
	<div class="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
		<!-- Header -->
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Media Bin</span>
		</div>

		<!-- Search -->
		<div class="p-3 border-b border-gray-700">
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search assets..."
				class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
			>
		</div>

		<!-- Filters -->
		<div class="flex border-b border-gray-700">
			<button
				v-for='filter in ["all", "video", "audio", "image"] as const'
				:key="filter"
				class="flex-1 py-2 text-xs font-medium capitalize"
				:class="selectedFilter === filter
				? 'bg-blue-600 text-white'
				: 'text-gray-400 hover:bg-gray-800'"
				@click="selectedFilter = filter"
			>
				{{ filter }}
				<span class="ml-1 text-xs opacity-70">({{ assetCounts[filter] }})</span>
			</button>
		</div>

		<!-- Assets Grid -->
		<div class="flex-1 overflow-y-auto p-3">
			<div
				v-if="filteredAssets.length === 0"
				class="text-gray-500 text-sm text-center py-8"
			>
				{{ searchQuery ? "No assets found" : "No assets imported yet" }}
			</div>

			<div v-else class="grid grid-cols-2 gap-2">
				<div
					v-for="asset in filteredAssets"
					:key="asset.id"
					class="group relative bg-gray-800 rounded overflow-hidden cursor-move hover:bg-gray-700 transition-colors"
					draggable="true"
					@dragstart="handleDragStart($event, asset)"
					@click="handleAssetClick(asset)"
				>
					<!-- Thumbnail / Icon -->
					<div class="aspect-video bg-gray-700 flex items-center justify-center relative">
						<img
							v-if="asset.thumbnailUrl"
							:src="asset.thumbnailUrl"
							class="w-full h-full object-cover"
							:alt="asset.name"
						>
						<span v-else class="text-2xl">
							{{
								asset.type === "video"
								? "🎬"
								: asset.type === "audio"
								? "🔊"
								: "🖼️"
							}}
						</span>

						<!-- Type Badge -->
						<span
							class="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black bg-opacity-70 text-white uppercase"
						>
							{{ asset.type }}
						</span>

						<!-- Auto Tag Button (for video/image) -->
						<button
							v-if="asset.type !== 'audio'"
							class="absolute bottom-1 left-1 p-1 rounded bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
							:title="asset.tags?.length ? 'Retag with AI' : 'Auto-tag with AI'"
							:disabled="taggingAssetId === asset.id"
							@click.stop="handleAutoTag(asset)"
						>
							<svg
								v-if="taggingAssetId === asset.id"
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="animate-spin"
							>
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
							<svg
								v-else
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M12 2v4" />
								<path d="m16.2 7.8 2.9-2.9" />
								<path d="M18 12h4" />
								<path d="m16.2 16.2 2.9 2.9" />
								<path d="M12 18v4" />
								<path d="m4.9 19.1 2.9-2.9" />
								<path d="M2 12h4" />
								<path d="m4.9 4.9 2.9 2.9" />
							</svg>
						</button>
						<span
							v-if="asset.duration"
							class="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black bg-opacity-70 text-white"
						>
							{{ formatDuration(asset.duration) }}
						</span>

						<!-- Delete Button -->
						<button
							class="absolute top-1 right-1 p-1 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
							@click.stop="$emit('remove', asset.id)"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>

					<!-- Info -->
					<div class="p-2">
						<div class="text-white text-xs truncate" :title="asset.name">
							{{ asset.name }}
						</div>
						<div class="text-gray-500 text-[10px]">
							{{ formatFileSize(asset.fileSize) }}
						</div>

						<!-- Tags -->
						<div v-if="asset.tags?.length" class="flex flex-wrap gap-1 mt-1">
							<span
								v-for="tag in asset.tags.slice(0, 2)"
								:key="tag"
								class="text-[9px] px-1 py-0.5 rounded bg-gray-700 text-gray-300"
							>
								{{ tag }}
							</span>
							<span
								v-if="asset.tags.length > 2"
								class="text-[9px] text-gray-500"
							>+{{ asset.tags.length - 2 }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Info -->
		<div class="h-8 bg-gray-800 flex items-center justify-between px-4 border-t border-gray-700">
			<span class="text-gray-400 text-xs">{{ filteredAssets.length }}
				items</span>
			<span class="text-gray-500 text-[10px]">Drag to timeline</span>
		</div>
	</div>
</template>
