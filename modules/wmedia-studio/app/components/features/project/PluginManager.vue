<script setup lang="ts">
interface Plugin {
	id: string;
	name: string;
	description: string;
	author: string;
	version: string;
	installed: boolean;
	enabled: boolean;
	rating: number;
	downloads: number;
	icon: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	install: [pluginId: string];
	uninstall: [pluginId: string];
	toggle: [pluginId: string, enabled: boolean];
}>();

const searchQuery = ref("");
const activeTab = ref<"installed" | "browse">("installed");

const plugins = ref<Plugin[]>([
	{
		id: "p1",
		name: "Unsplash",
		description: "Search and insert free photos",
		author: "Media Studio",
		version: "1.2.0",
		installed: true,
		enabled: true,
		rating: 4.8,
		downloads: 50000,
		icon: "mdi:image",
	},
	{
		id: "p2",
		name: "Lottie",
		description: "Add animated illustrations",
		author: "LottieFiles",
		version: "2.1.0",
		installed: true,
		enabled: true,
		rating: 4.9,
		downloads: 35000,
		icon: "mdi:play",
	},
	{
		id: "p3",
		name: "Chart Maker",
		description: "Create beautiful charts",
		author: "DataViz",
		version: "1.0.5",
		installed: false,
		enabled: false,
		rating: 4.5,
		downloads: 12000,
		icon: "mdi:chart-bar",
	},
	{
		id: "p4",
		name: "Iconify",
		description: "100,000+ icons",
		author: "Iconify",
		version: "3.0.0",
		installed: true,
		enabled: false,
		rating: 4.7,
		downloads: 80000,
		icon: "mdi:emoticon",
	},
	{
		id: "p5",
		name: "3D Shapes",
		description: "Add 3D elements",
		author: "3D Lab",
		version: "1.1.0",
		installed: false,
		enabled: false,
		rating: 4.2,
		downloads: 8000,
		icon: "mdi:cube-outline",
	},
]);

const filteredPlugins = computed(() => {
	let filtered = plugins.value;
	if (activeTab.value === "installed") {
		filtered = filtered.filter(p => p.installed);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(p =>
			p.name.toLowerCase().includes(query)
			|| p.description.toLowerCase().includes(query)
		);
	}
	return filtered;
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-3xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:puzzle" class="w-7 h-7 text-purple-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Plugin Manager
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<!-- Search & Tabs -->
			<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
				<div class="relative">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search plugins..."
						class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
					>
				</div>
				<div class="flex gap-2">
					<button
						v-for='tab in ["installed", "browse"] as const'
						:key="tab"
						:class="[
							'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
							activeTab === tab
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200',
						]"
						@click="activeTab = tab"
					>
						{{ tab }}
						<span
							v-if="tab === 'installed'"
							class="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs"
						>
							{{ plugins.filter(p => p.installed).length }}
						</span>
					</button>
				</div>
			</div>

			<!-- Plugins List -->
			<div class="flex-1 overflow-y-auto p-6">
				<div class="space-y-3">
					<div
						v-for="plugin in filteredPlugins"
						:key="plugin.id"
						class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
					>
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
								<Icon :name="plugin.icon" class="w-6 h-6 text-purple-500" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-medium text-gray-900 dark:text-white">
										{{ plugin.name }}
									</h3>
									<span class="text-xs text-gray-500">v{{
											plugin.version
										}}</span>
								</div>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{{ plugin.description }}
								</p>
								<p class="text-xs text-gray-400 mt-1">by {{ plugin.author }}</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<div
								v-if="!plugin.installed"
								class="text-xs text-gray-500 text-right"
							>
								<div class="flex items-center gap-1">
									<Icon name="mdi:star" class="w-3 h-3 text-yellow-500" />
									{{ plugin.rating }}
								</div>
								<div>{{ plugin.downloads.toLocaleString() }} downloads</div>
							</div>

							<!-- Toggle -->
							<button
								v-if="plugin.installed"
								:class="[
									'w-12 h-6 rounded-full transition-colors relative',
									plugin.enabled
										? 'bg-blue-500'
										: 'bg-gray-300 dark:bg-gray-600',
								]"
								@click="emit('toggle', plugin.id, !plugin.enabled)"
							>
								<div
									:class="[
										'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all',
										plugin.enabled ? 'right-0.5' : 'left-0.5',
									]"
								/>
							</button>

							<!-- Install/Uninstall -->
							<button
								v-if="!plugin.installed"
								class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
								@click="emit('install', plugin.id)"
							>
								Install
							</button>
							<button
								v-else
								class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
								@click="emit('uninstall', plugin.id)"
							>
								<Icon name="mdi:delete" class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
