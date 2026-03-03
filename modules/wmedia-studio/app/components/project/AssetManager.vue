<script setup lang="ts">
const emit = defineEmits<{ close: []; organize: [] }>();
const assets = ref([{
	id: "1",
	name: "Hero Image",
	category: "images",
	tags: ["hero", "main"],
	usage: 12,
}, {
	id: "2",
	name: "Logo",
	category: "branding",
	tags: ["logo", "brand"],
	usage: 45,
}, {
	id: "3",
	name: "Background Music",
	category: "audio",
	tags: ["bgm", "music"],
	usage: 8,
}]);
const categories = ref(["images", "videos", "audio", "fonts", "branding"]);
const selectedCategory = ref("all");
const sortBy = ref("usage");
const viewMode = ref("grid");
</script>
<template>
	<div class="asset-manager bg-gray-800 rounded-lg p-4 w-[600px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-package" class="w-5 h-5" />Asset Manager
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<select
				v-model="selectedCategory"
				class="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm"
			>
				<option value="all">All Categories</option>
				<option v-for="cat in categories" :key="cat" :value="cat">
					{{ cat }}
				</option>
			</select>
			<select
				v-model="sortBy"
				class="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm"
			>
				<option value="usage">Most Used</option>
				<option value="name">Name</option>
				<option value="date">Date Added</option>
			</select>
			<div class="flex-1"></div>
			<button
				class="p-1.5 rounded-lg"
				:class="viewMode === 'grid'
				? 'bg-blue-600 text-white'
				: 'bg-gray-700 text-gray-400'"
				@click="viewMode = 'grid'"
			>
				<Icon name="i-ph-squares-four" class="w-5 h-5" />
			</button>
			<button
				class="p-1.5 rounded-lg"
				:class="viewMode === 'list'
				? 'bg-blue-600 text-white'
				: 'bg-gray-700 text-gray-400'"
				@click="viewMode = 'list'"
			>
				<Icon name="i-ph-list" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto">
			<div v-if="viewMode === 'grid'" class="grid grid-cols-3 gap-3">
				<div
					v-for="asset in assets"
					:key="asset.id"
					class="p-3 bg-gray-700/50 rounded-lg"
				>
					<div class="aspect-square bg-gray-600 rounded-lg mb-2" />
					<div class="text-white text-sm truncate">{{ asset.name }}</div>
					<div class="flex flex-wrap gap-1 mt-1">
						<span
							v-for="tag in asset.tags"
							:key="tag"
							class="px-1.5 py-0.5 bg-gray-600 text-gray-300 rounded text-xs"
						>{{ tag }}</span>
					</div>
					<div class="text-gray-500 text-xs mt-1">
						Used {{ asset.usage }} times
					</div>
				</div>
			</div>
			<div v-else class="space-y-2">
				<div
					v-for="asset in assets"
					:key="asset.id"
					class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
				>
					<div class="w-12 h-12 bg-gray-600 rounded" />
					<div class="flex-1">
						<div class="text-white text-sm">{{ asset.name }}</div>
						<div class="flex flex-wrap gap-1">
							<span
								v-for="tag in asset.tags"
								:key="tag"
								class="px-1.5 py-0.5 bg-gray-600 text-gray-300 rounded text-xs"
							>{{ tag }}</span>
						</div>
					</div>
					<div class="text-gray-500 text-xs">{{ asset.usage }} uses</div>
				</div>
			</div>
		</div>
	</div>
</template>
