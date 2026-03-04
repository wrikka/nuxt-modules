<script setup lang="ts">
const showPluginManager = ref(false);
const pluginStore = usePluginStore();
const activeTab = ref<"installed" | "marketplace">("installed");

const manifestUrl = ref("");
const isInstalling = ref(false);

const installFromUrl = async () => {
	if (!manifestUrl.value) return;
	isInstalling.value = true;
	try {
		await pluginStore.installPlugin(manifestUrl.value);
		manifestUrl.value = "";
	} catch (error) {
		console.error("Failed to install plugin:", error);
	} finally {
		isInstalling.value = false;
	}
};

const togglePlugin = async (pluginId: string, enabled: boolean) => {
	if (enabled) {
		await pluginStore.enablePlugin(pluginId);
	} else {
		pluginStore.disablePlugin(pluginId);
	}
};

// Sample marketplace plugins
const marketplacePlugins = [
	{
		id: "ai-enhance",
		name: "AI Video Enhancement",
		description: "Upscale and enhance video quality using AI",
		author: "MediaStudio Labs",
		version: "1.0.0",
		downloads: 12500,
		rating: 4.8,
	},
	{
		id: "green-screen",
		name: "Advanced Chroma Key",
		description: "Professional green screen removal with spill suppression",
		author: "VideoPro Tools",
		version: "2.1.0",
		downloads: 8900,
		rating: 4.6,
	},
	{
		id: "motion-track",
		name: "Motion Tracking",
		description: "Track objects and apply motion data to layers",
		author: "MotionFX",
		version: "1.5.0",
		downloads: 5600,
		rating: 4.4,
	},
	{
		id: "audio-sync",
		name: "Auto Audio Sync",
		description: "Automatically sync audio and video using waveform analysis",
		author: "AudioTools",
		version: "1.2.0",
		downloads: 4200,
		rating: 4.7,
	},
];
</script>

<template>
	<div>
		<!-- Floating Action Button -->
		<button
			class="fixed left-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-blue-400 ring-offset-2': showPluginManager }"
			@click="showPluginManager = !showPluginManager"
			title="Plugin Manager"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 2H2v10h10V2zM22 12h-10v10h10V12zM12 12H2v10h10V12zM22 2h-10v10h10V2z" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showPluginManager"
				class="fixed left-4 bottom-20 z-50 w-96 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Plugin Manager</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showPluginManager = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Tabs -->
				<div class="flex border-b border-gray-800">
					<button
						class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
						:class="activeTab === 'installed'
						? 'bg-blue-600 text-white'
						: 'text-gray-400 hover:text-white'"
						@click="activeTab = 'installed'"
					>
						Installed ({{ pluginStore.installedPlugins.length }})
					</button>
					<button
						class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
						:class="activeTab === 'marketplace'
						? 'bg-blue-600 text-white'
						: 'text-gray-400 hover:text-white'"
						@click="activeTab = 'marketplace'"
					>
						Marketplace
					</button>
				</div>

				<!-- Installed Plugins -->
				<div
					v-if="activeTab === 'installed'"
					class="p-4 space-y-3 max-h-80 overflow-y-auto"
				>
					<!-- Install from URL -->
					<div class="flex gap-2">
						<input
							v-model="manifestUrl"
							type="text"
							placeholder="Plugin manifest URL..."
							class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
						<button
							class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
							:disabled="isInstalling || !manifestUrl"
							@click="installFromUrl"
						>
							<svg
								v-if="isInstalling"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="animate-spin"
							>
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
							<span v-else>Install</span>
						</button>
					</div>

					<!-- Plugin List -->
					<div
						v-if="pluginStore.installedPlugins.length === 0"
						class="text-center py-8 text-gray-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1"
							class="mx-auto mb-2 opacity-50"
						>
							<path d="M12 2H2v10h10V2zM22 12h-10v10h10V12zM12 12H2v10h10V12zM22 2h-10v10h10V2z" />
						</svg>
						<p class="text-sm">No plugins installed</p>
						<p class="text-xs mt-1">
							Install plugins from the marketplace or URL
						</p>
					</div>

					<div
						v-for="plugin in pluginStore.installedPlugins"
						:key="plugin.manifest.id"
						class="p-3 rounded-lg bg-gray-800 border border-gray-700"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<h4 class="text-white text-sm font-medium">
										{{ plugin.manifest.name }}
									</h4>
									<span
										class="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400 text-[10px]"
									>v{{ plugin.manifest.version }}</span>
								</div>
								<p class="text-gray-500 text-xs mt-1">
									{{ plugin.manifest.description }}
								</p>
								<p class="text-gray-600 text-[10px] mt-1">
									by {{ plugin.manifest.author }}
								</p>
							</div>
							<div class="flex items-center gap-2">
								<button
									class="w-10 h-5 rounded-full transition-colors relative"
									:class="plugin.enabled ? 'bg-blue-600' : 'bg-gray-700'"
									@click="togglePlugin(plugin.manifest.id, !plugin.enabled)"
								>
									<span
										class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
										:class="plugin.enabled ? 'left-5' : 'left-0.5'"
									/>
								</button>
								<button
									class="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
									@click="pluginStore.uninstallPlugin(plugin.manifest.id)"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
									</svg>
								</button>
							</div>
						</div>

						<!-- Permissions -->
						<div
							v-if="plugin.manifest.permissions.length > 0"
							class="mt-2 flex flex-wrap gap-1"
						>
							<span
								v-for="perm in plugin.manifest.permissions"
								:key="perm"
								class="px-1.5 py-0.5 bg-gray-900 rounded text-gray-500 text-[10px]"
							>
								{{ perm }}
							</span>
						</div>
					</div>
				</div>

				<!-- Marketplace -->
				<div v-else class="p-4 space-y-3 max-h-80 overflow-y-auto">
					<div
						v-for="plugin in marketplacePlugins"
						:key="plugin.id"
						class="p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<h4 class="text-white text-sm font-medium">
										{{ plugin.name }}
									</h4>
									<span
										class="px-1.5 py-0.5 bg-blue-900 bg-opacity-50 rounded text-blue-300 text-[10px]"
									>v{{ plugin.version }}</span>
								</div>
								<p class="text-gray-500 text-xs mt-1">
									{{ plugin.description }}
								</p>
								<div class="flex items-center gap-3 mt-2">
									<span class="text-gray-600 text-[10px]">by {{
											plugin.author
										}}</span>
									<span
										class="flex items-center gap-1 text-amber-400 text-[10px]"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="10"
											height="10"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
										</svg>
										{{ plugin.rating }}
									</span>
									<span class="text-gray-600 text-[10px]">{{
											plugin.downloads.toLocaleString()
										}} downloads</span>
								</div>
							</div>
							<button
								class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
								:disabled="pluginStore.installedPlugins.some(p =>
									p.manifest.id === plugin.id
								)"
								@click="installFromUrl"
							>
								{{
									pluginStore.installedPlugins.some(p =>
										p.manifest.id === plugin.id
									)
									? "Installed"
									: "Install"
								}}
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
