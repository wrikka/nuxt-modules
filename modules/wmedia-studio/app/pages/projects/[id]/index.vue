<script setup lang="ts">
import type { Project } from "#shared/types/project";

const route = useRoute();
const router = useRouter();
const { fetchProject, duplicateProject, archiveProject, loading, error } =
	useProject();

const project = ref<Project | null>(null);

onMounted(async () => {
	const projectId = route.params.id as string;
	project.value = await fetchProject(projectId);
});

const handleDuplicate = async () => {
	if (!project.value) return;
	const newProject = await duplicateProject(project.value.id);
	if (newProject) {
		router.push(`/projects/${newProject.id}`);
	}
};

const handleArchive = async () => {
	if (!project.value) return;
	const archivedProject = await archiveProject(project.value.id);
	if (archivedProject) {
		router.push("/projects");
	}
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div v-if="loading" class="flex items-center justify-center py-12">
				<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
			</div>

			<div
				v-else-if="error"
				class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
			>
				{{ error }}
			</div>

			<div v-else-if="project">
				<div class="mb-8 flex items-center justify-between">
					<div>
						<NuxtLink
							to="/projects"
							class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						>
							<i class="i-mdi-arrow-left mr-1" />
							Back to Projects
						</NuxtLink>
						<h1 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
							{{ project.name }}
						</h1>
						<p
							v-if="project.description"
							class="mt-1 text-gray-600 dark:text-gray-400"
						>
							{{ project.description }}
						</p>
					</div>
					<div class="flex gap-2">
						<NuxtLink
							:to="`/projects/${project.id}/settings`"
							class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<i class="i-mdi-cog mr-1" />
							Settings
						</NuxtLink>
						<NuxtLink
							:to="`/projects/${project.id}/export`"
							class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<i class="i-mdi-download mr-1" />
							Export
						</NuxtLink>
						<NuxtLink
							:to="`/projects/${project.id}/share`"
							class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<i class="i-mdi-share-variant mr-1" />
							Share
						</NuxtLink>
						<NuxtLink
							:to="`/projects/${project.id}/history`"
							class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<i class="i-mdi-history mr-1" />
							History
						</NuxtLink>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div class="lg:col-span-2">
						<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
							<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
								Project Details
							</h2>
							<div class="mt-4 space-y-4">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-sm text-gray-500 dark:text-gray-400">Type</p>
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											{{ project.type || "N/A" }}
										</p>
									</div>
									<div>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											Status
										</p>
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											{{ project.status || "Active" }}
										</p>
									</div>
									<div>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											Canvas Size
										</p>
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											{{ project.width }} x {{ project.height }}
										</p>
									</div>
									<div>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											Version
										</p>
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											v{{ project.version }}
										</p>
									</div>
								</div>
								<div>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										Created
									</p>
									<p class="text-sm font-medium text-gray-900 dark:text-white">
										{{ formatDate(project.createdAt) }}
									</p>
								</div>
								<div>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										Last Modified
									</p>
									<p class="text-sm font-medium text-gray-900 dark:text-white">
										{{ formatDate(project.updatedAt) }}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div>
						<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
							<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
								Quick Actions
							</h2>
							<div class="mt-4 space-y-2">
								<NuxtLink
									v-if="project.type === 'designer'"
									:to="`/designer/${project.id}`"
									class="flex w-full items-center justify-between rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
								>
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>Open in Designer</span>
									<i class="i-mdi-arrow-right text-gray-500" />
								</NuxtLink>
								<NuxtLink
									v-else-if="project.type === 'audio-editor'"
									:to="`/audio-editor/${project.id}`"
									class="flex w-full items-center justify-between rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
								>
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>Open in Audio Editor</span>
									<i class="i-mdi-arrow-right text-gray-500" />
								</NuxtLink>
								<NuxtLink
									v-else-if="project.type === 'video-editor'"
									:to="`/video-editor/${project.id}`"
									class="flex w-full items-center justify-between rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
								>
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>Open in Video Editor</span>
									<i class="i-mdi-arrow-right text-gray-500" />
								</NuxtLink>
								<NuxtLink
									v-else-if="project.type === 'video-recording'"
									:to="`/video-recording/${project.id}`"
									class="flex w-full items-center justify-between rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
								>
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>Open in Video Recording</span>
									<i class="i-mdi-arrow-right text-gray-500" />
								</NuxtLink>
								<button
									@click="handleDuplicate"
									class="flex w-full items-center justify-between rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
								>
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>Duplicate Project</span>
									<i class="i-mdi-content-copy text-gray-500" />
								</button>
								<button
									@click="handleArchive"
									class="flex w-full items-center justify-between rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
								>
									<span
										class="text-sm font-medium text-gray-900 dark:text-white"
									>Archive Project</span>
									<i class="i-mdi-archive text-gray-500" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
