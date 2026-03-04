<script setup lang="ts">
const projects = ref([
	{
		id: 1,
		name: "Product Review Q1",
		recordings: 12,
		lastModified: "2 hours ago",
		color: "blue",
	},
	{
		id: 2,
		name: "Tutorial Series",
		recordings: 24,
		lastModified: "1 day ago",
		color: "green",
	},
	{
		id: 3,
		name: "Podcast Episodes",
		recordings: 8,
		lastModified: "3 days ago",
		color: "purple",
	},
	{
		id: 4,
		name: "Client Interviews",
		recordings: 5,
		lastModified: "1 week ago",
		color: "orange",
	},
]);

const selectedProject = ref<number | null>(null);
const newProjectName = ref("");
const newProjectColor = ref("blue");
const isCreating = ref(false);

const colors = [
	"blue",
	"green",
	"purple",
	"orange",
	"red",
	"pink",
	"cyan",
	"amber",
];

const createProject = () => {
	if (!newProjectName.value.trim()) return;
	projects.value.push({
		id: Date.now(),
		name: newProjectName.value,
		recordings: 0,
		lastModified: "Just now",
		color: newProjectColor.value,
	});
	newProjectName.value = "";
	isCreating.value = false;
};

const deleteProject = (id: number) => {
	projects.value = projects.value.filter(p => p.id !== id);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
					<Icon
						name="mdi:folder"
						class="w-5 h-5 text-sky-600 dark:text-sky-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Recording Projects
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Organize recordings into folders
					</p>
				</div>
			</div>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				@click="isCreating = !isCreating"
			>
				<Icon
					name="mdi:plus"
					class="w-5 h-5 text-gray-600 dark:text-gray-400"
				/>
			</button>
		</div>

		<div
			v-if="isCreating"
			class="mb-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg"
		>
			<div class="space-y-2">
				<input
					v-model="newProjectName"
					type="text"
					placeholder="Project name..."
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
				<div class="flex gap-1">
					<button
						v-for="color in colors"
						:key="color"
						:class="`w-6 h-6 rounded-full bg-${color}-500 ${
							newProjectColor === color
								? 'ring-2 ring-offset-2 ring-gray-400'
								: ''
						}`"
						@click="newProjectColor = color"
					/>
				</div>
				<div class="flex gap-2">
					<button
						class="flex-1 py-1.5 bg-sky-600 text-white rounded-lg text-sm"
						@click="createProject"
					>
						Create
					</button>
					<button
						class="px-3 py-1.5 border rounded-lg text-sm"
						@click="isCreating = false"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<button
				v-for="project in projects"
				:key="project.id"
				:class="[
					'w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3',
					selectedProject === project.id
						? `border-${project.color}-500 bg-${project.color}-50 dark:bg-${project.color}-900/20`
						: 'border-gray-200 dark:border-gray-700 hover:border-sky-300',
				]"
				@click="selectedProject = project.id"
			>
				<div :class="`w-10 h-10 rounded-lg bg-${project.color}-100 dark:bg-${project.color}-900/30 flex items-center justify-center`">
					<Icon
						name="mdi:folder"
						:class="`w-5 h-5 text-${project.color}-600`"
					/>
				</div>
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-gray-900 dark:text-white truncate">
						{{ project.name }}
					</div>
					<div class="text-xs text-gray-500">
						{{ project.recordings }} recordings • {{ project.lastModified }}
					</div>
				</div>
				<button
					class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
					@click.stop="deleteProject(project.id)"
				>
					<Icon name="mdi:delete" class="w-4 h-4 text-gray-400" />
				</button>
			</button>
		</div>

		<div v-if="projects.length === 0" class="text-center py-8">
			<Icon
				name="mdi:folder-outline"
				class="w-12 h-12 mx-auto text-gray-300 mb-2"
			/>
			<p class="text-sm text-gray-500">No projects yet</p>
		</div>
	</div>
</template>
