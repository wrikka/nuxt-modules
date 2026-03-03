<script setup lang="ts">
const sources = ref([
	{
		id: "unsplash",
		name: "Unsplash",
		icon: "mdi:camera",
		connected: true,
		images: "2M+",
	},
	{
		id: "pexels",
		name: "Pexels",
		icon: "mdi:image-multiple",
		connected: false,
		images: "3M+",
	},
	{
		id: "icons8",
		name: "Icons8",
		icon: "mdi:emoticon",
		connected: true,
		images: "500K+",
	},
	{
		id: "gfonts",
		name: "Google Fonts",
		icon: "mdi:format-font",
		connected: true,
		fonts: "1500+",
	},
]);

const searchQuery = ref("");
const results = ref([
	{
		id: "1",
		source: "Unsplash",
		title: "Mountain landscape",
		thumbnail: "",
		type: "photo",
	},
	{
		id: "2",
		source: "Icons8",
		title: "User avatar icon",
		thumbnail: "",
		type: "icon",
	},
	{
		id: "3",
		source: "Google Fonts",
		title: "Inter",
		thumbnail: "",
		type: "font",
	},
]);

const toggleConnection = (source: any) => {
	source.connected = !source.connected;
};

const importAsset = (asset: any) => {
	console.log("Importing:", asset);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Stock Media
			</h3>
			<button class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
				Connect Source
			</button>
		</div>

		<!-- Search -->
		<div class="relative mb-4">
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search photos, icons, fonts..."
				class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg"
			/>
			<Icon
				name="mdi:magnify"
				class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
			/>
		</div>

		<!-- Connected Sources -->
		<div class="mb-4">
			<p class="text-sm text-gray-500 mb-2">Connected Sources</p>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="source in sources"
					:key="source.id"
					@click="toggleConnection(source)"
					:class="{ 'opacity-50': !source.connected }"
					class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
				>
					<Icon :name="source.icon" class="w-4 h-4" />
					<span>{{ source.name }}</span>
					<span class="text-xs text-gray-500">{{
						source.images || source.fonts
					}}</span>
				</button>
			</div>
		</div>

		<!-- Results Grid -->
		<div class="grid grid-cols-3 gap-2">
			<div
				v-for="asset in results"
				:key="asset.id"
				class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg relative group overflow-hidden"
			>
				<div class="absolute inset-0 flex items-center justify-center">
					<Icon
						:name="asset.type === 'photo'
						? 'mdi:image'
						: asset.type === 'icon'
						? 'mdi:emoticon'
						: 'mdi:format-font'"
						class="w-8 h-8 text-gray-400"
					/>
				</div>
				<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<button
						@click="importAsset(asset)"
						class="px-3 py-1 bg-white text-gray-900 rounded text-sm"
					>
						Import
					</button>
				</div>
				<div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
					<p class="text-white text-xs truncate">{{ asset.title }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
