<script setup lang="ts">
definePageMeta({ layout: "default" });

// Quick access states
const showAIChat = ref(false);
const showProjectDashboard = ref(false);
const showSettings = ref(false);
const showHelp = ref(false);
const showToolbox = ref(false);

// Recent projects
const recentProjects = ref([
	{
		id: "1",
		name: "Website Design",
		type: "designer",
		updatedAt: "2 hours ago",
		thumbnail: "",
	},
	{
		id: "2",
		name: "Logo Animation",
		type: "editor",
		updatedAt: "5 hours ago",
		thumbnail: "",
	},
	{
		id: "3",
		name: "Product Video",
		type: "video-editor",
		updatedAt: "1 day ago",
		thumbnail: "",
	},
]);

// Quick stats
const stats = ref({
	projects: 12,
	templates: 48,
	exports: 156,
	storage: "2.4 GB",
});

// Featured templates
const featuredTemplates = ref([
	{ id: "1", name: "Social Media Pack", category: "Social", downloads: 1200 },
	{ id: "2", name: "YouTube Thumbnail", category: "Video", downloads: 890 },
	{ id: "3", name: "Business Card", category: "Print", downloads: 650 },
]);

const router = useRouter();
const openProject = (id: string, type: string) => router.push(`/${type}/${id}`);
const createProject = (type: string) => router.push(`/${type}/new`);
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Top Navigation -->
		<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
			<div class="max-w-7xl mx-auto flex items-center justify-between">
				<div class="flex items-center gap-8">
					<h1 class="text-xl font-bold text-gray-900 dark:text-white">
						Media Studio
					</h1>
					<div class="hidden md:flex items-center gap-4">
						<button
							@click="showAIChat = true"
							class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						>
							<Icon name="mdi:robot" class="w-4 h-4" /> AI Assistant
						</button>
						<button
							@click="showToolbox = true"
							class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						>
							<Icon name="mdi:wrench" class="w-4 h-4" /> Tools
						</button>
						<button
							@click="showProjectDashboard = true"
							class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						>
							<Icon name="mdi:view-dashboard" class="w-4 h-4" /> Dashboard
						</button>
					</div>
				</div>
				<div class="flex items-center gap-3">
					<button
						@click="showHelp = true"
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
					>
						<Icon name="mdi:help-circle" class="w-5 h-5 text-gray-600" />
					</button>
					<button
						@click="showSettings = true"
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
					>
						<Icon name="mdi:cog" class="w-5 h-5 text-gray-600" />
					</button>
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
				</div>
			</div>
		</nav>

		<div class="max-w-7xl mx-auto px-6 py-8">
			<!-- Stats Row -->
			<div class="grid grid-cols-4 gap-4 mb-8">
				<div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
					<p class="text-sm text-gray-500">Projects</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{{ stats.projects }}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
					<p class="text-sm text-gray-500">Templates</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{{ stats.templates }}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
					<p class="text-sm text-gray-500">Exports</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{{ stats.exports }}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
					<p class="text-sm text-gray-500">Storage Used</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{{ stats.storage }}
					</p>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-8">
				<!-- Create New -->
				<div class="col-span-2 space-y-6">
					<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Create New
						</h2>
						<div class="grid grid-cols-3 gap-4">
							<button
								@click="createProject('designer')"
								class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:scale-105 transition-transform text-center"
							>
								<Icon
									name="mdi:palette"
									class="w-8 h-8 text-blue-500 mx-auto mb-2 block"
								/>
								<span class="font-medium text-gray-900 dark:text-white"
								>Web Design</span>
							</button>
							<button
								@click="createProject('editor')"
								class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:scale-105 transition-transform text-center"
							>
								<Icon
									name="mdi:image"
									class="w-8 h-8 text-green-500 mx-auto mb-2 block"
								/>
								<span class="font-medium text-gray-900 dark:text-white"
								>Graphics</span>
							</button>
							<button
								@click="createProject('video-editor')"
								class="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl hover:scale-105 transition-transform text-center"
							>
								<Icon
									name="mdi:video"
									class="w-8 h-8 text-pink-500 mx-auto mb-2 block"
								/>
								<span class="font-medium text-gray-900 dark:text-white"
								>Video</span>
							</button>
						</div>
					</div>

					<!-- Recent Projects -->
					<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Recent Projects
						</h2>
						<div class="space-y-3">
							<div
								v-for="project in recentProjects"
								:key="project.id"
								@click="openProject(project.id, project.type)"
								class="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
							>
								<div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
									<Icon
										:name="project.type === 'designer'
										? 'mdi:palette'
										: project.type === 'editor'
										? 'mdi:image'
										: 'mdi:video'"
										:class="project.type === 'designer'
										? 'text-blue-500'
										: project.type === 'editor'
										? 'text-green-500'
										: 'text-pink-500'"
										class="w-6 h-6"
									/>
								</div>
								<div class="flex-1">
									<p class="font-medium text-gray-900 dark:text-white">
										{{ project.name }}
									</p>
									<p class="text-sm text-gray-500">{{ project.updatedAt }}</p>
								</div>
								<Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
							</div>
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Featured Templates -->
					<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Popular Templates
						</h2>
						<div class="space-y-3">
							<div
								v-for="template in featuredTemplates"
								:key="template.id"
								class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
							>
								<div class="flex items-center justify-between">
									<span
										class="font-medium text-gray-900 dark:text-white text-sm"
									>{{ template.name }}</span>
									<span class="text-xs text-gray-500">{{ template.downloads }}
										uses</span>
								</div>
								<span class="text-xs text-blue-500">{{
									template.category
								}}</span>
							</div>
						</div>
						<button
							@click="$router.push('/templates')"
							class="w-full mt-4 py-2 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
						>
							Browse All Templates
						</button>
					</div>

					<!-- Quick Actions -->
					<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Quick Actions
						</h2>
						<div class="space-y-2">
							<button class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
								<Icon name="mdi:upload" class="w-5 h-5 text-gray-500" />
								<span class="text-gray-700 dark:text-gray-300"
								>Import File</span>
							</button>
							<button class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
								<Icon name="mdi:folder-plus" class="w-5 h-5 text-gray-500" />
								<span class="text-gray-700 dark:text-gray-300">New Folder</span>
							</button>
							<button class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
								<Icon name="mdi:share" class="w-5 h-5 text-gray-500" />
								<span class="text-gray-700 dark:text-gray-300"
								>Share Project</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Global Panels -->
		<AIChatPanel :is-open="showAIChat" @close="showAIChat = false" />
		<ProjectDashboard
			:is-open="showProjectDashboard"
			@close="showProjectDashboard = false"
		/>
		<SettingsPanel :is-open="showSettings" @close="showSettings = false" />
		<HelpPanel :is-open="showHelp" @close="showHelp = false" />
		<ToolBox :is-open="showToolbox" @close="showToolbox = false" />
	</div>
</template>
