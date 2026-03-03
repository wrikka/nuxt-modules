<script setup lang="ts">
import { format } from "date-fns";
import {
	useBulkSelection,
	useKeyboardShortcuts,
	useProjectFilters,
	useProjects,
} from "@wrikka/composables";

const router = useRouter();

// Projects management
const {
	projects,
	folders,
	loading,
	allTags,
	recentProjects,
	createProject,
	duplicateProject,
	moveToTrash,
	restoreFromTrash,
	permanentDelete,
	toggleFavorite,
	addTag,
	removeTag,
	saveAsTemplate,
} = useProjects();

// Filters and sorting
const {
	currentFolder,
	searchQuery,
	sortBy,
	sortOrder,
	viewMode,
	showFavoritesOnly,
	showTrash,
	filteredProjects,
	resultCount,
	toggleSortOrder,
	setFolder,
	toggleTrash,
} = useProjectFilters({ projects: projects.value });

// Bulk selection
const {
	selectedIds: selectedProjects,
	selectedCount,
	isAllSelected,
	hasSelection,
	select: selectProject,
	selectAll,
	clearSelection,
} = useBulkSelection({
	items: filteredProjects,
	getId: (p) => p.id,
});

// UI State
const previewProject = ref(null);
const shareProjectId = ref<string | null>(null);
const duplicateProjectId = ref<string | null>(null);
const tagManagerProject = ref(null);
const showImportModal = ref(false);
const showCommandPalette = ref(false);
const showActivitySidebar = ref(false);

// Mock activities
const activities = ref([
	{
		id: "1",
		userId: "user1",
		userName: "You",
		action: "created",
		entityName: "Summer Campaign",
		entityType: "project",
		createdAt: new Date(Date.now() - 1000 * 60 * 30),
	},
	{
		id: "2",
		userId: "user1",
		userName: "You",
		action: "updated",
		entityName: "Logo Design",
		entityType: "project",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
	},
	{
		id: "3",
		userId: "user1",
		userName: "You",
		action: "favorited",
		entityName: "Brand Guidelines",
		entityType: "project",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
	},
]);

// Actions
const openProject = (projectId: string) => {
	router.push(`/editor/${projectId}`);
};

const createNewProject = async () => {
	const projectId = await createProject({
		name: "Untitled Project",
		width: 1920,
		height: 1080,
	});
	router.push(`/editor/${projectId}`);
};

// Bulk actions
const bulkDelete = async () => {
	if (!confirm(`Move ${selectedCount.value} projects to trash?`)) return;
	for (const id of selectedProjects.value) {
		await moveToTrash(id);
	}
	clearSelection();
};

const bulkDuplicate = async () => {
	for (const id of selectedProjects.value) {
		await duplicateProject(id);
	}
	clearSelection();
};

