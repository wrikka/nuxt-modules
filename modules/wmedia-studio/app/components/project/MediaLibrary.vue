<script setup lang="ts">
const emit = defineEmits<{ close: []; select: [asset: any] }>();
const assets = ref([{
	id: "1",
	name: "Background.jpg",
	type: "image",
	size: "2.4 MB",
	date: "2024-01-15",
}, {
	id: "2",
	name: "Logo.png",
	type: "image",
	size: "156 KB",
	date: "2024-01-14",
}, {
	id: "3",
	name: "Music.mp3",
	type: "audio",
	size: "4.2 MB",
	date: "2024-01-13",
}, {
	id: "4",
	name: "Video.mp4",
	type: "video",
	size: "45 MB",
	date: "2024-01-12",
}]);
const filter = ref("all");
const search = ref("");
const filteredAssets = computed(() =>
	assets.value.filter(a =>
		(filter.value === "all" || a.type === filter.value)
		&& a.name.toLowerCase().includes(search.value.toLowerCase())
	)
);
const filters = [{ id: "all", name: "All" }, { id: "image", name: "Images" }, {
	id: "video",
	name: "Videos",
}, { id: "audio", name: "Audio" }];
const getIcon = (
	type: string,
) => ({
	image: "i-ph-image",
	video: "i-ph-video",
	audio: "i-ph-speaker-high",
}[type] || "i-ph-file");
</script>
<template>
	<div class="media-library bg-gray-800 rounded-lg p-4 w-[500px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-film-strip" class="w-5 h-5" />Media Library
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<input
			v-model="search"
			type="text"
			placeholder="Search assets..."
			class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm mb-3"
		/>
		<div class="flex gap-2 mb-3">
			<button
				v-for="f in filters"
				:key="f.id"
				class="px-3 py-1 rounded-full text-xs"
				:class="filter === f.id
				? 'bg-blue-600 text-white'
				: 'bg-gray-700 text-gray-300'"
				@click="filter = f.id"
			>
				{{ f.name }}
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-2">
			<div
				v-for="asset in filteredAssets"
				:key="asset.id"
				class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700"
				@click="emit('select', asset)"
			>
				<Icon :name="getIcon(asset.type)" class="w-8 h-8 text-gray-400" />
				<div class="flex-1">
					<div class="text-white text-sm">{{ asset.name }}</div>
					<div class="text-gray-500 text-xs">
						{{ asset.type }} • {{ asset.size }} • {{ asset.date }}
					</div>
				</div>
			</div>
		</div>
		<div class="mt-3 pt-3 border-t border-gray-700 text-center text-gray-500 text-xs">
			{{ filteredAssets.length }} assets
		</div>
	</div>
</template>
