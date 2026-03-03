<script setup lang="ts">
interface Plugin {
	id: string;
	name: string;
	description: string;
	version: string;
	author: string;
	icon: string;
	category: "effects" | "transitions" | "tools" | "export" | "ai";
	rating: number;
	downloads: number;
	installed: boolean;
	enabled: boolean;
	price: "free" | "paid";
	tags: string[];
}

const plugins = ref<Plugin[]>([
	{
		id: "1",
		name: "Glitch Effects Pack",
		description: "Cyberpunk glitch and distortion effects",
		version: "2.1.0",
		author: "PixelForge",
		icon: "mdi:lightning-bolt",
		category: "effects",
		rating: 4.8,
		downloads: 12500,
		installed: true,
		enabled: true,
		price: "free",
		tags: ["glitch", "cyberpunk", "distortion"],
	},
	{
		id: "2",
		name: "Cinematic Transitions",
		description: "Professional film-style transition pack",
		version: "1.5.2",
		author: "FilmCraft",
		icon: "mdi:movie-open",
		category: "transitions",
		rating: 4.9,
		downloads: 28000,
		installed: true,
		enabled: true,
		price: "paid",
		tags: ["film", "cinematic", "professional"],
	},
	{
		id: "3",
		name: "AI Color Grading",
		description: "Automatic color grading with AI",
		version: "3.0.1",
		author: "ColorAI",
		icon: "mdi:palette",
		category: "ai",
		rating: 4.7,
		downloads: 8900,
		installed: false,
		enabled: false,
		price: "paid",
		tags: ["ai", "color", "grading"],
	},
	{
		id: "4",
		name: "Motion Graphics Templates",
		description: "Animated text and shape templates",
		version: "1.2.0",
		author: "MotionLab",
		icon: "mdi:animation",
		category: "effects",
		rating: 4.6,
		downloads: 15600,
		installed: true,
		enabled: false,
		price: "free",
		tags: ["motion", "text", "animation"],
	},
	{
		id: "5",
		name: "Batch Exporter Pro",
		description: "Export multiple formats simultaneously",
		version: "2.0.0",
		author: "ExportKing",
		icon: "mdi:export",
		category: "export",
		rating: 4.5,
		downloads: 6700,
		installed: false,
		enabled: false,
		price: "paid",
		tags: ["batch", "export", "automation"],
	},
	{
		id: "6",
		name: "3D Camera Tracker",
		description: "Advanced 3D motion tracking",
		version: "1.8.5",
		author: "Track3D",
		icon: "mdi:video-3d",
		category: "tools",
		rating: 4.9,
		downloads: 4200,
		installed: true,
		enabled: true,
		price: "paid",
		tags: ["3d", "tracking", "camera"],
	},
]);

const searchQuery = ref("");
const selectedCategory = ref("all");
const activeTab = ref<"installed" | "marketplace" | "updates">("installed");
const showInstallModal = ref(false);
const selectedPlugin = ref<Plugin | null>(null);

const categories = [
	{ id: "all", name: "All", icon: "mdi:apps" },
	{ id: "effects", name: "Effects", icon: "mdi:magic" },
	{ id: "transitions", name: "Transitions", icon: "mdi:transition" },
	{ id: "tools", name: "Tools", icon: "mdi:tools" },
	{ id: "export", name: "Export", icon: "mdi:export" },
	{ id: "ai", name: "AI", icon: "mdi:brain" },
];

const filteredPlugins = computed(() => {
	return plugins.value.filter(p => {
		const matchesSearch =
			p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| p.tags.some(t =>
				t.toLowerCase().includes(searchQuery.value.toLowerCase())
			);
		const matchesCategory = selectedCategory.value === "all"
			|| p.category === selectedCategory.value;

		if (activeTab.value === "installed") {
			return matchesSearch && matchesCategory && p.installed;
		} else if (activeTab.value === "marketplace") {
			return matchesSearch && matchesCategory && !p.installed;
		}
		return matchesSearch && matchesCategory;
	});
});

const installedCount = computed(() =>
	plugins.value.filter(p => p.installed).length
);
const enabledCount = computed(() =>
	plugins.value.filter(p => p.installed && p.enabled).length
);
const updateCount = computed(() => 2); // Mock

function togglePlugin(plugin: Plugin) {
	if (plugin.installed) {
		plugin.enabled = !plugin.enabled;
	}
}

function installPlugin(plugin: Plugin) {
	selectedPlugin.value = plugin;
	showInstallModal.value = true;
}

function confirmInstall() {
	if (selectedPlugin.value) {
		selectedPlugin.value.installed = true;
		selectedPlugin.value.enabled = true;
		showInstallModal.value = false;
	}
}

function uninstallPlugin(plugin: Plugin) {
	plugin.installed = false;
	plugin.enabled = false;
}
</script>