// Keyboard shortcuts
useKeyboardShortcuts({
	shortcuts: [
		{
			key: "k",
			meta: true,
			action: () => (showCommandPalette.value = true),
		},
	],
});
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
		<!-- Main Content -->
		<div class="flex-1">
			<div class="container mx-auto px-4 py-8">
				<!-- Header -->
				<div class="flex items-center justify-between mb-8">
					<div>
						<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
							{{ showTrash ? "Trash" : "My Projects" }}
						</h1>
						<p class="text-gray-600 dark:text-gray-400 mt-1">
							{{ resultCount }} project{{ resultCount !== 1 ? "s" : "" }}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<!-- View Toggle -->
						<div class="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
							<button
								class="p-2 rounded-md transition-colors"
								:class="viewMode === 'grid'
								? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
								: 'text-gray-500 hover:text-gray-700'"
								@click="viewMode = 'grid'"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
									/>
								</svg>
							</button>
							<button
								class="p-2 rounded-md transition-colors"
								:class="viewMode === 'list'
								? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
								: 'text-gray-500 hover:text-gray-700'"
								@click="viewMode = 'list'"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>

						<!-- Import Button -->
						<button
							class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
							@click="showImportModal = true"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
							Import
						</button>

						<!-- New Project -->
						<button
							class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
							@click="createNewProject"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
							New Project
						</button>
					</div>
				</div>

				<!-- Toolbar -->
				<div class="flex flex-wrap items-center gap-4 mb-6">
					<!-- Search -->
					<div class="relative flex-1 min-w-64">
						<svg
							class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search projects..."
							class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<!-- Sort -->
					<select
						v-model="sortBy"
						class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
					>
						<option value="updated">Last Updated</option>
						<option value="created">Date Created</option>
						<option value="name">Name</option>
						<option value="size">Size</option>
					</select>

					<button
						class="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						@click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
					>
						<svg
							class="w-5 h-5 text-gray-600 dark:text-gray-400"
							:class="{ 'rotate-180': sortOrder === 'asc' }"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					<!-- Favorites Toggle -->
					<button
						class="px-4 py-2 rounded-lg border transition-colors flex items-center gap-2"
						:class="showFavoritesOnly
						? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 text-yellow-700 dark:text-yellow-400'
						: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'"
						@click="showFavoritesOnly = !showFavoritesOnly"
					>
						<svg
							class="w-5 h-5"
							:fill="showFavoritesOnly ? 'currentColor' : 'none'"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
							/>
						</svg>
						Favorites
					</button>

					<!-- Trash Toggle -->
					<button
						class="px-4 py-2 rounded-lg border transition-colors flex items-center gap-2"
						:class="showTrash
						? 'bg-red-100 dark:bg-red-900/30 border-red-300 text-red-700 dark:text-red-400'
						: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'"
						@click="showTrash = !showTrash"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Trash
					</button>

					<!-- Activity Toggle -->
					<button
						class="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						:class="{ 'text-blue-500': showActivitySidebar }"
						@click="showActivitySidebar = !showActivitySidebar"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>
				</div>

				<!-- Folders & Select All -->
				<div class="flex items-center justify-between mb-6">
					<div class="flex gap-2 overflow-x-auto pb-2">
						<button
							class="px-4 py-2 font-medium transition-colors whitespace-nowrap rounded-lg"
							:class="currentFolder === null && !showTrash
							? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
							: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
							@click="currentFolder = null;
							showTrash = false;"
						>
							All Projects
						</button>
						<button
							v-for="folder in folders"
							:key="folder.id"
							class="px-4 py-2 font-medium transition-colors whitespace-nowrap rounded-lg"
							:class="currentFolder === folder.id
							? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
							: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
							@click="currentFolder = folder.id;
							showTrash = false;"
						>
							{{ folder.name }}
						</button>
					</div>
					<button
						v-if="resultCount > 0 && !showTrash"
						class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						@click="selectAll"
					>
						{{
							isAllSelected
								? "Deselect All"
								: "Select All"
						}}
					</button>
				</div>

				<!-- Recent Projects -->
				<div
					v-if="!showTrash && !searchQuery && !showFavoritesOnly
					&& currentFolder === null"
					class="mb-8"
				>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Recent Projects
					</h2>
					<div class="flex gap-4 overflow-x-auto pb-4">
						<div
							v-for="project in recentProjects.slice(0, 5)"
							:key="project.id"
							class="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
							@click="openProject(project.id)"
						>
							<div class="aspect-video bg-gray-100 dark:bg-gray-700 relative">
								<img
									v-if="project.thumbnail"
									:src="project.thumbnail"
									class="w-full h-full object-cover"
								/>
								<div
									v-else
									class="w-full h-full flex items-center justify-center text-4xl"
								>
									{{
										project.type === "video-editor"
										? "🎬"
										: project.type === "audio-editor"
										? "🎵"
										: "🎨"
									}}
								</div>
							</div>
							<div class="p-3">
								<h3 class="font-medium text-gray-900 dark:text-white truncate">
									{{ project.name }}
								</h3>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									{{ format(project.updatedAt, "MMM d") }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="text-center py-12">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500">
					</div>
					<p class="mt-4 text-gray-600 dark:text-gray-300">
						Loading projects...
					</p>
				</div>

				<!-- Empty State -->
				<div
					v-else-if="resultCount === 0"
					class="text-center py-16"
				>
					<div class="text-6xl mb-4">📁</div>
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						{{ showTrash ? "Trash is empty" : "No projects found" }}
					</h3>
					<p class="text-gray-600 dark:text-gray-400 mb-6">
						{{
							showTrash
							? "Deleted projects will appear here"
							: searchQuery
							? "Try a different search term"
							: "Create your first project to get started"
						}}
					</p>
					<button
						v-if="!showTrash && !searchQuery"
						class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
						@click="createNewProject"
					>
						Create New Project
					</button>
				</div>

				<!-- Projects Grid/List -->
				<div
					v-else
					:class="viewMode === 'grid'
					? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
					: 'space-y-2'"
				>
					<ProjectCard
						v-for="project in filteredProjects"
						:key="project.id"
						:project="project"
						:view-mode="viewMode"
						:selected="selectedProjects.has(project.id)"
						@select="selectProject"
						@open="openProject"
						@duplicate="duplicateProjectId = $event"
						@delete="showTrash ? permanentDelete($event) : moveToTrash($event)"
						@favorite="toggleFavorite"
						@share="shareProjectId = $event"
						@preview="previewProject = project"
					/>
				</div>
			</div>
		</div>

		<!-- Activity Sidebar -->
		<ActivityFeedSidebar
			v-if="showActivitySidebar"
			:activities="activities"
		/>
	</div>

	<!-- Modals -->
	<ProjectPreviewModal
		:project="previewProject"
		@close="previewProject = null"
		@open="openProject($event);
		previewProject = null;"
	/>

	<DuplicateOptionsModal
		v-if="duplicateProjectId"
		:project-name="projects.find(p => p.id === duplicateProjectId)?.name || ''"
		@close="duplicateProjectId = null"
		@duplicate="duplicateProject(duplicateProjectId!);
		duplicateProjectId = null;"
	/>

	<TagManager
		v-if="tagManagerProject"
		:tags="tagManagerProject.tags || []"
		:all-tags="allTags"
		@add="addTag(tagManagerProject!.id, $event)"
		@remove="removeTag(tagManagerProject!.id, $event)"
		@close="tagManagerProject = null"
	/>

	<ImportModal
		v-if="showImportModal"
		@import="console.log('Import:', $event)"
		@close="showImportModal = false"
	/>

	<CommandPalette
		:projects="projects"
		:is-open="showCommandPalette"
		@close="showCommandPalette = false"
		@open-project="openProject($event);
		showCommandPalette = false;"
		@create-project="createNewProject();
		showCommandPalette = false;"
	/>

	<!-- Bulk Actions Toolbar -->
	<BulkActionsToolbar
		v-if="hasSelection"
		:selected-count="selectedCount"
		@delete="bulkDelete"
		@duplicate="bulkDuplicate"
		@move="console.log('Move')"
		@tag="console.log('Tag')"
		@archive="console.log('Archive')"
		@clear="clearSelection"
	/>
</template>