<template>
	<div class="plugin-system">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:puzzle" class="mr-2" />
			Plugin & Extension System
		</h2>
		<p class="text-gray-500 mb-6">Third-party plugin marketplace with API</p>

		<!-- Stats Bar -->
		<div class="flex gap-4 mb-6">
			<div class="flex-1 bg-blue-50 rounded-lg p-4">
				<div class="text-2xl font-bold text-blue-600">{{ installedCount }}</div>
				<div class="text-sm text-gray-600">Installed</div>
			</div>
			<div class="flex-1 bg-green-50 rounded-lg p-4">
				<div class="text-2xl font-bold text-green-600">{{ enabledCount }}</div>
				<div class="text-sm text-gray-600">Active</div>
			</div>
			<div class="flex-1 bg-yellow-50 rounded-lg p-4">
				<div class="text-2xl font-bold text-yellow-600">{{ updateCount }}</div>
				<div class="text-sm text-gray-600">Updates</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex gap-2 mb-6 border-b">
			<button
				v-for='tab in ["installed", "marketplace", "updates"] as const'
				:key="tab"
				@click="activeTab = tab"
				class="px-4 py-2 font-medium capitalize"
				:class="activeTab === tab
				? 'border-b-2 border-blue-600 text-blue-600'
				: 'text-gray-500 hover:text-gray-700'"
			>
				{{ tab }}
				<span
					v-if="tab === 'updates' && updateCount > 0"
					class="ml-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full"
				>
					{{ updateCount }}
				</span>
			</button>
		</div>

		<!-- Search & Filter -->
		<div class="flex gap-4 mb-6">
			<div class="flex-1 relative">
				<Icon
					name="mdi:magnify"
					class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
				/>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search plugins..."
					class="w-full pl-10 pr-4 py-2 border rounded-lg"
				/>
			</div>
			<div class="flex gap-2">
				<button
					v-for="cat in categories"
					:key="cat.id"
					@click="selectedCategory = cat.id"
					class="px-3 py-2 rounded-lg text-sm flex items-center gap-1"
					:class="selectedCategory === cat.id
					? 'bg-blue-600 text-white'
					: 'border hover:bg-gray-50'"
				>
					<Icon :name="cat.icon" />
					{{ cat.name }}
				</button>
			</div>
		</div>

		<!-- Plugins Grid -->
		<div class="grid grid-cols-3 gap-4">
			<div
				v-for="plugin in filteredPlugins"
				:key="plugin.id"
				class="plugin-card border rounded-lg p-4 hover:shadow-lg transition-shadow"
				:class="{ 'opacity-50': plugin.installed && !plugin.enabled }"
			>
				<div class="flex items-start gap-3 mb-3">
					<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
						<Icon :name="plugin.icon" class="text-2xl" />
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<h3 class="font-semibold truncate">{{ plugin.name }}</h3>
							<span
								v-if="plugin.price === 'paid'"
								class="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded"
							>
								PRO
							</span>
						</div>
						<p class="text-sm text-gray-500">
							v{{ plugin.version }} by {{ plugin.author }}
						</p>
					</div>
				</div>

				<p class="text-sm text-gray-600 mb-3 line-clamp-2">
					{{ plugin.description }}
				</p>

				<div class="flex flex-wrap gap-1 mb-3">
					<span
						v-for="tag in plugin.tags.slice(0, 3)"
						:key="tag"
						class="text-xs bg-gray-100 px-2 py-0.5 rounded"
					>
						{{ tag }}
					</span>
				</div>

				<div class="flex items-center justify-between text-sm text-gray-500 mb-3">
					<span class="flex items-center gap-1">
						<Icon name="mdi:star" class="text-yellow-500" />
						{{ plugin.rating }}
					</span>
					<span>{{ plugin.downloads.toLocaleString() }} downloads</span>
				</div>

				<!-- Actions -->
				<div class="flex gap-2">
					<button
						v-if="!plugin.installed"
						@click="installPlugin(plugin)"
						class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
					>
						<Icon name="mdi:download" class="mr-1" />
						Install
					</button>
					<template v-else>
						<button
							@click="togglePlugin(plugin)"
							class="flex-1 py-2 rounded-lg border"
							:class="plugin.enabled
							? 'bg-green-50 border-green-200 text-green-700'
							: 'bg-gray-50'"
						>
							<Icon
								:name="plugin.enabled ? 'mdi:check' : 'mdi:close'"
								class="mr-1"
							/>
							{{ plugin.enabled ? "Enabled" : "Disabled" }}
						</button>
						<button
							@click="uninstallPlugin(plugin)"
							class="px-3 py-2 border rounded-lg text-red-600 hover:bg-red-50"
						>
							<Icon name="mdi:delete" />
						</button>
					</template>
				</div>
			</div>
		</div>

		<!-- Install Modal -->
		<div
			v-if="showInstallModal"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 class="text-xl font-bold mb-4">
					Install {{ selectedPlugin?.name }}
				</h3>

				<div class="bg-gray-50 rounded-lg p-4 mb-4">
					<div class="flex items-center gap-3 mb-3">
						<Icon
							:name="selectedPlugin?.icon || 'i-mdi-help'"
							class="text-3xl"
						/>
						<div>
							<p class="font-medium">{{ selectedPlugin?.name }}</p>
							<p class="text-sm text-gray-500">
								v{{ selectedPlugin?.version }}
							</p>
						</div>
					</div>
					<p class="text-sm text-gray-600">{{ selectedPlugin?.description }}</p>
				</div>

				<div class="space-y-3 mb-4">
					<div class="flex items-center gap-2 text-sm">
						<Icon name="mdi:shield-check" class="text-green-500" />
						<span>Verified by Media Studio</span>
					</div>
					<div class="flex items-center gap-2 text-sm">
						<Icon name="mdi:code-tags" class="text-blue-500" />
						<span>API Version: 2.0 compatible</span>
					</div>
				</div>

				<div class="flex justify-end gap-2">
					<button
						@click="showInstallModal = false"
						class="px-4 py-2 border rounded-lg"
					>
						Cancel
					</button>
					<button
						@click="confirmInstall"
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<Icon name="mdi:download" class="mr-1" />
						Install Plugin
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.plugin-system {
	padding: 1.5rem;
}

.plugin-card {
	transition: all 0.2s;
}
</style>
